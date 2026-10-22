import type * as Blockly from "blockly/core"
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type * as generators from "./generators"
import type {
  ExportedOrthogonalTilemap,
  TilemapGroup,
} from "../phaser/tilemaps"
import type { GameCommand } from "../app/slices/game"
import type { Language } from "./messages"
import type { Level } from "../api/level"

export type BlocklyWorkspaceRef = {
  resize: () => void
  clear: () => void
  setLanguage: (language: Language) => void
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
  /** The source line (1-indexed) of the block that errored, if interpretation
   * failed before producing any commands - a fallback for when `lineNos` has
   * nothing to point at. */
  errorLineNo?: number
}

export type BlocklyWorkspaceContextValue = {
  ref: RefObject<BlocklyWorkspaceRef | null>
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[]
  maxInstances: Record<string, number>
  generatedCode: GeneratedCode
  setGeneratedCode: Dispatch<SetStateAction<GeneratedCode>>
  levelId: Level["id"]
} & (
  | { tilemapGroup: TilemapGroup; tilemap: undefined }
  | { tilemapGroup: undefined; tilemap: ExportedOrthogonalTilemap }
)

const BlocklyWorkspaceContext =
  createContext<BlocklyWorkspaceContextValue | null>(null)

export default BlocklyWorkspaceContext
