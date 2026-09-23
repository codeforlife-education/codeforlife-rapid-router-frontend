import { defineBlock } from "../utils"

// Blockly's default `controls_whileUntil` combines "while" and "until" into
// one block with a MODE dropdown. Our game's levels are built around having
// each as its own block, so these are split back out into two, reusing
// Blockly's own "controls_whileUntil" messages for full i18n support.

function defineLoopBlock<T extends string>(type: T, operatorMsg: string) {
  return defineBlock({
    type,
    style: "loop_blocks",
    tooltip: `%{BKY_CONTROLS_WHILEUNTIL_TOOLTIP_${operatorMsg}}`,
    message0: `%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_${operatorMsg}} %1`,
    args0: [{ type: "input_value", name: "BOOL", check: "Boolean" }],
    message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
    args1: [{ type: "input_statement", name: "DO" }],
    previousStatement: null,
    nextStatement: null,
  })
}

export const REPEAT_WHILE_BLOCK = defineLoopBlock("repeat_while", "WHILE")
export const REPEAT_UNTIL_BLOCK = defineLoopBlock("repeat_until", "UNTIL")

export const LOOP_BLOCK_TYPES = [
  REPEAT_WHILE_BLOCK.type,
  REPEAT_UNTIL_BLOCK.type,
] as const
export type LoopBlockType = (typeof LOOP_BLOCK_TYPES)[number]
