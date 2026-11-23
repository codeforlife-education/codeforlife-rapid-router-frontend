import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { CircularProgress } from "@mui/material"
// NOTE: `import type` is a TypeScript feature that only imports type
//  information for compile-time type checking. When our TypeScript code is
//  compiled into JavaScript, these type-only imports are completely erased.
//  They do not generate any JavaScript code that would cause the phaser module
//  to be loaded at runtime.
import type Phaser from "phaser"

import { Events, type Variable } from "./globals"
import type { ExportedOrthogonalTilemap, TilemapGroup } from "./tilemaps"
import type { LevelResult, PhaserGameRef } from "./PhaserGameContext"
import {
  useAppDispatch,
  useGameCommandIndex,
  useGameCommands,
  useGameRunId,
  usePhaserGameContext,
  useSettings,
} from "../app/hooks"
import type { Level } from "../api/level"
import { finishGameEarly } from "../app/slices"

/**
 * A single audio context shared by every Phaser game. Phaser closes a game's
 * audio context when the game is destroyed, unless it was given one, in which
 * case it only suspends it. Games are recreated whenever the panel layout
 * changes, and closing each one's context left Phaser's own pending
 * `suspend()`/`resume()` calls rejecting with "AudioContext is closed".
 */
let sharedAudioContext: AudioContext | undefined

/**
 * Resolves once the last destroyed game has actually been destroyed. Phaser
 * defers destroying a game until its next frame, so a new game must wait for
 * this, or the old game's teardown (which suspends the shared audio context)
 * could run after the new game resumed it, silencing the new game.
 */
let lastGameDestroyed: Promise<void> = Promise.resolve()
const GAME_DESTROY_TIMEOUT_MS = 1000

/**
 * The size the game's canvas should be to fill the given container. Phaser
 * sizes its canvas in CSS pixels, so on high-DPI screens (e.g. Retina displays
 * and most tablets/phones) the browser would scale it up, blurring everything.
 * Instead, the canvas is sized in physical pixels, and then scaled back down to
 * the container's (CSS) size by a zoom of `1 / devicePixelRatio`.
 */
function getCanvasSize(container: HTMLElement) {
  const pixelRatio = window.devicePixelRatio || 1
  const { width, height } = container.getBoundingClientRect()
  return {
    width: Math.max(1, Math.round(width * pixelRatio)),
    height: Math.max(1, Math.round(height * pixelRatio)),
    zoom: 1 / pixelRatio,
  }
}

export type PhaserGameProps =
  | ({ mode: "play"; levelId: Level["id"] } & (
      | { tilemapGroup: TilemapGroup; tilemap: undefined }
      | { tilemapGroup: undefined; tilemap: ExportedOrthogonalTilemap }
    ))
  | { mode: "create"; levelId?: never }

