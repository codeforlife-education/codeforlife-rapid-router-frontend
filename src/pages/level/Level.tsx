import * as yup from "yup"
import { type FC, type ReactNode, useMemo, useRef, useState } from "react"
import { Box } from "@mui/material"
import { handleResultState } from "codeforlife/utils/api"
import { useParamsRequired } from "codeforlife/hooks"

import {
  BlocklyWorkspaceContext,
  type BlocklyWorkspaceRef,
  type GeneratedCode,
} from "../../blockly"
import { ConsoleLogContext, type Log } from "../../codeMirror"
import type {
  ExportedOrthogonalTilemap,
  TilemapGroup,
} from "../../phaser/tilemaps"
import {
  type GamePhase,
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import {
  type Level as LevelModel,
  useRetrieveLevelQuery,
} from "../../api/level"
import {
  PythonEditorContext,
  type ReadOnlyPythonEditorProps,
  type WriteablePythonEditorProps,
} from "../../codeMirror/editors/python"
import { getMaxInstances, getToolboxContents } from "../../blockly/workspace"
import { CHARACTER_COMMANDS } from "../../app/character"
import Controls from "./Controls"
import Panels from "./Panels"
import type { WriteableEditorRef } from "../../codeMirror/editors"
import { paths } from "../../routes"

/** Identifies which tilemap to load - a predefined group+id pair (dynamically
 * imported), or an already-fetched custom level's exported tilemap. */
type TilemapProps =
  | { tilemapGroup: TilemapGroup; tilemap: undefined }
  | { tilemapGroup: undefined; tilemap: ExportedOrthogonalTilemap }

const Base: FC<Pick<LevelModel, "id" | "mode"> & TilemapProps> = level => (
  <Box sx={{ display: "flex" }}>
    <Controls level={level} />
    {/* TODO: fix style*/}
    <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
      <Panels level={level} />
    </Box>
  </Box>
)

type BlocklyProps = Pick<LevelModel, "id" | "blockly_toolbox_block_types"> &
  TilemapProps

const BlocklyContext: FC<BlocklyProps & { children: ReactNode }> = ({
  id,
  blockly_toolbox_block_types,
  children,
  ...props
}) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    code: "",
    lineNos: [],
  })

  // Stable references across re-renders (e.g. from `setGeneratedCode` itself) -
  // otherwise `BlocklyWorkspace`'s init effect would see "new" values on
  // every edit and recreate the workspace, wiping out the player's blocks.
  const toolboxContents = useMemo(
    () => getToolboxContents(blockly_toolbox_block_types),
    [blockly_toolbox_block_types],
  )
  const maxInstances = useMemo(
    () => getMaxInstances(blockly_toolbox_block_types),
    [blockly_toolbox_block_types],
  )

  return (
    <BlocklyWorkspaceContext.Provider
      value={{
        ref: blocklyWorkspaceRef,
        toolboxContents,
        maxInstances,
        generatedCode,
        setGeneratedCode,
        levelId: id,
        ...props,
      }}
    >
      {children}
    </BlocklyWorkspaceContext.Provider>
  )
}

type BasePythonProps = Pick<LevelModel, "id">
type ReadPythonProps = BasePythonProps & ReadOnlyPythonEditorProps
type WritePythonProps = BasePythonProps &
  Pick<WriteablePythonEditorProps, "commands"> &
  TilemapProps

const PythonContext: FC<
  { children: ReactNode } & (
    | ({ mode: "read" } & ReadPythonProps)
    | ({ mode: "write" } & WritePythonProps)
  )
> = ({ id, children, ...props }) => {
  const pythonEditorRef = useRef<WriteableEditorRef>(null)
  const [logs, setLogs] = useState<Log[]>([])

  return (
    <ConsoleLogContext.Provider value={{ logs, setLogs }}>
      <PythonEditorContext.Provider
        value={
          props.mode === "read"
            ? props
            : { ...props, ref: pythonEditorRef, levelId: id }
        }
      >
        {children}
      </PythonEditorContext.Provider>
    </ConsoleLogContext.Provider>
  )
}

const InnerCustom: FC<Pick<LevelModel, "id">> = ({ id }) =>
  handleResultState(useRetrieveLevelQuery(id), level => (
    <Resolved
      {...level}
      // Custom levels do not have a predefined tilemap group.
      tilemapGroup={undefined}
      // Provide the full set of character commands for custom levels.
      commands={CHARACTER_COMMANDS}
    />
  ))

type CustomProps = {}

const Custom: FC<CustomProps> = () =>
  useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: ({ id }) => <InnerCustom id={id} />,
    onValidationError: navigate => {
      // Redirect to home with error message
      navigate(paths._, {
        state: {
          notifications: [
            { props: { error: true, children: "Invalid level ID" } },
          ],
        },
      })
    },
  })

type ResolvedProps =
  | (BlocklyProps & { mode: "blockly" })
  | (WritePythonProps & { mode: "python" })
  | (BlocklyProps & ReadPythonProps & { mode: "blocklyAndPython" })

const Resolved: FC<ResolvedProps> = level => {
  const phaserGameRef = useRef<PhaserGameRef>(null)
  const [activeSceneKeys, setActiveSceneKeys] = useState<SceneKey[]>([])
  const [phase, setPhase] = useState<GamePhase>("idle")

  return (
    <PhaserGameContext.Provider
      value={{
        ref: phaserGameRef,
        activeSceneKeys,
        setActiveSceneKeys,
        phase,
        setPhase,
      }}
    >
      {level.mode === "blockly" ? (
        <BlocklyContext {...level}>
          <Base {...level} />
        </BlocklyContext>
      ) : level.mode === "python" ? (
        <PythonContext {...level} mode="write">
          <Base {...level} />
        </PythonContext>
      ) : (
        // blocklyAndPython
        <BlocklyContext {...level}>
          <PythonContext {...level} mode="read">
            <Base {...level} />
          </PythonContext>
        </BlocklyContext>
      )}
    </PhaserGameContext.Provider>
  )
}

export type PredefinedProps = { tilemapGroup: TilemapGroup } & ResolvedProps
export type LevelProps = PredefinedProps | CustomProps

const Level: FC<LevelProps> = level =>
  "id" in level ? <Resolved {...level} /> : <Custom />

export default Level
