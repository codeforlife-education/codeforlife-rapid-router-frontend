import type * as Blockly from "blockly/core"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type { CodingLanguage } from "../codeMirror"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
  interpret: (generator?: CodingLanguage) => Promise<boolean>
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  maxInstances: Record<string, number>
  code: string
  setCode: Dispatch<SetStateAction<string>>
  levelId: number
}

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
