import type * as Blockly from "blockly/core"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  maxInstances: Record<string, number>
  /** The Python code equivalent to the current blocks, for the read-only
   * Python view in "blocklyAndPython" mode. */
  pythonCode: string
  setPythonCode: Dispatch<SetStateAction<string>>
}

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
