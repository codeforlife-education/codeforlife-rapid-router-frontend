import * as booleans from "./booleans"
import * as commands from "./commands"
import * as defaults from "./defaults"
import * as loops from "./loops"
import * as starts from "./starts"
import { type BlockDefinition } from "../utils"

export { booleans, commands, defaults, loops, starts }
export { type BooleanBlockType, BOOLEAN_BLOCK_TYPES } from "./booleans"
export { type CommandBlockType, COMMAND_BLOCK_TYPES } from "./commands"
export { type LoopBlockType, LOOP_BLOCK_TYPES } from "./loops"
export { type StartBlockType, START_BLOCK_TYPES } from "./starts"

export const DELETABLE_CUSTOM_BLOCKS = [
  // commands
  commands.MOVE_FORWARDS_BLOCK,
  commands.TURN_LEFT_BLOCK,
  commands.TURN_RIGHT_BLOCK,
  commands.TURN_AROUND_BLOCK,
  commands.WAIT_BLOCK,
  commands.DELIVER_BLOCK,
  commands.SOUND_HORN_BLOCK,
  // booleans
  booleans.ROAD_EXISTS_BLOCK,
  booleans.TRAFFIC_LIGHT_BLOCK,
  booleans.DEAD_END_BLOCK,
  booleans.AT_DESTINATION_BLOCK,
  booleans.COW_CROSSING_BLOCK,
  booleans.PIGEON_CROSSING_BLOCK,
  // loops
  loops.REPEAT_WHILE_BLOCK,
  loops.REPEAT_UNTIL_BLOCK,
] as const satisfies BlockDefinition<string>[]

export type DeletableBlockType =
  | booleans.BooleanBlockType
  | commands.CommandBlockType
  | loops.LoopBlockType
  | defaults.DefaultBlockType

// Default blocks that are also selectable/deletable in the level creator.
// Kept separate from `DELETABLE_CUSTOM_BLOCKS` so they're never passed to
// `Blockly.common.defineBlocks()` (see `defaults.PROCEDURES_DEFINE_BLOCK`).
export const DELETABLE_DEFAULT_BLOCKS = [
  defaults.PROCEDURES_DEFINE_BLOCK,
] as const satisfies BlockDefinition<string>[]

export const ALL_DELETABLE_BLOCKS = [
  ...DELETABLE_CUSTOM_BLOCKS,
  ...DELETABLE_DEFAULT_BLOCKS,
] as const satisfies BlockDefinition<string>[]

export const CUSTOM_BLOCKS = [
  ...DELETABLE_CUSTOM_BLOCKS,
  // starts
  starts.VAN_BLOCK,
] as const satisfies BlockDefinition<string>[]

export type BlockType = DeletableBlockType | starts.StartBlockType
export type BlockToolboxEntry =
  | BlockType
  | readonly [type: BlockType, maxInstances: number]
