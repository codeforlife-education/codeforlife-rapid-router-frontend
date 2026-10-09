import * as yup from "yup"
import { type FC, type ReactNode, useMemo, useRef, useState } from "react"
import { Box } from "@mui/material"
import { handleResultState } from "codeforlife/utils/api"
import { useParamsRequired } from "codeforlife/hooks"

import {
  BlocklyWorkspaceContext,
  type BlocklyWorkspaceRef,
} from "../../blockly"
import {
  type Level as LevelModel,
  useRetrieveLevelQuery,
} from "../../api/level"
import {
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import {
  PythonEditorContext,
  type PythonEditorRef,
} from "../../codeMirror/python"
import { getMaxInstances, getToolboxContents } from "../../blockly/workspace"
import type { CharacterCommand } from "../../app/character"
import Controls from "./Controls"
import Panels from "./Panels"
import { paths } from "../../routes"

const Base: FC<Pick<LevelModel, "id" | "mode">> = level => (
  <Box sx={{ display: "flex" }}>
    <Controls level={level} />
    {/* TODO: fix style*/}
    <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
      <Panels level={level} />
    </Box>
  </Box>
)

type BlocklyProps = Pick<LevelModel, "id" | "blockly_toolbox_block_types">

const BlocklyContext: FC<BlocklyProps & { children: ReactNode }> = ({
  id,
  blockly_toolbox_block_types,
  children,
}) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)
  const [code, setCode] = useState("")

  // Stable references across re-renders (e.g. from `setCode` itself) -
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
        code,
        setCode,
        levelId: id,
      }}
    >
      {children}
    </BlocklyWorkspaceContext.Provider>
  )
}

type PythonProps = Pick<LevelModel, "id">

const PythonContext: FC<
  PythonProps & {
    editable: boolean
    commands?: CharacterCommand[]
    children: ReactNode
  }
> = ({ id, editable, commands, children }) => {
  const pythonEditorRef = useRef<PythonEditorRef>(null)

  return (
    <PythonEditorContext.Provider
      value={{ ref: pythonEditorRef, levelId: id, editable, commands }}
    >
      {children}
    </PythonEditorContext.Provider>
  )
}

const InnerCustom: FC<Pick<LevelModel, "id">> = ({ id }) =>
  handleResultState(useRetrieveLevelQuery(id), level => <Base {...level} />)

const Custom: FC = () =>
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

export type LevelProps =
  | (
      | (BlocklyProps & { mode: "blockly" })
      | (PythonProps & { mode: "python"; commands: CharacterCommand[] })
      | (BlocklyProps & PythonProps & { mode: "blocklyAndPython" })
    )
  | {}

const Level: FC<LevelProps> = level => {
  const phaserGameRef = useRef<PhaserGameRef>(null)
  const [activeSceneKeys, setActiveSceneKeys] = useState<SceneKey[]>([])

  return (
    <PhaserGameContext.Provider
      value={{ ref: phaserGameRef, activeSceneKeys, setActiveSceneKeys }}
    >
      {"id" in level ? (
        level.mode === "blockly" ? (
          <BlocklyContext {...level}>
            <Base {...level} />
          </BlocklyContext>
        ) : level.mode === "python" ? (
          <PythonContext {...level} editable={true}>
            <Base {...level} />
          </PythonContext>
        ) : (
          // blocklyAndPython
          <BlocklyContext {...level}>
            <PythonContext {...level} editable={false}>
              <Base {...level} />
            </PythonContext>
          </BlocklyContext>
        )
      ) : (
        <Custom />
      )}
    </PhaserGameContext.Provider>
  )
}

export default Level
