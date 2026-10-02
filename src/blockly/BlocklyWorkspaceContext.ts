import type * as Blockly from "blockly/core"
import { type RefObject, createContext } from "react"

import { type Language } from "./messages/languages"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
  setLanguage: (language: Language) => void
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  maxInstances: Record<string, number>
}

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
