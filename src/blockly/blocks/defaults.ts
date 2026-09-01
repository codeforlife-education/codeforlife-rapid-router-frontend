// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/logic.ts

// Block for if/elseif/else condition.
export const IF_BLOCK_TYPE = "controls_if"

// Block for negation.
export const LOGIC_NEGATE_BLOCK_TYPE = "logic_negate"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/loops.ts

// Block for repeat n times (fixed number field, no separate value block).
export const REPEAT_BLOCK_TYPE = "controls_repeat"

// Block for "repeat while" and "repeat until" loops.
export const WHILE_UNTIL_BLOCK_TYPE = "controls_whileUntil"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/procedures.ts

// Block for defining a procedure with no return value.
export const PROCEDURES_DEFINE_BLOCK_TYPE = "procedures_defnoreturn"

// Block for calling a procedure with no return value.
export const PROCEDURES_CALL_BLOCK_TYPE = "procedures_callnoreturn"

export const DEFAULT_BLOCK_TYPES = [
  IF_BLOCK_TYPE,
  LOGIC_NEGATE_BLOCK_TYPE,
  REPEAT_BLOCK_TYPE,
  WHILE_UNTIL_BLOCK_TYPE,
  PROCEDURES_DEFINE_BLOCK_TYPE,
  PROCEDURES_CALL_BLOCK_TYPE,
] as const
export type DefaultBlockType = (typeof DEFAULT_BLOCK_TYPES)[number]
