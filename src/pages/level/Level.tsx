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
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import { getMaxInstances, getToolboxContents } from "../../blockly/utils"
import Controls from "./Controls"
import DescriptionModal from "./DescriptionModal"
import Panels from "./Panels"
import { paths } from "../../routes"

// Fallback copy for levels fetched from the backend, which doesn't yet
// provide description/hint fields.
const PLACEHOLDER_DESCRIPTION =
  "This is a placeholder description explaining what to do in this level."
const PLACEHOLDER_HINT =
  "This is a placeholder hint to help you if you get stuck."

const Base: FC<
  Pick<LevelModel, "id" | "mode" | "name"> & {
    video?: string
    description?: string
    hint?: string
  }
> = ({ video, description, hint, ...level }) => {
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(true)

  return (
    <Box sx={{ display: "flex" }}>
      <Controls level={level} hint={hint ?? PLACEHOLDER_HINT} />
      {/* TODO: fix style*/}
      <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
        <Panels level={level} />
      </Box>
      <DescriptionModal
        open={descriptionModalOpen}
        onClose={() => setDescriptionModalOpen(false)}
        title={`Level ${level.id}`}
        subtitle={level.name}
        description={description ?? PLACEHOLDER_DESCRIPTION}
        video={video}
      />
    </Box>
  )
}

type BlocklyProps = Pick<LevelModel, "blockly_toolbox_block_types">

const BlocklyContext: FC<BlocklyProps & { children: ReactNode }> = ({
  blockly_toolbox_block_types,
  children,
}) => {
  const blocklyWorkspaceRef = useRef<BlocklyWorkspaceRef>(null)

  return (
    <BlocklyWorkspaceContext.Provider
      value={{
        ref: blocklyWorkspaceRef,
        toolboxContents: getToolboxContents(blockly_toolbox_block_types),
        maxInstances: getMaxInstances(blockly_toolbox_block_types),
      }}
    >
      {children}
    </BlocklyWorkspaceContext.Provider>
  )
}

type PythonProps = {}

const PythonContext: FC<PythonProps & { children: ReactNode }> = ({
  children,
}) => <>{children}</>

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
  | (Pick<LevelModel, "id" | "name"> & {
      video?: string
      description: string
      hint: string
    } & (
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
