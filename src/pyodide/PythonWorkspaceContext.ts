import { type RefObject, createContext } from "react"

/** The `my_van` commands documented in the level's Commands modal - this is
 * the superset of action commands (e.g. `move_forwards`) and sensing
 * commands (e.g. `is_road_left`), sourced from the legacy
 * `commands_levelNNNN()` functions in `game/messages.py`. */
export const COMMAND_NAMES = [
  "move_forwards",
  "turn_left",
  "turn_right",
  "turn_around",
  "wait",
  "deliver",
  "at_dead_end",
  "at_destination",
  "at_red_traffic_light",
  "is_road_forward",
  "is_road_left",
  "is_road_right",
  "is_animal_crossing",
  "sound_horn",
] as const
export type CommandName = (typeof COMMAND_NAMES)[number]

export type PythonWorkspaceRef = {
  clear: () => void
  /** Runs the current code, streaming fresh commands - only called when
   * the player presses Play/Run Program. */
  run: () => void
}

export type PythonWorkspaceContextValue = {
  ref: RefObject<PythonWorkspaceRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** "python" is a real editor that runs via Pyodide; "blocklyAndPython" is
   * a read-only view of the equivalent code generated from the blocks. */
  mode: "python" | "blocklyAndPython"
  /** The `my_van` commands relevant to this level, shown in the Commands
   * modal. Only set for "python" mode levels. */
  commands?: CommandName[]
}

const PythonWorkspaceContext =
  createContext<PythonWorkspaceContextValue | null>(null)

export default PythonWorkspaceContext
