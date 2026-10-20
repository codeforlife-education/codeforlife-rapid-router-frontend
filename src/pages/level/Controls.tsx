import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Speed as SpeedIcon,
  Stop as StopIcon,
} from "@mui/icons-material"
import { type FC, useCallback, useState } from "react"
import type { PayloadAction } from "@reduxjs/toolkit"

import * as miniDrawers from "../../components/miniDrawers"
import {
  type GameCommand,
  PLAY_SPEEDS,
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setPlaySpeed,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useConsoleLogContext,
  useGameIsDefined,
  useGameOnLastStep,
  usePhaserGameContext,
  usePythonEditorContext,
  useSettings,
} from "../../app/hooks"
import { type Level } from "../../api/level"
import { ZoomControls } from "../../phaser"
import { getSolution } from "./solutions"
import { usePlayInterval } from "../../phaser/usePlayInterval"

export type ControlsProps = { level: Pick<Level, "mode"> }

const Base: FC<
  Pick<miniDrawers.MiniDrawerProps, "onOpened" | "onClosed"> & {
    panelCount: number
    onClear: () => void
    /** Loads the level's model solution, if one exists - the Solve button
     * is hidden entirely when this is omitted (e.g. Custom levels). */
    onSolve?: () => void
    interpretCommands: () => Promise<GameCommand[] | undefined>
  }
> = ({
  panelCount,
  onClear,
  onSolve,
  interpretCommands,
  onOpened,
  onClosed,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const gameIsDefined = useGameIsDefined()
  const gameOnLastStep = useGameOnLastStep()
  const [setPlayInterval, clearPlayInterval] = usePlayInterval()
  const { activeSceneKeys, phase, setPhase } = usePhaserGameContext()

  // Helper to map panel layout options to menu items.
  function mapPanelLayoutsToMenuItems<
    O extends readonly (string | undefined)[],
  >(
    panelLayoutOptions: O,
    setPanelLayout: (layout: O[number]) => PayloadAction<O[number]>,
  ): miniDrawers.MenuItemProps<O[number]>["menuItems"] {
    return panelLayoutOptions.map(panelLayout => ({
      value: panelLayout,
      key: panelLayout ?? "auto",
      onClick: () => dispatch(setPanelLayout(panelLayout)),
    }))
  }

  return (
    <>
      {activeSceneKeys.includes("Play.LEVEL") && <ZoomControls />}
      <miniDrawers.MiniDrawer
        open={isDrawerOpen}
        onToggle={() => {
          setIsDrawerOpen(!isDrawerOpen)
        }}
        onOpened={onOpened}
        onClosed={onClosed}
      >
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text={phase === "playing" ? "Pause" : "Play"}
          icon={phase === "playing" ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => {
            if (clearPlayInterval()) {
              setPhase("paused")
              return
            }
            if (gameIsDefined) {
              if (gameOnLastStep || phase === "crashed") dispatch(restartGame())
              setPlayInterval()
            } else
              void interpretCommands().then(
                commands => commands?.length && setPlayInterval(),
              )
          }}
        />
        <miniDrawers.MenuItem
          isDrawerOpen={isDrawerOpen}
          icon={<SpeedIcon />}
          text="Speed"
          menuItems={PLAY_SPEEDS.map(playSpeed => ({
            value: playSpeed,
            key: playSpeed,
            onClick: () => dispatch(setPlaySpeed(playSpeed)),
          }))}
          selectedValue={settings.playSpeed}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Stop"
          icon={<StopIcon />}
          disabled={phase === "idle" || !gameIsDefined}
          onClick={() => {
            clearPlayInterval()
            dispatch(restartGame())
            setPhase("idle")
          }}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Step"
          icon={<RedoIcon />}
          onClick={() => {
            clearPlayInterval()
            if (!gameIsDefined) {
              void interpretCommands().then(
                commands => commands?.length && setPhase("paused"),
              )
              return
            }
            // Reveal the current index without advancing past it when
            // nothing has been shown yet - only advance once something has.
            if (phase !== "idle") {
              if (gameOnLastStep || phase === "crashed") dispatch(restartGame())
              else dispatch(nextGameCommand())
            }
            setPhase("paused")
          }}
        />
        <miniDrawers.MenuItem
          isDrawerOpen={isDrawerOpen}
          text="Layout"
          icon={<AutoAwesomeMosaicIcon />}
          menuItems={
            panelCount === 2
              ? mapPanelLayoutsToMenuItems(TWO_PANEL_LAYOUTS, setTwoPanelLayout)
              : mapPanelLayoutsToMenuItems(
                  THREE_PANEL_LAYOUTS,
                  setThreePanelLayout,
                )
          }
          selectedValue={
            panelCount === 2
              ? settings.twoPanelLayout
              : settings.threePanelLayout
          }
        />
        {onSolve && (
          <miniDrawers.ButtonItem
            isDrawerOpen={isDrawerOpen}
            text="Solve"
            icon={<CheckIcon />}
            onClick={() => {
              clearPlayInterval()
              onSolve()
            }}
          />
        )}
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Clear"
          icon={<DeleteIcon />}
          onClick={() => {
            clearPlayInterval()
            onClear()
          }}
        />
      </miniDrawers.MiniDrawer>
    </>
  )
}

const Blockly: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const clearBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.clear()
  }, [blocklyWorkspaceContext])
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])
  const interpretBlocklyWorkspace = useCallback(async () => {
    return await blocklyWorkspaceContext?.ref.current?.interpret()
  }, [blocklyWorkspaceContext])
  const solution =
    blocklyWorkspaceContext?.tilemapGroup !== undefined
      ? getSolution(
          blocklyWorkspaceContext.tilemapGroup,
          blocklyWorkspaceContext.levelId,
        )
      : undefined
  const solveBlocklyWorkspace = useCallback(() => {
    if (solution) blocklyWorkspaceContext?.ref.current?.loadSolution(solution)
  }, [blocklyWorkspaceContext, solution])

  return (
    <Base
      panelCount={2}
      interpretCommands={interpretBlocklyWorkspace}
      onClear={clearBlocklyWorkspace}
      onSolve={solution ? solveBlocklyWorkspace : undefined}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
    />
  )
}

