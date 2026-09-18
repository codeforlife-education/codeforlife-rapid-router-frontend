import "blockly/blocks"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import { appendGameCommand, setGameCommands } from "../app/slices"
import {
  clearWorkspace,
  getPythonCodeFromStartBlock,
  initializeBlockly,
  resizeWorkspace,
  stripHighlightCalls,
} from "./utils"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameCommandBlocks,
  useGameCommandIndex,
  useGameHasFinishedEarly,
  useGameInPlay,
} from "../app/hooks"
import { type StartBlockType } from "./blocks"
import { usePyodideRunner } from "../pyodide"

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
  const gameCommandIndex = useGameCommandIndex()
  const commandBlocks = useGameCommandBlocks()
  const { run } = usePyodideRunner()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents, maxInstances, setPythonCode, levelId } =
    blocklyWorkspaceContext

  // Generates Python from the current blocks and runs it through Pyodide,
  // streaming fresh commands - only invoked when the player presses Play
  // (via the exposed `run` ref method), never automatically on edit.
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

    // Run the generated Python through the same Pyodide pipeline the
    // Python editor uses, so loops/conditionals/etc. are correctly
    // resolved by actually executing them, not by statically walking
    // the blocks. Commands stream in as they're derived (there's no
    // "does this solve the level" check), so reset first, then append.
    dispatch(setGameCommands({ commands: [], lines: [], blocks: [] }))
    void run(code, levelId, (command, line, block) => {
      dispatch(appendGameCommand({ command, line, block }))
    }).then(result => {
      if (!result.ok) {
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

    // Only highlight the block if the game is in play or has finished early.
    if (!gameInPlay && !gameHasFinishedEarly) return

    // Get and track the block to highlight. There may be no matching block
    // if this command didn't come from a Blockly-tagged statement (e.g. the
    // Python editor in blocklyAndPython mode) or the block was deleted since.
    const blockId = commandBlocks[gameCommandIndex]
    const block = blockId ? blockly.workspace.getBlockById(blockId) : null
    if (!block) return
    highlightedBlockRef.current = {
      id: block.id,
      originalColour: gameHasFinishedEarly ? block.getColour() : undefined,
    }

    // Highlight the block and possibly change its color.
    blockly.workspace.highlightBlock(block.id)
    if (gameHasFinishedEarly) block.setColour("#ff0000")
  }, [
    blockly,
    gameCommandIndex,
    gameInPlay,
    gameHasFinishedEarly,
    commandBlocks,
  ])

  return (
    <Box
      component="div"
      id="blockly-workspace"
      ref={divRef}
      sx={{ height: "100%" }}
    />
  )
}

export default BlocklyWorkspace
