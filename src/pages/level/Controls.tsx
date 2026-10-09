import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
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
  useGameHasStarted,
  useGameInPlay,
  useGameIsDefined,
  usePhaserGameContext,
  usePlayInterval,
  usePythonEditorContext,
  useSettings,
} from "../../app/hooks"
import { type Level } from "../../api/level"
import { ZoomControls } from "../../phaser"

export type ControlsProps = { level: Pick<Level, "mode"> }

const Base: FC<
  Pick<miniDrawers.MiniDrawerProps, "onOpened" | "onClosed"> & {
    panelCount: number
    onClear: () => void
    interpretCommands: () => Promise<boolean>
  }
> = ({ panelCount, onClear, interpretCommands, onOpened, onClosed }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const gameIsDefined = useGameIsDefined()
  const gameHasStarted = useGameHasStarted()
  const gameInPlay = useGameInPlay()
  const [playInterval, setPlayInterval, clearPlayInterval] = usePlayInterval()
  const { activeSceneKeys } = usePhaserGameContext()

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
          text={gameInPlay && playInterval ? "Pause" : "Play"}
          icon={gameInPlay && playInterval ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => {
            if (!clearPlayInterval())
              void interpretCommands().then(ok => ok && setPlayInterval)
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
          disabled={!gameHasStarted}
          onClick={() => {
            clearPlayInterval()
            dispatch(restartGame())
          }}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Step"
          icon={<RedoIcon />}
          onClick={() => {
            clearPlayInterval()
            const step = () => dispatch(nextGameCommand())
            if (gameIsDefined) step()
            else void interpretCommands().then(ok => ok && step)
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
    return (await blocklyWorkspaceContext?.ref.current?.interpret()) || false
  }, [blocklyWorkspaceContext])

  return (
    <Base
      panelCount={2}
      interpretCommands={interpretBlocklyWorkspace}
      onClear={clearBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
    />
  )
}

const Python: FC = () => {
  const pythonEditorContext = usePythonEditorContext()
  const clearPythonEditor = useCallback(() => {
    pythonEditorContext?.ref.current?.clear()
  }, [pythonEditorContext])
  const interpretPythonEditor = useCallback(async () => {
    return (await pythonEditorContext?.ref.current?.interpret()) || false
  }, [pythonEditorContext])

  return (
    <Base
      panelCount={2}
      onClear={clearPythonEditor}
      interpretCommands={interpretPythonEditor}
    />
  )
}

const BlocklyAndPython: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const pythonEditorContext = usePythonEditorContext()
  const clearBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.clear()
  }, [blocklyWorkspaceContext])
  const clearPythonEditor = useCallback(() => {
    pythonEditorContext?.ref.current?.clear()
  }, [pythonEditorContext])
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])
  const interpretBlocklyWorkspace = useCallback(async () => {
    const interpret = blocklyWorkspaceContext?.ref.current?.interpret
    return (await interpret?.("python")) || false
  }, [blocklyWorkspaceContext])

  return (
    <Base
      panelCount={3}
      onClear={() => {
        clearBlocklyWorkspace()
        clearPythonEditor()
      }}
      interpretCommands={interpretBlocklyWorkspace}
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