const Python: FC = () => {
  const pythonEditorContext = usePythonEditorContext()
  const consoleLogContext = useConsoleLogContext()
  const clearPythonEditorAndConsoleLogs = useCallback(() => {
    if (pythonEditorContext?.mode === "write")
      pythonEditorContext.ref.current?.clear()
    consoleLogContext?.setLogs([])
  }, [pythonEditorContext, consoleLogContext])
  const interpretPythonEditor = useCallback(async () => {
    if (pythonEditorContext?.mode !== "write") return undefined
    return await pythonEditorContext.ref.current?.interpret()
  }, [pythonEditorContext])
  const solution =
    pythonEditorContext?.mode === "write" &&
    pythonEditorContext.tilemapGroup !== undefined
      ? getSolution(
          pythonEditorContext.tilemapGroup,
          pythonEditorContext.levelId,
        )
      : undefined
  const solvePythonEditor = useCallback(() => {
    if (pythonEditorContext?.mode === "write" && solution)
      pythonEditorContext.ref.current?.load(solution)
  }, [pythonEditorContext, solution])

  return (
    <Base
      panelCount={3}
      onClear={clearPythonEditorAndConsoleLogs}
      interpretCommands={interpretPythonEditor}
      onSolve={solution ? solvePythonEditor : undefined}
    />
  )
}

const BlocklyAndPython: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const pythonEditorContext = usePythonEditorContext()
  const clearBlocklyWorkspaceAndPythonEditor = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.clear()
    if (pythonEditorContext?.mode === "write")
      pythonEditorContext.ref.current?.clear()
  }, [blocklyWorkspaceContext, pythonEditorContext])
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])
  const interpretBlocklyWorkspace = useCallback(async () => {
    const interpret = blocklyWorkspaceContext?.ref.current?.interpret
    return await interpret?.("python")
  }, [blocklyWorkspaceContext])
  const solution =
    blocklyWorkspaceContext?.tilemapGroup !== undefined
      ? getSolution(
          blocklyWorkspaceContext.tilemapGroup,
          blocklyWorkspaceContext.levelId,
        )
      : undefined
  const solveBlocklyWorkspace = useCallback(() => {
    if (solution) blocklyWorkspaceContext?.ref.current?.loadSolution(solution)
  }, [blocklyWorkspaceContext, solution])

  return (
    <Base
      panelCount={3}
      onClear={clearBlocklyWorkspaceAndPythonEditor}
      interpretCommands={interpretBlocklyWorkspace}
      onSolve={solution ? solveBlocklyWorkspace : undefined}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
    />
  )
}

const Controls: FC<ControlsProps> = ({ level }) =>
  ({
    blockly: <Blockly />,
    python: <Python />,
    blocklyAndPython: <BlocklyAndPython />,
  })[level.mode]

export default Controls
