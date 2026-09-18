import * as yup from "yup"
import { type FC, type ReactNode, useRef, useState } from "react"
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
  PYTHON_STARTER_CODE,
  PythonWorkspaceContext,
  type PythonWorkspaceRef,
} from "../../pyodide"
import {
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import { getMaxInstances, getToolboxContents } from "../../blockly/utils"
import Controls from "./Controls"
import Panels from "./Panels"
import PlayIntervalContext from "../../app/PlayIntervalContext"
import { paths } from "../../routes"
import { usePlayInterval } from "../../app/hooks"

const Base: FC<Pick<LevelModel, "id" | "mode">> = level => (
  <PlayIntervalContext.Provider value={usePlayInterval()}>
    <Box sx={{ display: "flex" }}>
      <Controls level={level} />
      {/* TODO: fix style*/}
      <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
        <Panels level={level} />
      </Box>
    </Box>
  </PlayIntervalContext.Provider>
)

type BlocklyProps = Pick<LevelModel, "blockly_toolbox_block_types">

const BlocklyContext: FC<
  Pick<LevelModel, "id"> & BlocklyProps & { children: ReactNode }
> = ({ id, blockly_toolbox_block_types, children }) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)
  const [pythonCode, setPythonCode] = useState(PYTHON_STARTER_CODE)

  return (
    <BlocklyWorkspaceContext.Provider
      value={{
        ref: blocklyWorkspaceRef,
        toolboxContents: getToolboxContents(blockly_toolbox_block_types),
        maxInstances: getMaxInstances(blockly_toolbox_block_types),
        pythonCode,
        setPythonCode,
        levelId: id,
      }}
    >
      {children}
    </BlocklyWorkspaceContext.Provider>
  )
}

type PythonProps = {}

const PythonContext: FC<
  PythonProps &
    Pick<LevelModel, "id"> & {
      mode: "python" | "blocklyAndPython"
      children: ReactNode
    }
> = ({ id, mode, children }) => {
  const pythonWorkspaceRef = useRef<PythonWorkspaceRef>(null)

  return (
    <PythonWorkspaceContext.Provider
      value={{ ref: pythonWorkspaceRef, levelId: id, mode }}
    >
      {children}
    </PythonWorkspaceContext.Provider>
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
  | (Pick<LevelModel, "id"> &
      (
        | (BlocklyProps & { mode: "blockly" })
        | (PythonProps & { mode: "python" })
        | (BlocklyProps & PythonProps & { mode: "blocklyAndPython" })
      ))
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
          <PythonContext {...level}>
            <Base {...level} />
          </PythonContext>
        ) : (
          // blocklyAndPython
          <BlocklyContext {...level}>
            <PythonContext {...level}>
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
