import type { TilemapGroup } from "../../phaser/tilemaps"
import { paths } from "../../routes"

/**
 * The path to the level with the given id in the given group, if there is
 * one. Custom levels (which have no group) have no neighbouring levels.
 */
export function getLevelPath(id: number, tilemapGroup?: TilemapGroup) {
  if (!tilemapGroup) return undefined
  const ids = paths[tilemapGroup].level.id as unknown as Record<
    number,
    { _: string } | undefined
  >
  return ids[id]?._
}
