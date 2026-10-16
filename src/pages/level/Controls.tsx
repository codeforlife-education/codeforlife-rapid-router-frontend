import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  Delete as DeleteIcon,
  Help as HelpIcon,
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
  useSettings,
} from "../../app/hooks"
import HintModal from "./HintModal"
import { type Level } from "../../api/level"
import { ZoomControls } from "../../phaser"

export type ControlsProps = { level: Pick<Level, "mode">; hint: string }

const Base: FC<
  Pick<miniDrawers.MiniDrawerProps, "onOpened" | "onClosed"> & {
    panelCount: number
    hint: string
    onClear: () => void
  }
> = ({ panelCount, hint, onClear, onOpened, onClosed }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hintModalOpen, setHintModalOpen] = useState(false)
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
          disabled={!gameIsDefined}
          onClick={() => {
            if (!clearPlayInterval()) setPlayInterval()
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
          disabled={!gameIsDefined}
          onClick={() => {
            clearPlayInterval()
            dispatch(nextGameCommand())
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
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Hint"
          icon={<HelpIcon />}
          onClick={() => setHintModalOpen(true)}
        />
      </miniDrawers.MiniDrawer>
      <HintModal
        open={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        hint={hint}
      />
    </>
  )
}

const Blockly: FC<{ hint: string }> = ({ hint }) => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const clearBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.clear()
  }, [blocklyWorkspaceContext])
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])

  return (
    <Base
      panelCount={2}
      hint={hint}
      onClear={clearBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
    />
  )
}

const Python: FC<{ hint: string }> = ({ hint }) => {
  // const clearPythonWorkspace = useClearPythonWorkspace()

  return (
    <Base
      panelCount={2}
      hint={hint}
      onClear={() => {
        console.log("Clear Python Workspace")
      }}
    />
  )
}

const BlocklyAndPython: FC<{ hint: string }> = ({ hint }) => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const clearBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.clear()
  }, [blocklyWorkspaceContext])
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])

  return (
    <Base
      panelCount={3}
      hint={hint}
      onClear={() => {
        clearBlocklyWorkspace()
        // clearPythonWorkspace()
      }}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
    />
  )
}

const Controls: FC<ControlsProps> = ({ level, hint }) =>
  ({
    blockly: <Blockly hint={hint} />,
    python: <Python hint={hint} />,
    blocklyAndPython: <BlocklyAndPython hint={hint} />,
  })[level.mode]

export default Controls
