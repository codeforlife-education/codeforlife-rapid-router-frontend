import type * as Blockly from "blockly/core"
import { type Order, pythonGenerator } from "blockly/python"

export type BlockDefinition<T extends string> = {
  type: T
  tooltip?: string
  colour?: number
  /** A named block style (e.g. Blockly's built-in `"loop_blocks"`), as an
   * alternative to a raw `colour`. */
  style?: string
  message0: string
  args0: Array<
    | {
        type: "field_label"
        text: string
      }
    | {
        type: "field_image"
        src: string
        width: number
        height: number
        alt: string
        flipRtl: "FALSE" | "TRUE"
      }
    | {
        type: "input_dummy"
        name: string
      }
    | {
        type: "field_dropdown"
        name: string
        options: Array<[string, string]>
      }
    | {
        type: "input_value"
        name: string
        check?: string
      }
  >
  message1?: string
  args1?: Array<{ type: "input_statement"; name: string }>
  output?: string
  previousStatement?: string | null
  nextStatement?: string | null
}

export type DefineBlockKwArgs = {
  /** The Python code a custom block generates - a plain statement string for
   * statement blocks, or a `[code, order]` tuple for value blocks (`order`
   * being the generated expression's operator precedence, so the generator
   * knows when to wrap it in parentheses). Matches the shape Blockly expects
   * at `pythonGenerator.forBlock[type]`. */
  toPython: (block: Blockly.Block) => string | [string, Order]
}

export function defineBlock<T extends string>(
  blockDefinition: BlockDefinition<T>,
  { toPython }: DefineBlockKwArgs,
): BlockDefinition<T> {
  // Register the Python code generator for this block type with Blockly.
  pythonGenerator.forBlock[blockDefinition.type] = toPython

  return blockDefinition
}
