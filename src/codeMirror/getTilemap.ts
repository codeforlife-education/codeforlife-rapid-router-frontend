import type { OrthogonalTilemap } from "../phaser/tilemaps"

const tilemapCache = new Map<number, Promise<OrthogonalTilemap>>()

/**
 * Lazily loads (and caches) a level's tile/object data - the same
 * dynamic-import pattern `Preloader.lazyLoadTilemap` uses, but without
 * needing a Phaser instance, just the plain data. Shared by the Pyodide
 * Worker (`pyodide.worker.ts`, "python" mode) and the direct Blockly
 * interpreter (`blockly/interpreter.ts`), so it must stay import-free of
 * both Phaser's runtime and Pyodide.
 */
export function getTilemap(levelId: number): Promise<OrthogonalTilemap> {
  let tilemap = tilemapCache.get(levelId)
  if (!tilemap) {
    tilemap = import(`../phaser/tilemaps/level${levelId}.ts`).then(
      module => (module as { default: OrthogonalTilemap }).default,
    )
    tilemapCache.set(levelId, tilemap)
  }
  return tilemap
}
