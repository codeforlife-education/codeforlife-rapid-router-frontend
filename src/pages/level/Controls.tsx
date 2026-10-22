import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
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
  setLanguage,
  setPlaySpeed,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  LANGUAGES,
  LANGUAGE_NAMES,
  type Language,
} from "../../blockly/messages"
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
import { usePlayInterval } from "../../phaser/usePlayInterval"

export type ControlsProps = { level: Pick<Level, "mode"> }

const Base: FC<
  Pick<miniDrawers.MiniDrawerProps, "onOpened" | "onClosed"> & {
    panelCount: number
    onClear: () => void
    interpretCommands: () => Promise<GameCommand[] | undefined>
    onLanguageChange?: (language: Language) => void
  }
> = ({
  panelCount,
  onClear,
  interpretCommands,
  onOpened,
  onClosed,
  onLanguageChange,
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
        {onLanguageChange && (
          <miniDrawers.MenuItem
            isDrawerOpen={isDrawerOpen}
            icon={<LanguageIcon />}
            text="Language"
            menuItems={LANGUAGES.map(language => ({
              value: language,
              key: language,
              title: LANGUAGE_NAMES[language],
              onClick: () => {
                dispatch(setLanguage(language))
                onLanguageChange(language)
              },
            }))}
            selectedValue={settings.language}
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
  const changeBlocklyLanguage = useCallback(
    (language: Language) => {
      blocklyWorkspaceContext?.ref.current?.setLanguage(language)
    },
    [blocklyWorkspaceContext],
  )

  return (
    <Base
      panelCount={2}
      interpretCommands={interpretBlocklyWorkspace}
      onClear={clearBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
      onLanguageChange={changeBlocklyLanguage}
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

  return (
    <Base
      panelCount={3}
      onClear={clearPythonEditorAndConsoleLogs}
      interpretCommands={interpretPythonEditor}
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
  const changeBlocklyLanguage = useCallback(
    (language: Language) => {
      blocklyWorkspaceContext?.ref.current?.setLanguage(language)
    },
    [blocklyWorkspaceContext],
  )

  return (
    <Base
      panelCount={3}
      onClear={clearBlocklyWorkspaceAndPythonEditor}
      interpretCommands={interpretBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
      onLanguageChange={changeBlocklyLanguage}
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
