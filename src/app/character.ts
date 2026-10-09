import { type GameCommand } from "./slices"

/** The sensing commands available to a character. */
export const SENSING_COMMANDS = [
  "at_dead_end",
  "at_destination",
  "at_red_traffic_light",
  "is_road_forward",
  "is_road_left",
  "is_road_right",
  "is_animal_crossing",
] as const
export type SensingCommand = (typeof SENSING_COMMANDS)[number]

/** Every command available to a character. */
export type CharacterCommand = GameCommand | SensingCommand

/** The fixed display order of command categories. */
const COMMAND_CATEGORIES = ["Movement", "Position", "Animals"] as const
export type CommandCategory = (typeof COMMAND_CATEGORIES)[number]

const CATEGORY_BY_COMMAND: Record<CharacterCommand, CommandCategory> = {
  move_forwards: "Movement",
  turn_left: "Movement",
  turn_right: "Movement",
  turn_around: "Movement",
  wait: "Movement",
  deliver: "Movement",
  at_dead_end: "Position",
  at_destination: "Position",
  at_red_traffic_light: "Position",
  is_road_forward: "Position",
  is_road_left: "Position",
  is_road_right: "Position",
  is_animal_crossing: "Animals",
  sound_horn: "Animals",
}

/** Groups the given character commands by category in a fixed order. */
export function groupCommandsByCategory(
  commands: readonly CharacterCommand[],
): { category: CommandCategory; commands: CharacterCommand[] }[] {
  return COMMAND_CATEGORIES.map(category => ({
    category,
    commands: commands.filter(
      command => CATEGORY_BY_COMMAND[command] === category,
    ),
  })).filter(group => group.commands.length > 0)
}
