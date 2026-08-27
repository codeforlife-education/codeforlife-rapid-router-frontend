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
import {
  useGameCommandIndex,
  useGameCommands,
  usePhaserGameContext,
} from "../app/hooks"
import type { Level } from "../api/level"
import type { PhaserGameRef } from "./PhaserGameContext"

export type PhaserGameProps =
  | { mode: "play"; levelId: Level["id"] }
  | { mode: "create"; levelId?: never }

const PhaserGame: FC<PhaserGameProps> = ({ mode, levelId }) => {
  const phaserGameContext = usePhaserGameContext()
  const gameCommands = useGameCommands()
  const gameCommandIndex = useGameCommandIndex()
  const [gameIsInitialized, setGameIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game>(null)

  if (!phaserGameContext)
    throw ReferenceError("Phaser game context not provided.")
  const { ref, setActiveSceneKeys } = phaserGameContext

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
      return () => events.off(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
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

      // Dynamically import Phaser and our scenes.
      // NOTE: This makes Phaser a browser-only dependency.
      const Phaser = await import("phaser")
      const { default: scene } = (await import(
        `./scenes/${mode}/index.ts`
      )) as { default: Phaser.Scene[] }

      // Run the checks again to ensure that the component was not unmounted
      // and remounted while the imports were being asynchronously fetched.
      // Otherwise, we might try to create multiple Phaser games on top of each
      // other in the latest component's container.
      if (!containerRef.current || !active) return

      // Find out more information about the Game Config at:
      // https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        scale: {
          // Scale the game to fit inside the parent container while maintaining
          // the aspect ratio.
          mode: Phaser.Scale.FIT,
          // Keep the game canvas centered horizontally and vertically within
          // its container.
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: "100%", // Use the full width of the parent container.
          height: "100%", // Use the full height of the parent container.
          resizeInterval: 100, // Check for resize every 100ms.
        },
        parent: containerRef.current,
        scene,
      })

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
      if (gameRef.current) {
        gameRef.current.events.off(
          Events.SCENE_ACTIVITY_CHANGED,
          onSceneActivityChanged,
        )
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [mode, levelId, setActiveSceneKeys])

  // Pass the current level ID to Phaser when in play mode.
  useEffect(() => {
    if (mode === "play") setVariable("levelId", levelId)
  }, [mode, levelId, setVariable])

  // Pass the current game commands to Phaser when in play mode.
  useEffect(() => {
    if (mode === "play") setVariable("commands", gameCommands)
  }, [mode, gameCommands, setVariable])

  // Pass the current game command index to Phaser when in play mode.
  useEffect(() => {
    if (mode === "play") setVariable("commandIndex", gameCommandIndex)
  }, [mode, gameCommandIndex, setVariable])

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
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}

export default PhaserGame
