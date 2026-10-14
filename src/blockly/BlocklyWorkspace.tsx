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

import * as generators from "./generators"
import type {
  BlocklyWorkspaceRef,
  GeneratedCode,
} from "./BlocklyWorkspaceContext"
import {
  clearWorkspace,
  getProgramSnapshot,
  initializeBlockly,
  resizeWorkspace,
} from "./workspace"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameCommandIndex,
  usePhaserGameContext,
} from "../app/hooks"
import type { GameCommand } from "../app/slices/game"
import { LevelSimulator } from "../phaser"
import { type StartBlockType } from "./blocks"
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
    (blockly: Blockly, generator?: string): Promise<GameCommand[] | undefined>
  }>(async () => new Promise(resolve => resolve(undefined)))
  const dispatch = useAppDispatch()
  const { phase, setPhase } = usePhaserGameContext()
  const gameCommandIndex = useGameCommandIndex()
  const [gameCommandBlockIds, setGameCommandBlockIds] = useState<string[][]>([])

  if (!blocklyWorkspaceContext)
    throw ReferenceError("Blockly workspace context not provided.")
  const { ref, toolboxContents, maxInstances, setGeneratedCode, levelId } =
    blocklyWorkspaceContext

  // Sets the current game state.
  const setGame = useCallback(
    (
      commands: GameCommand[],
      blockIds: string[][],
      generatedCode: GeneratedCode,
    ) => {
      dispatch(setGameCommands(commands))
      setGameCommandBlockIds(blockIds)
      setGeneratedCode(generatedCode)
    },
    [dispatch, setGeneratedCode],
  )

  // Highlights a block (and its related blocks), optionally marking them as
  // errors.
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

  // Unhighlights all previously highlighted blocks.
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

    let code = ""
    setGame([], [], { code, lineNos: [] }) // Clear previous game commands.

    // Generate the code from the start block if needed, tracking which line
    // each block ID maps to so playback commands can highlight the right line.
    let lineByBlockId: Map<string, number> | undefined
    if (generator) {
      switch (generator) {
        case "python": {
          const python = generators.python.getCodeFromStartBlock(startBlock)
          code = python.code
          lineByBlockId = python.lineByBlockId
          break
        }
      }
    }

    // Interpret the blocks using the headless simulator.
    const tilemap = await getTilemap(levelId)
    const simulator = new LevelSimulator(tilemap)
    const result = runBlockly(startBlock, simulator, lineByBlockId)
    if (result.ok) {
      const commands = simulator.commands.map(c => c.command)
      setGame(
        commands,
        simulator.commands.map(c => c.blockIds ?? []),
        { code, lineNos: simulator.commands.map(c => c.lineNo) },
      )
      return commands
    }
    setPhase("crashed")
    highlightBlock(workspace, result.blockIds, { error: true })
    setGeneratedCode(prev => ({
      ...prev,
      // The statement block itself is always first - see `collectConnectedBlockIds`.
      errorLineNo: lineByBlockId?.get(result.blockIds[0]),
    }))
    return undefined
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
            interpret: () => new Promise(resolve => resolve(undefined)),
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
      setGame([], [], { code: "", lineNos: [] })
    }, 250)

    blockly.workspace.addChangeListener(onChange)

    return () => {
      blockly.workspace.removeChangeListener(onChange)
      blockly.workspace.dispose()
    }
  }, [startBlockType, toolboxContents, maxInstances, setGame])

  // Highlight the current block during game play.
  useEffect(() => {
    if (!blockly) return
    const { workspace } = blockly

    unhighlightBlock(workspace) // Unhighlight previously highlighted blocks.

    if (phase === "idle") return
    const blockIds = gameCommandBlockIds[gameCommandIndex]
    if (!blockIds?.length) return
    highlightBlock(workspace, blockIds, { error: phase === "crashed" })
  }, [
    blockly,
    phase,
    gameCommandIndex,
    gameCommandBlockIds,
    highlightBlock,
    unhighlightBlock,
  ])

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
