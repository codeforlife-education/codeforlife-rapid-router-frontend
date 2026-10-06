import { Order, pythonGenerator } from "blockly/python"

import { type DefineBlockKwArgs, defineBlock } from "../utils"

// Blockly's default `controls_whileUntil` combines "while" and "until" into
// one block with a MODE dropdown. Our game's levels are built around having
// each as its own block, so these are split back out into two, reusing
// Blockly's own "controls_whileUntil" messages for full i18n support.

/** Mirrors Blockly's own `controls_whileUntil` Python generator (which
 * branches on a MODE field), specialised for one fixed mode since our
 * "while"/"until" are separate block types rather than a dropdown. */
function pythonWhileLoop(until: boolean): DefineBlockKwArgs["toPython"] {
  return block => {
    let condition =
      pythonGenerator.valueToCode(
        block,
        "BOOL",
        until ? Order.LOGICAL_NOT : Order.NONE,
      ) || "False"
    if (until) condition = `not ${condition}`

    let branch = pythonGenerator.statementToCode(block, "DO")
    branch = pythonGenerator.addLoopTrap(branch, block) || pythonGenerator.PASS

    return `while ${condition}:\n${branch}`
  }
}

function defineLoopBlock<T extends string>(
  type: T,
  operatorMsg: string,
  until: boolean,
) {
  return defineBlock(
    {
      type,
      style: "loop_blocks",
      tooltip: `%{BKY_CONTROLS_WHILEUNTIL_TOOLTIP_${operatorMsg}}`,
      message0: `%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_${operatorMsg}} %1`,
      args0: [{ type: "input_value", name: "BOOL", check: "Boolean" }],
      message1: "%{BKY_CONTROLS_REPEAT_INPUT_DO} %1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
    },
    { toPython: pythonWhileLoop(until) },
  )
}

export const REPEAT_WHILE_BLOCK = defineLoopBlock(
  "repeat_while",
  "WHILE",
  false,
)
export const REPEAT_UNTIL_BLOCK = defineLoopBlock("repeat_until", "UNTIL", true)

export const LOOP_BLOCK_TYPES = [
  REPEAT_WHILE_BLOCK.type,
  REPEAT_UNTIL_BLOCK.type,
] as const
export type LoopBlockType = (typeof LOOP_BLOCK_TYPES)[number]
