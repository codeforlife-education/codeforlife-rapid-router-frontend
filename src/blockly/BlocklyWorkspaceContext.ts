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

export type GeneratedCode = {
  code: string
  /** The source line (1-indexed) each interpreted command came from, indexed
   * the same as `gameCommands` - only meaningful once `code` has been
   * generated (see the "python" `interpret` generator). */
  lineNos: (number | undefined)[]
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  maxInstances: Record<string, number>
  generatedCode: GeneratedCode
  setGeneratedCode: Dispatch<SetStateAction<GeneratedCode>>
  levelId: number
}

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
