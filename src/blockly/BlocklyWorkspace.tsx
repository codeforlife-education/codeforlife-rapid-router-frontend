import "blockly/blocks"
import {
  type FC,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Box } from "@mui/material"

import { clearWorkspace, initializeBlockly, resizeWorkspace } from "./workspace"
import { getPythonCodeFromStartBlock, mapBlocksToPythonLines } from "./python"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useCurrentGameCommand,
  useGameHasFinishedEarly,
  useGameInPlay,
  usePlayIntervalContext,
} from "../app/hooks"
import type { BlocklyWorkspaceRef } from "./BlocklyWorkspaceContext"
import { LevelSimulator } from "../phaser"
import { type StartBlockType } from "./blocks"
import { getTilemap } from "../phaser/tilemaps/load"
import { runBlockly } from "./interpreter"
import { setGameCommands } from "../app/slices"

type HighlightedBlock = { id: string; originalColour?: string }

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
  const highlightedBlockRef = useRef<HighlightedBlock | null>(null)
  const runRef = useRef<BlocklyWorkspaceRef["run"]>(() => {})
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
  const { ref, toolboxContents, maxInstances, setCode, levelId } =
    blocklyWorkspaceContext

  const highlightBlock = useCallback(
    (
      { workspace }: NonNullable<typeof blockly>,
      blockId: string,
      { error }: { error: boolean },
    ) => {
      const block = workspace.getBlockById(blockId)
      if (!block) return
      highlightedBlockRef.current = {
        id: blockId,
        originalColour: error ? block.getColour() : undefined,
      }
      workspace.highlightBlock(blockId)
      if (error) block.setColour("#ff0000")
    },
    [],
  )

  const unhighlightBlock = useCallback(
    ({ workspace }: NonNullable<typeof blockly>) => {
      workspace.highlightBlock(null) // Unhighlight all blocks.
      if (!highlightedBlockRef.current) return
      const { id, originalColour } = highlightedBlockRef.current
      if (originalColour) workspace.getBlockById(id)?.setColour(originalColour)
      highlightedBlockRef.current = null
    },
    [],
  )

  // Interprets and runs the Blockly workspace.
  runRef.current = generator => {
    if (!blockly) return

    unhighlightBlock(blockly) // Unhighlight any previously highlighted blocks.

    // Generate the code from the start block if needed, tracking which line
    // each block ID maps to so playback commands can highlight the right line.
    let lineByBlockId: Map<string, number> | undefined
    if (generator) {
      let code: string
      switch (generator) {
        case "python": {
          const mapped = mapBlocksToPythonLines(
            getPythonCodeFromStartBlock(blockly.startBlock),
          )
          code = mapped.code
          lineByBlockId = mapped.lineByBlockId
          break
        }
      }
      setCode(code)
    }

    // Interpret the blocks using the headless simulator.
    dispatch(setGameCommands([])) // Clear previous game commands.
    void getTilemap(levelId).then(tilemap => {
      const simulator = new LevelSimulator(tilemap)
      const result = runBlockly(blockly.startBlock, simulator)
      if (result.ok) {
        dispatch(
          setGameCommands(
            simulator.commands.map((command, i) => {
              const blockId = simulator.commandBlocks[i] ?? undefined
              return {
                command,
                blockId,
                lineNo: blockId ? lineByBlockId?.get(blockId) : undefined,
              }
            }),
          ),
        )
        setPlayInterval()
      } else if (result.blockId) {
        highlightBlock(blockly, result.blockId, { error: true })
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

    return () => {
      blockly.workspace.dispose()
    }
  }, [divRef, startBlockType, toolboxContents, maxInstances, setCode])

  // Highlight the current block during game play.
  useEffect(() => {
    if (!blockly) return

    unhighlightBlock(blockly) // Unhighlight any previously highlighted blocks.

    if (!currentGameCommand?.blockId) return
    highlightBlock(blockly, currentGameCommand.blockId, {
      error: gameHasFinishedEarly,
    })
  }, [
    blockly,
    gameHasFinishedEarly,
    currentGameCommand,
    highlightBlock,
    unhighlightBlock,
  ])

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
