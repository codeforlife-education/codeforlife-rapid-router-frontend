import "blockly/blocks"
import { Box, debounce } from "@mui/material"
import {
  type FC,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import {
  clearWorkspace,
  getProgramSnapshot,
  initializeBlockly,
  resizeWorkspace,
} from "./workspace"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useCurrentGameCommand,
  usePhaserGameContext,
} from "../app/hooks"
import type { BlocklyWorkspaceRef } from "./BlocklyWorkspaceContext"
import { LevelSimulator } from "../phaser"
import { type StartBlockType } from "./blocks"
import { getPythonCodeFromStartBlock } from "./python"
import { getTilemap } from "../phaser/tilemaps/load"
import { runBlockly } from "./interpreter"
import { setGameCommands } from "../app/slices"

type Blockly = ReturnType<typeof initializeBlockly>
type HighlightedBlock = { id: string; originalColour?: string }

export interface BlocklyWorkspaceProps {
  startBlockType?: StartBlockType
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({
  startBlockType = "van",
}) => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const divRef = useRef<HTMLDivElement | null>(null)
  const [blockly, setBlockly] = useState<null | Blockly>(null)
  const highlightedBlocksRef = useRef<HighlightedBlock[]>([])
  const programSnapshotRef = useRef<string | null>(null)
  const interpretRef = useRef<{
    (blockly: Blockly, generator?: string): Promise<boolean>
  }>(async () => new Promise<boolean>(resolve => resolve(false)))
  const dispatch = useAppDispatch()
  const { phase } = usePhaserGameContext()
  const currentGameCommand = useCurrentGameCommand()

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents, maxInstances, setCode, levelId } =
    blocklyWorkspaceContext

  const highlightBlock = useCallback(
    (
      workspace: Blockly["workspace"],
      blockIds: string[],
      { error }: { error: boolean },
    ) => {
      highlightedBlocksRef.current = []
      for (const blockId of blockIds) {
        const block = workspace.getBlockById(blockId)
        if (!block) continue
        highlightedBlocksRef.current.push({
          id: blockId,
          originalColour: error ? block.getColour() : undefined,
        })
        workspace.highlightBlock(blockId, true)
        if (error) block.setColour("#ff0000")
      }
    },
    [],
  )

  const unhighlightBlock = useCallback((workspace: Blockly["workspace"]) => {
    workspace.highlightBlock(null) // Unhighlight all blocks.
    for (const { id, originalColour } of highlightedBlocksRef.current) {
      if (originalColour) workspace.getBlockById(id)?.setColour(originalColour)
    }
    highlightedBlocksRef.current = []
  }, [])

  // Interprets the Blockly workspace.
  interpretRef.current = async ({ workspace, startBlock }, generator) => {
    unhighlightBlock(workspace) // Unhighlight any previously highlighted blocks.

    // Generate the code from the start block if needed, tracking which line
    // each block ID maps to so playback commands can highlight the right line.
    let lineByBlockId: Map<string, number> | undefined
    if (generator) {
      let code = ""
      switch (generator) {
        case "python": {
          const python = getPythonCodeFromStartBlock(startBlock)
          code = python.code
          lineByBlockId = python.lineByBlockId
          break
        }
      }
      setCode(code)
    }

    // Interpret the blocks using the headless simulator.
    dispatch(setGameCommands([])) // Clear previous game commands.
    const tilemap = await getTilemap(levelId)
    const simulator = new LevelSimulator(tilemap)
    const result = runBlockly(startBlock, simulator, lineByBlockId)
    if (result.ok) dispatch(setGameCommands(simulator.commands))
    else highlightBlock(workspace, result.blockIds, { error: true })
    return result.ok
  }

  // Expose workspace methods to parent components.
  useImperativeHandle(
    ref,
    (): BlocklyWorkspaceRef =>
      blockly
        ? {
            resize: resizeWorkspace(blockly.workspace),
            clear: () => clearWorkspace(blockly.workspace, blockly.startBlock),
            interpret: generator => interpretRef.current(blockly, generator),
          }
        : {
            resize: () => {},
            clear: () => {},
            interpret: () => new Promise(resolve => resolve(false)),
          },
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
    programSnapshotRef.current = getProgramSnapshot(
      blockly.workspace,
      blockly.startBlock,
    )

    // Set up event listeners.
    const onChange = debounce(() => {
      const snapshot = getProgramSnapshot(blockly.workspace, blockly.startBlock)
      const changed = snapshot !== programSnapshotRef.current
      programSnapshotRef.current = snapshot
      if (!changed) return
      dispatch(setGameCommands([]))
      setCode("")
    }, 250)

    blockly.workspace.addChangeListener(onChange)

    return () => {
      blockly.workspace.removeChangeListener(onChange)
      blockly.workspace.dispose()
    }
  }, [divRef, startBlockType, toolboxContents, maxInstances, setCode, dispatch])

  // Highlight the current block during game play.
  useEffect(() => {
    if (!blockly) return
    const { workspace } = blockly

    unhighlightBlock(workspace) // Unhighlight previously highlighted blocks.

    if (!currentGameCommand?.blockIds?.length) return
    highlightBlock(workspace, currentGameCommand.blockIds, {
      error: phase === "crashed",
    })
  }, [blockly, phase, currentGameCommand, highlightBlock, unhighlightBlock])

  return (
    <Box
      component="div"
      id="blockly-workspace"
      ref={divRef}
      sx={{
        height: "100%",
        pointerEvents:
          phase === "playing" || phase === "paused" ? "none" : "auto",
      }}
    />
  )
}

export default BlocklyWorkspace
