// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/logic.ts

// Block for if/elseif/else condition.
export const IF_BLOCK_TYPE = "controls_if"

// Block for negation.
export const LOGIC_NEGATE_BLOCK_TYPE = "logic_negate"

// Block for comparison operator (=, <, >, etc.).
export const LOGIC_COMPARE_BLOCK_TYPE = "logic_compare"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/loops.ts

// Block for repeat n times (fixed number field, no separate value block).
export const REPEAT_BLOCK_TYPE = "controls_repeat"

// Block for "repeat while" and "repeat until" loops.
export const WHILE_UNTIL_BLOCK_TYPE = "controls_whileUntil"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/math.ts

// Block for numeric value.
export const MATH_NUMBER_BLOCK_TYPE = "math_number"

// Block for adding to a variable in place.
export const MATH_CHANGE_BLOCK_TYPE = "math_change"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/variables.ts

// Block for variable getter.
export const VARIABLES_GET_BLOCK_TYPE = "variables_get"

// Block for variable setter.
export const VARIABLES_SET_BLOCK_TYPE = "variables_set"

// https://github.com/RaspberryPiFoundation/blockly/blob/blockly-v12.3.1/blocks/procedures.ts

// Block for defining a procedure with no return value.
export const PROCEDURES_DEFINE_BLOCK_TYPE = "procedures_defnoreturn"

// Block for calling a procedure with no return value.
export const PROCEDURES_CALL_BLOCK_TYPE = "procedures_callnoreturn"

export const DEFAULT_BLOCK_TYPES = [
  IF_BLOCK_TYPE,
  LOGIC_NEGATE_BLOCK_TYPE,
  LOGIC_COMPARE_BLOCK_TYPE,
  REPEAT_BLOCK_TYPE,
  WHILE_UNTIL_BLOCK_TYPE,
  MATH_NUMBER_BLOCK_TYPE,
  MATH_CHANGE_BLOCK_TYPE,
  VARIABLES_GET_BLOCK_TYPE,
  VARIABLES_SET_BLOCK_TYPE,
  PROCEDURES_DEFINE_BLOCK_TYPE,
  PROCEDURES_CALL_BLOCK_TYPE,
] as const
export type DefaultBlockType = (typeof DEFAULT_BLOCK_TYPES)[number]
