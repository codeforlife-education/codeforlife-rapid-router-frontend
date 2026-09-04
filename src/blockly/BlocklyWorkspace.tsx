import "blockly/blocks"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import {
  clearWorkspace,
  getGameCommandsFromStartBlock,
  getNextBlocks,
  initializeBlockly,
  resizeWorkspace,
  saveWorkspaceState,
} from "./utils"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameCommandIndex,
  useGameHasFinishedEarly,
  useGameInPlay,
} from "../app/hooks"
import { type StartBlockType } from "./blocks"
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
  const dispatch = useAppDispatch()
  const gameInPlay = useGameInPlay()
  const gameHasFinishedEarly = useGameHasFinishedEarly()
  const gameCommandIndex = useGameCommandIndex()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents } = blocklyWorkspaceContext

  // Expose workspace methods to parent components.
  useImperativeHandle(
    ref,
    () =>
      blockly
        ? {
            resize: resizeWorkspace(blockly.workspace),
            clear: () => clearWorkspace(blockly.workspace, blockly.startBlock),
          }
        : { resize: () => {}, clear: () => {} },
    [blockly],
  )

  // Workspace initialization and disposal.
  useEffect(() => {
    if (!divRef.current) return

    const blockly = initializeBlockly(
      divRef.current,
      startBlockType,
      toolboxContents,
    )
    setBlockly(blockly)

    // Set up event listeners.
    const onChange = debounce(() => {
      saveWorkspaceState(blockly.workspace)

      const gameCommands = getGameCommandsFromStartBlock(blockly.startBlock)
      dispatch(setGameCommands(gameCommands))
    }, 250)

    blockly.workspace.addChangeListener(onChange)

    return () => {
      saveWorkspaceState(blockly.workspace)
      blockly.workspace.removeChangeListener(onChange)
      blockly.workspace.dispose()
    }
  }, [divRef, startBlockType, toolboxContents, dispatch])

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

    // Get and track the block to highlight.
    const block = getNextBlocks(blockly.startBlock)[gameCommandIndex]
    highlightedBlockRef.current = {
      id: block.id,
      originalColour: gameHasFinishedEarly ? block.getColour() : undefined,
    }

    // Highlight the block and possibly change its color.
    blockly.workspace.highlightBlock(block.id)
    if (gameHasFinishedEarly) block.setColour("#ff0000")
  }, [blockly, gameCommandIndex, gameInPlay, gameHasFinishedEarly])

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
