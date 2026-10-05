import type { OrthogonalTilemap } from "."

const TILEMAP_CACHE = new Map<number, Promise<OrthogonalTilemap>>()

/** Lazily loads (and caches) a level's tile/object data */
export function getTilemap(levelId: number): Promise<OrthogonalTilemap> {
  let tilemap = TILEMAP_CACHE.get(levelId)
  if (!tilemap) {
    tilemap = import(`./level${levelId}.ts`).then(
      module => (module as { default: OrthogonalTilemap }).default,
    )
    TILEMAP_CACHE.set(levelId, tilemap)
  }
  return tilemap
}