const PhaserGame: FC<PhaserGameProps> = props => {
  const { mode, levelId } = props
  const tilemapGroup = props.mode === "play" ? props.tilemapGroup : undefined
  const tilemap = props.mode === "play" ? props.tilemap : undefined
  const phaserGameContext = usePhaserGameContext()
  const dispatch = useAppDispatch()
  const gameCommands = useGameCommands()
  const gameCommandIndex = useGameCommandIndex()
  const gameRunId = useGameRunId()
  const { muted } = useSettings()
  const [gameIsInitialized, setGameIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game>(null)
  /** The last outcome Phaser reported (and so already played a sound for). */
  const phaserOutcomeRef = useRef<LevelResult>(undefined)
  /**
   * The variables the game's scenes need as soon as they start (e.g. which
   * level to load), kept up to date on every render so they can be written to
   * a new game's registry the moment it's created - rather than waiting for
   * the effects below, which only run after a rerender and so could lose the
   * race against the Preloader scene reading them.
   */
  const initialVariablesRef = useRef<Partial<Record<Variable, unknown>>>({})

  if (!phaserGameContext)
    throw ReferenceError("Phaser game context not provided.")
  const {
    ref,
    setActiveSceneKeys,
    phase,
    setPhase,
    maxFuel,
    levelResult,
    setLevelResult,
  } = phaserGameContext

  initialVariablesRef.current =
    mode === "play"
      ? { levelId, maxFuel, tilemapGroup, exportedLevel: tilemap }
      : {}

  const getVariable = useCallback(
    (<T,>(
      getKey: Variable,
      set: Dispatch<SetStateAction<T | undefined>>,
      defaultValue?: T,
    ) => {
      if (!gameIsInitialized || !gameRef.current) return () => {}
      const { events, registry } = gameRef.current

      // Listen for updates to the variable and update the state accordingly.
      const onPhaserSetVariable: Phaser.Events.PhaserSetVariable = setKey => {
        if (getKey !== setKey) return
        set((registry.get(getKey) as T | undefined) ?? defaultValue)
      }
      // Immediately get the current value.
      onPhaserSetVariable(getKey)
      // Listen for future updates to the variable.
      events.on(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
      // Return a cleanup function to remove the event listener when the
      // component unmounts or the dependencies change.
      return () => {
        events.off(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
      }
    }) as PhaserGameRef["getVariable"],
    [gameIsInitialized],
  )

  const setVariable = useCallback(
    ((key, value) => {
      if (!gameIsInitialized || !gameRef.current) return
      const { events, registry } = gameRef.current

      registry.set(key, value)
      events.emit(Events.REACT_SET_VARIABLE, key)
    }) as PhaserGameRef["setVariable"],
    [gameIsInitialized],
  )

  // Expose Phaser game methods to parent components.
  useImperativeHandle(ref, () => {
    const { events } = (gameIsInitialized ? gameRef.current : null) || {}

    return {
      zoomIn: () => events?.emit(Events.ZOOM_IN),
      zoomOut: () => events?.emit(Events.ZOOM_OUT),
      exportLevel: () => events?.emit(Events.EXPORT_LEVEL),
      getVariable,
      setVariable,
    }
  }, [gameIsInitialized, getVariable, setVariable])

  // Initialize Phaser when on mount and destroy it when it's unmounted.
  useEffect(() => {
    let active = true // Used to synchronously guard initialization logic.

    // Each scene (see `BaseScene`) broadcasts its own active/inactive status
    // onto the game's event emitter, along with its key. Use this to keep
    // track of which scene keys are currently active.
    const onSceneActivityChanged: Phaser.Events.SceneActivityChanged = (
      key,
      isActive,
    ) =>
      setActiveSceneKeys(prevActiveSceneKeys => {
        const wasActive = prevActiveSceneKeys.includes(key)
        if (isActive === wasActive) return prevActiveSceneKeys // No change.

        return isActive
          ? [...prevActiveSceneKeys, key]
          : prevActiveSceneKeys.filter(activeKey => activeKey !== key)
      })

    const initPhaser = async () => {
      // Check if the container ref is set and the component is still active.
      if (!containerRef.current || !active) return

      // Dynamically import Phaser and our scenes, and wait for any previous
      // game to finish being destroyed (see `lastGameDestroyed`).
      // NOTE: This makes Phaser a browser-only dependency.
      const Phaser = await import("phaser")
      const { default: scene } = (await import(
        `./scenes/${mode}/index.ts`
      )) as { default: Phaser.Scene[] }
      await lastGameDestroyed

      // Run the checks again to ensure that the component was not unmounted
      // and remounted while the imports were being asynchronously fetched.
      // Otherwise, we might try to create multiple Phaser games on top of each
      // other in the latest component's container.
      if (!containerRef.current || !active) return

      // Find out more information about the Game Config at:
      // https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
      const { width, height, zoom } = getCanvasSize(containerRef.current)
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
          // The game canvas is sized to always fill the whole parent container
          // - by us, rather than Phaser (see the resize observer below), as
          // Phaser doesn't account for the screen's pixel density. The scenes
          // listen for resizes to reposition and resize their contents (see
          // `BaseScene.onResize`).
          mode: Phaser.Scale.NONE,
          width,
          height,
          zoom,
        },
        render: {
          // Smoothly scale down textures displayed smaller than their size
          // (e.g. when zoomed out), rather than leaving them jagged.
          mipmapFilter: "LINEAR_MIPMAP_LINEAR",
        },
        parent: containerRef.current,
        scene,
        audio: { context: (sharedAudioContext ??= new AudioContext()) },
      })

      // Seed the registry before any scene can start and read from it.
      for (const [key, value] of Object.entries(initialVariablesRef.current))
        gameRef.current.registry.set(key, value)

      // Listen for scene activity changes broadcast by each scene.
      gameRef.current.events.on(
        Events.SCENE_ACTIVITY_CHANGED,
        onSceneActivityChanged,
      )

      setGameIsInitialized(true) // Used to asynchronously trigger a rerender.
    }

    void initPhaser()

    return () => {
      active = false
      const game = gameRef.current
      if (game) {
        game.events.off(Events.SCENE_ACTIVITY_CHANGED, onSceneActivityChanged)
        // NOTE: "destroy" is `Phaser.Core.Events.DESTROY`, which can't be
        // referenced here as Phaser is only imported as a type. Times out in
        // case the game never gets to run the frame that destroys it.
        lastGameDestroyed = new Promise(resolve => {
          game.events.once("destroy", () => resolve())
          setTimeout(resolve, GAME_DESTROY_TIMEOUT_MS)
        })
        game.destroy(true)
        gameRef.current = null
        // So the effects that sync variables into the game rerun for the next
        // game, rather than staying stuck on the destroyed one.
        setGameIsInitialized(false)
      }
    }
  }, [mode, levelId, setActiveSceneKeys])

  // Resize the game whenever its container is resized (e.g. a device is
  // rotated or a panel is resized) - see `getCanvasSize`.
  useEffect(() => {
    const container = containerRef.current
    if (!gameIsInitialized || !gameRef.current || !container) return
    const { scale, loop } = gameRef.current

    const observer = new ResizeObserver(() => {
      const { width, height, zoom } = getCanvasSize(container)
      if (
        width === scale.width &&
        height === scale.height &&
        zoom === scale.zoom
      )
        return
      // The pixel density changes too, e.g. when the browser is zoomed.
      if (zoom !== scale.zoom) scale.setZoom(zoom)
      scale.resize(width, height)
      // Resizing the canvas clears it, so render a frame straight away.
      // Otherwise, the cleared (black) canvas would be painted until Phaser's
      // next frame, making it flicker while being resized. Resize observers
      // are called before the browser paints, so this frame is painted
      // instead.
      loop.tick()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [gameIsInitialized])

  // Pass the current level ID to Phaser when in play mode.
  useEffect(() => {
    if (mode === "play") setVariable("levelId", levelId)
  }, [mode, levelId, setVariable])

  // Pass the level's max fuel to Phaser when in play mode, if it specifies
  // one - otherwise Phaser falls back to its own default.
  useEffect(() => {
    if (mode === "play") setVariable("maxFuel", maxFuel)
  }, [mode, maxFuel, setVariable])

  // Pass which tilemap to load to Phaser when in play mode - a predefined
  // group (dynamically imported) or an already-fetched custom level's
  // exported tilemap (reusing the same variable the level creator writes).
  useEffect(() => {
    if (mode !== "play") return
    setVariable("tilemapGroup", tilemapGroup)
    setVariable("exportedLevel", tilemap)
  }, [mode, tilemapGroup, tilemap, setVariable])

  // Pass the current game commands to Phaser when in play mode.
  useEffect(() => {
    if (mode === "play") setVariable("commands", gameCommands)
  }, [mode, gameCommands, setVariable])

  // Pass the current run id and command index to Phaser together, as a
  // single value, when in play mode - so a restart is always observed
  // atomically, never as a torn update where only one half has arrived.
  useEffect(() => {
    if (mode !== "play") return
    setVariable("commandIndex", {
      runId: gameRunId,
      index: phase === "idle" ? -1 : gameCommandIndex,
    } as Phaser.Types.Variables.CommandIndex)
  }, [mode, gameRunId, gameCommandIndex, phase, setVariable])

  // Listen for Phaser reporting a crash, and end the game early at whichever
  // command index it passes - and for the run's outcome, to show the player.
  useEffect(() => {
    if (mode !== "play" || !gameIsInitialized || !gameRef.current) return
    const { events } = gameRef.current

    const onFinishEarly: Phaser.Events.FinishEarly = commandIndex => {
      dispatch(finishGameEarly(commandIndex))
      setPhase("crashed")
    }
    const onLevelOutcome: Phaser.Events.LevelOutcome = outcome => {
      phaserOutcomeRef.current = outcome
      setLevelResult?.(outcome)
    }
    events.on(Events.FINISH_EARLY, onFinishEarly)
    events.on(Events.LEVEL_OUTCOME, onLevelOutcome)
    return () => {
      events.off(Events.FINISH_EARLY, onFinishEarly)
      events.off(Events.LEVEL_OUTCOME, onLevelOutcome)
    }
  }, [mode, gameIsInitialized, dispatch, setPhase, setLevelResult])

  // Mute (or unmute) all of the game's sounds.
  useEffect(() => {
    if (gameIsInitialized && gameRef.current) gameRef.current.sound.mute = muted
  }, [gameIsInitialized, muted])

  // Pass the run's phase to Phaser when in play mode (e.g. to pause sounds).
  useEffect(() => {
    if (mode === "play") setVariable("phase", phase)
  }, [mode, phase, setVariable])

  // Play a sound for a result that didn't come from Phaser playing the run
  // back (which plays its own) - e.g. the program couldn't be run at all.
  useEffect(() => {
    if (mode !== "play" || !gameIsInitialized || !gameRef.current) return
    if (!levelResult || levelResult === phaserOutcomeRef.current) return
    gameRef.current.sound.play(
      levelResult.success
        ? "win"
        : levelResult.reason === "program_error"
          ? "tension"
          : "failure",
    )
  }, [mode, gameIsInitialized, levelResult])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!gameIsInitialized && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <div
        id="phaser-game"
        ref={containerRef}
        // Absolutely positioned to fill the wrapper, so the container's size
        // only ever comes from its panel - never from the canvas inside it.
        // Otherwise, the container could get stuck at the canvas's old size
        // (e.g. after a device is rotated), and so the canvas too. Overflow is
        // hidden for the same reason.
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      />
    </div>
  )
}

export default PhaserGame
