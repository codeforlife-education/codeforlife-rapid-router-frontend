import Phaser from "phaser"

import { Densities, Depths, getDensity } from "./objects"

/**
 * Check if `obj1` can overlap `obj2`, based on their depths and densities.
 * Pass `obj1Bounds` to check `obj1` somewhere other than where it currently is.
 */
export function canOverlap(
  obj1: Phaser.GameObjects.Image,
  obj2: Phaser.GameObjects.Image,
  obj1Bounds = obj1.getBounds(),
) {
  if (obj1 === obj2) return true

  const obj2Bounds = obj2.getBounds()

  // The centre of one object can never be inside the bounds of another.
  if (obj2Bounds.contains(obj1Bounds.centerX, obj1Bounds.centerY)) return false

  // The bounds of the objects don't overlap - no need for further checks.
  if (!Phaser.Geom.Rectangle.Overlaps(obj1Bounds, obj2Bounds)) return true

  // 2 objects that are both below ground can't overlap.
  if (obj1.depth === Depths.BELOW_GROUND && obj2.depth === Depths.BELOW_GROUND)
    return false

  // A solid object can't overlap another object unless one is above ground
  // and the other is below ground.
  if (
    (getDensity(obj1.name) === Densities.SOLID ||
      getDensity(obj2.name) === Densities.SOLID) &&
    !(
      (obj1.depth === Depths.BELOW_GROUND &&
        obj2.depth === Depths.ABOVE_GROUND) ||
      (obj1.depth === Depths.ABOVE_GROUND && obj2.depth === Depths.BELOW_GROUND)
    )
  )
    return false

  return true // The objects are allowed to overlap.
}
