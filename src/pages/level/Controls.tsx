import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
  Help as HelpIcon,
  Language as LanguageIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Speed as SpeedIcon,
  Stop as StopIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material"
import { type FC, useCallback, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type { PayloadAction } from "@reduxjs/toolkit"
import { useNavigate } from "react-router"

import * as miniDrawers from "../../components/miniDrawers"
import {
  type GameCommand,
  PLAY_SPEEDS,
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setLanguage,
  setMuted,
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
import HintModal from "./HintModal"
import { type Level } from "../../api/level"
import type { TilemapGroup } from "../../phaser/tilemaps"
import { ZoomControls } from "../../phaser"
import { paths } from "../../routes"
import { usePlayInterval } from "../../phaser/usePlayInterval"

type BaseControlsProps = {
  level: Pick<Level, "id" | "hint"> & { tilemapGroup?: TilemapGroup }
}

/**
 * The sidebar's background colour for each range of Rapid Router levels (by
 * their last level), like the legacy game's episodes.
 */
const RAPID_ROUTER_SIDEBAR_COLOURS: { lastLevelId: number; colour: string }[] =
  [
    { lastLevelId: 32, colour: "#86ae18" },
    { lastLevelId: 50, colour: "#00a3e0" },
    { lastLevelId: 67, colour: "#008cc1" },
    { lastLevelId: 79, colour: "#c90548" },
  ]

/** The sidebar's background colour for every Python Den level. */
const PYTHON_DEN_SIDEBAR_COLOUR = "#152584"

/** The sidebar's background colour for the level, if it has one. */
function getSidebarColour({
  id,
  tilemapGroup,
}: BaseControlsProps["level"]): string | undefined {
  switch (tilemapGroup) {
    case "rapidRouter":
      return RAPID_ROUTER_SIDEBAR_COLOURS.find(
        ({ lastLevelId }) => id <= lastLevelId,
      )?.colour
    case "pythonDen":
      return PYTHON_DEN_SIDEBAR_COLOUR
    default: // Custom levels.
      return undefined
  }
}

const Base: FC<
  BaseControlsProps &
    Pick<miniDrawers.MiniDrawerProps, "onOpened" | "onClosed"> & {
      panelCount: number
      onClear: () => void
      onLoadSolution: () => Promise<void>
      interpretCommands: () => Promise<GameCommand[] | undefined>
      onLanguageChange?: (language: Language) => void
    }
> = ({
  level,
  panelCount,
  onClear,
  onLoadSolution,
  interpretCommands,
  onOpened,
  onClosed,
  onLanguageChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hintModalOpen, setHintModalOpen] = useState(false)
  const [solving, setSolving] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const settings = useSettings()
  const gameIsDefined = useGameIsDefined()
  const gameOnLastStep = useGameOnLastStep()
  const [setPlayInterval, clearPlayInterval] = usePlayInterval()
  const { activeSceneKeys, phase, setPhase } = usePhaserGameContext()
  // Only provided in levels with a Blockly workspace.
  const onStartBlockClickRef =
    useBlocklyWorkspaceContext()?.onStartBlockClickRef

  // Plays (or pauses) the game, as the Play button does.
  const togglePlay = () => {
    if (clearPlayInterval()) {
      setPhase("paused")
      return
    }
    if (gameIsDefined) {
      if (gameOnLastStep || phase === "crashed") dispatch(restartGame())
      // Anything but resuming a paused run starts it from the top.
      setPlayInterval({ isRunStart: phase !== "paused" })
    } else
      void interpretCommands().then(
        commands => commands?.length && setPlayInterval({ isRunStart: true }),
      )
  }

  // Keep the start block (if there is one) pointed at the latest handler, as
  // clicking it acts like clicking the Play button.
  useEffect(() => {
    if (!onStartBlockClickRef) return
    onStartBlockClickRef.current = togglePlay
    return () => {
      onStartBlockClickRef.current = null
    }
  })

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
        backgroundColor={getSidebarColour(level)}
      >
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text={phase === "playing" ? "Pause" : "Play"}
          icon={phase === "playing" ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={togglePlay}
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
          text="Clear"
          icon={<DeleteIcon />}
          onClick={() => {
            clearPlayInterval()
            onClear()
          }}
        />
        <Divider />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Solve"
          icon={<CheckIcon />}
          disabled={solving}
          onClick={() => {
            clearPlayInterval()
            setSolving(true)
            void onLoadSolution().finally(() => setSolving(false))
          }}
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
          text="Hint"
          icon={<HelpIcon />}
          onClick={() => setHintModalOpen(true)}
        />
        <Divider />
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
          text={settings.muted ? "Unmute" : "Mute"}
          icon={settings.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          onClick={() => dispatch(setMuted(!settings.muted))}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Exit"
          icon={<ExitToAppIcon />}
          onClick={() => void navigate(paths._)}
        />
      </miniDrawers.MiniDrawer>
      <HintModal
        open={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        level={level}
      />
    </>
  )
}

const Blockly: FC<BaseControlsProps> = props => {
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
  const loadBlocklyWorkspace = useCallback(async () => {
    await blocklyWorkspaceContext?.ref.current?.loadWorkspace()
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
      onLoadSolution={loadBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
      onLanguageChange={changeBlocklyLanguage}
      {...props}
    />
  )
}

const Python: FC<BaseControlsProps> = props => {
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
  const loadPythonScript = useCallback(async () => {
    if (pythonEditorContext?.mode === "write")
      await pythonEditorContext.ref.current?.loadScript()
  }, [pythonEditorContext])

  return (
    <Base
      panelCount={3}
      onClear={clearPythonEditorAndConsoleLogs}
      interpretCommands={interpretPythonEditor}
      onLoadSolution={loadPythonScript}
      {...props}
    />
  )
}

const BlocklyAndPython: FC<BaseControlsProps> = props => {
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
  const loadBlocklyWorkspace = useCallback(async () => {
    await blocklyWorkspaceContext?.ref.current?.loadWorkspace()
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
      onLoadSolution={loadBlocklyWorkspace}
      onOpened={resizeBlocklyWorkspace}
      onClosed={resizeBlocklyWorkspace}
      onLanguageChange={changeBlocklyLanguage}
      {...props}
    />
  )
}

export type ControlsProps = BaseControlsProps & {
  level: Pick<Level, "mode">
}

const Controls: FC<ControlsProps> = props =>
  ({
    blockly: <Blockly {...props} />,
    python: <Python {...props} />,
    blocklyAndPython: <BlocklyAndPython {...props} />,
  })[props.level.mode]

export default Controls
