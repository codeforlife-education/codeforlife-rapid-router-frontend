import { type GameCommand } from "./slices"

/**
 * `my_van` methods that query the van's surroundings rather than instruct
 * it - never pushed onto the runtime `gameCommands` list (see
 * `app/slices/game.ts`'s `GameCommand`), only used for documentation/display
 * purposes (e.g. the Commands modal's full `my_van` API reference).
 */
export const SENSING_METHODS = [
  "at_dead_end",
  "at_destination",
  "at_red_traffic_light",
  "is_road_forward",
  "is_road_left",
  "is_road_right",
  "is_animal_crossing",
] as const
export type SensingMethod = (typeof SENSING_METHODS)[number]

/** Every method available on `my_van` - instructions and sensing queries alike. */
export type VanMethod = GameCommand | SensingMethod

export type CommandCategory = "Movement" | "Position" | "Animals"

const CATEGORY_BY_METHOD: Record<VanMethod, CommandCategory> = {
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

const CATEGORY_ORDER: readonly CommandCategory[] = [
  "Movement",
  "Position",
  "Animals",
]

/** Groups the given van methods by category, in a fixed display order, for
 * rendering in the Commands modal. */
export function groupCommandsByCategory(
  commands: readonly VanMethod[],
): { category: CommandCategory; commands: VanMethod[] }[] {
  return CATEGORY_ORDER.map(category => ({
    category,
    commands: commands.filter(
      method => CATEGORY_BY_METHOD[method] === category,
    ),
  })).filter(group => group.commands.length > 0)
}
