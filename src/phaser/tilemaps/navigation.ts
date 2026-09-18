/**
 * Pure direction/heading math shared between the live Phaser game
 * (`CharacterManager`) and anything else that needs to reason about a
 * character's position/heading on the road grid without depending on
 * Phaser (e.g. a headless level simulator).
 */

export type Direction = "top" | "right" | "bottom" | "left"

/** Clockwise order of directions - matches the endpoints' own rotation convention. */
export const DIRECTION_ORDER: readonly Direction[] = [
  "top",
  "right",
  "bottom",
  "left",
]

/** Unit row/col step for each direction. */
export const STEP_BY_DIRECTION: Record<
  Direction,
  { row: number; col: number }
> = {
  top: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  bottom: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
}

export const turnLeft = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 3) % 4]
export const turnRight = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 1) % 4]
export const turnAround = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 2) % 4]
