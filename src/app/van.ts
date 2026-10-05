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
