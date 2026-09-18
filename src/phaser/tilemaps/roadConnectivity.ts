/**
 * Road tile connectivity - shared between the live Phaser game
 * (`CharacterManager`) and the headless level simulator (`LevelSimulator`),
 * so both agree on exactly which side(s) of a road tile actually connect to
 * its neighbours. A tile being non-empty is NOT enough on its own: e.g. a
 * dead end or turn tile only opens onto 1-2 of its 4 sides, so entering/
 * exiting via a side it doesn't open onto must be treated as off-road, even
 * though the tile itself is "road".
 */
import * as tilesets from "../tilesets"
import { type Direction, turnRight } from "./navigation"

/** Each road type's open sides before any rotation is applied - matching
 * that type's own canonical (`0°`) named variant in `layers/tile/data.ts`
 * (e.g. Straight's `VERTICAL`, Turn's `BOTTOM_LEFT`). */
const OPEN_SIDES_AT_0_DEGREES = {
  STRAIGHT: ["top", "bottom"],
  TURN: ["bottom", "left"],
  T_JUNCTION: ["top", "left", "bottom"],
  CROSSROADS: ["top", "right", "bottom", "left"],
  DEAD_END: ["bottom"],
} as const satisfies Record<string, readonly Direction[]>

/** Maps every material's canonical (un-rotated) road tile index to its
 * open sides at `0°`. */
const OPEN_SIDES_BY_INDEX = new Map<number, readonly Direction[]>(
  [tilesets.IDs.Road.Asphalt, tilesets.IDs.Road.Dirt].flatMap(material =>
    Object.entries(OPEN_SIDES_AT_0_DEGREES).map(([type, sides]) => [
      material[type as keyof typeof material],
      sides,
    ]),
  ),
)

/**
 * The compass directions a road tile is actually open on, given its
 * canonical (un-rotated) tile index and clockwise rotation in radians (as
 * produced by `layers/tile/data.ts`'s `decode`, or a live Phaser tile's own
 * `index`/`rotation`). `undefined` if `index` isn't a recognised road tile.
 */
export function roadOpenSides(
  index: number,
  rotation: number,
): Set<Direction> | undefined {
  const sidesAt0 = OPEN_SIDES_BY_INDEX.get(index)
  if (!sidesAt0) return undefined

  const steps = ((Math.round(rotation / (Math.PI / 2)) % 4) + 4) % 4
  let sides: readonly Direction[] = sidesAt0
  for (let i = 0; i < steps; i++) sides = sides.map(turnRight)
  return new Set(sides)
}
