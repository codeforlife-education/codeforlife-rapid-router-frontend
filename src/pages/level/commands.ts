import type { CommandName } from "../../pyodide"

/**
 * Reference data for the "Commands" modal shown on "python" mode levels -
 * each level lists which of these are actually relevant to it (see
 * `commands` on the level entries in `routes/level.tsx`), sourced from the
 * legacy `commands_levelNNNN()` functions in `game/messages.py`.
 */
export type { CommandName }

export type CommandCategory = "Movement" | "Position" | "Animals"

export const COMMANDS: Record<
  CommandName,
  { category: CommandCategory; signature: string }
> = {
  move_forwards: { category: "Movement", signature: "my_van.move_forwards()" },
  turn_left: { category: "Movement", signature: "my_van.turn_left()" },
  turn_right: { category: "Movement", signature: "my_van.turn_right()" },
  turn_around: { category: "Movement", signature: "my_van.turn_around()" },
  wait: { category: "Movement", signature: "my_van.wait()" },
  deliver: { category: "Movement", signature: "my_van.deliver()" },
  at_dead_end: { category: "Position", signature: "my_van.at_dead_end()" },
  at_destination: {
    category: "Position",
    signature: "my_van.at_destination()",
  },
  at_red_traffic_light: {
    category: "Position",
    signature: "my_van.at_red_traffic_light()",
  },
  is_road_forward: {
    category: "Position",
    signature: "my_van.is_road_forward()",
  },
  is_road_left: { category: "Position", signature: "my_van.is_road_left()" },
  is_road_right: {
    category: "Position",
    signature: "my_van.is_road_right()",
  },
  is_animal_crossing: {
    category: "Animals",
    signature: "my_van.is_animal_crossing()",
  },
  sound_horn: { category: "Animals", signature: "my_van.sound_horn()" },
}

const CATEGORY_ORDER: readonly CommandCategory[] = [
  "Movement",
  "Position",
  "Animals",
]

/** Groups the given commands by category, in a fixed display order, for
 * rendering in the Commands modal. */
export function groupCommandsByCategory(
  commands: readonly CommandName[],
): { category: CommandCategory; commands: CommandName[] }[] {
  return CATEGORY_ORDER.map(category => ({
    category,
    commands: commands.filter(
      commandName => COMMANDS[commandName].category === category,
    ),
  })).filter(group => group.commands.length > 0)
}
