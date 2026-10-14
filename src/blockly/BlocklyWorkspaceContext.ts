import type * as Blockly from "blockly/core"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type * as generators from "./generators"
import type { GameCommand } from "../app/slices/game"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
  interpret: (
    generator?: keyof typeof generators,
  ) => Promise<GameCommand[] | undefined>
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
