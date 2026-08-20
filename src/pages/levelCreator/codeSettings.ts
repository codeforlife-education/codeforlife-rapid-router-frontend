import { CUSTOM_BLOCKS, START_BLOCK_TYPES } from "../../blockly/blocks"
import { type BlockCount } from "./BlockListItem"

// The start block isn't an optional, player-selectable block like the others -
// it's always present, so it's excluded from this list.
export const BLOCKS = CUSTOM_BLOCKS.filter(
  block => !(START_BLOCK_TYPES as readonly string[]).includes(block.type),
)

export interface CodeSettings {
  language: string
  maxMoves: number
  blockCounts: Record<string, BlockCount>
  blockEnabled: Record<string, boolean>
}

export const DEFAULT_CODE_SETTINGS: CodeSettings = {
  language: "Blockly",
  maxMoves: 50,
  blockCounts: Object.fromEntries(
    BLOCKS.map(block => [block.type, "infinite"]),
  ),
  blockEnabled: Object.fromEntries(BLOCKS.map(block => [block.type, true])),
}
