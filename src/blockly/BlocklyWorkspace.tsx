import "blockly/blocks"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { clearWorkspace, initializeBlockly, resizeWorkspace } from "./workspace"
import { getPythonCodeFromStartBlock, stripHighlightCalls } from "./python"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useCurrentGameCommand,
  useGameHasFinishedEarly,
  useGameInPlay,
  usePlayIntervalContext,
} from "../app/hooks"
import { LevelSimulator } from "../phaser"
import { type StartBlockType } from "./blocks"
import { getTilemap } from "../phaser/tilemaps/load"
import { runBlockly } from "./interpreter"
import { setGameCommands } from "../app/slices"

export interface BlocklyWorkspaceProps {
  startBlockType?: StartBlockType
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({
  startBlockType = "van",
}) => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [blockly, setBlockly] = useState<null | ReturnType<
    typeof initializeBlockly
  >>(null)
  const highlightedBlockRef = useRef<{
    id: string
    originalColour?: string
  } | null>(null)
  // Tracked separately from playback highlighting - errors aren't tied to
  // `gameCommandIndex`, and must be cleared as soon as the blocks change.
  const erroredBlockRef = useRef<{ id: string; originalColour: string } | null>(
    null,
  )
  const dispatch = useAppDispatch()
  const gameInPlay = useGameInPlay()
  const gameHasFinishedEarly = useGameHasFinishedEarly()
  const currentGameCommand = useCurrentGameCommand()
  const playIntervalContext = usePlayIntervalContext()
  if (!playIntervalContext)
    throw new ReferenceError("Play interval context not provided.")
  const [, setPlayInterval] = playIntervalContext

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents, maxInstances, setPythonCode, levelId } =
    blocklyWorkspaceContext

  // Generates Python (for display only) and runs the blocks directly -
  // only invoked when the player presses Play (via the exposed `run` ref
  // method), never automatically on edit.
  const runRef = useRef(() => {})
  runRef.current = () => {
    if (!blockly) return

    // Clear any previous error highlight - it no longer applies once the
    // blocks have changed.
    if (erroredBlockRef.current) {
      const { id, originalColour } = erroredBlockRef.current
      blockly.workspace.getBlockById(id)?.setColour(originalColour)
      erroredBlockRef.current = null
    }

    const code = getPythonCodeFromStartBlock(blockly.startBlock)
    setPythonCode(stripHighlightCalls(code))

    // Runs the blocks directly against a headless simulator (see
    // `blockly/interpreter.ts`) - no Python generation/execution involved,
    // so pure Blockly levels never need to load Pyodide. Playback only
    // starts once the full command list is ready (see `editable`-equivalent
    // lock on the workspace below).
    dispatch(setGameCommands([]))
    void getTilemap(levelId).then(tilemap => {
      const simulator = new LevelSimulator(tilemap)
      const result = runBlockly(blockly.startBlock, simulator)
      if (result.ok) {
        dispatch(
          setGameCommands(
            simulator.commands.map((command, i) => ({
              command,
              lineNo: simulator.commandLines[i],
              blockId: simulator.commandBlocks[i] ?? undefined,
            })),
          ),
        )
        setPlayInterval()
      } else {
        const block =
          result.blockId && blockly.workspace.getBlockById(result.blockId)
        if (block) {
          erroredBlockRef.current = {
            id: block.id,
            originalColour: block.getColour(),
          }
          block.setColour("#ff0000")
        }
      }
    })
  }

  // Expose workspace methods to parent components.
  useImperativeHandle(
    ref,
    () =>
      blockly
        ? {
            resize: resizeWorkspace(blockly.workspace),
            clear: () => clearWorkspace(blockly.workspace, blockly.startBlock),
            run: () => runRef.current(),
          }
        : { resize: () => {}, clear: () => {}, run: () => {} },
    [blockly],
  )

  // Workspace initialization and disposal.
  useEffect(() => {
    if (!divRef.current) return

    const blockly = initializeBlockly(
      divRef.current,
      startBlockType,
      toolboxContents,
      maxInstances,
    )
    setBlockly(blockly)

    // Only save workspace state and refresh the (read-only) generated
    // Python text on edit - actually running it happens only via `run()`,
    // triggered by the player pressing Play.
    const onChange = debounce(() => {
      // TODO: Implement saving local changes to session storage so that a user's
      // workspace changes are saved when they return that level.
      setPythonCode(
        stripHighlightCalls(getPythonCodeFromStartBlock(blockly.startBlock)),
      )
    }, 250)

    blockly.workspace.addChangeListener(onChange)

    return () => {
      blockly.workspace.removeChangeListener(onChange)
      blockly.workspace.dispose()
    }
  }, [divRef, startBlockType, toolboxContents, maxInstances, setPythonCode])

  // Highlight the current block during game play.
  useEffect(() => {
    if (!blockly) return

    // Restore the previously highlighted block before touching a new one.
    if (highlightedBlockRef.current) {
      const { id, originalColour } = highlightedBlockRef.current
      blockly.workspace.highlightBlock(null) // Unhighlight all blocks.
      if (originalColour)
        blockly.workspace.getBlockById(id)?.setColour(originalColour)
      highlightedBlockRef.current = null
    }

    if (!currentGameCommand) return
    const block = currentGameCommand.blockId
      ? blockly.workspace.getBlockById(currentGameCommand.blockId)
      : null
    if (!block) return

    highlightedBlockRef.current = {
      id: block.id,
      originalColour: gameHasFinishedEarly ? block.getColour() : undefined,
    }
    blockly.workspace.highlightBlock(block.id)
    if (gameHasFinishedEarly) block.setColour("#ff0000")
  }, [blockly, gameHasFinishedEarly, currentGameCommand])

  return (
    <Box
      component="div"
      id="blockly-workspace"
      ref={divRef}
      sx={{ height: "100%", pointerEvents: gameInPlay ? "none" : "auto" }}
    />
  )
}

export default BlocklyWorkspace
