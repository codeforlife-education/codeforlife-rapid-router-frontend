import Phaser from "phaser"

import * as layers from "../../../layers"
import BaseTileLayerManager, { type DragEndData } from "./BaseTileLayerManager"
import { type COLS, Events, type ROWS } from "../../../globals"
import type { Direction, DirectionSet, default as Level } from "."

/**
 * Reverse of `dirsToId`: maps every possible road tile ID, across every road
 * subtype (asphalt, dirt, etc.), back to the set of directions it represents.
 */
const DIRS_BY_ID = new Map<layers.tile.data.RoadID, DirectionSet>()
for (const ids of Object.values(layers.tile.data.IDs.Road)) {
  const set = (...dirs: Direction[]) => new Set(dirs) as DirectionSet

  DIRS_BY_ID.set(ids.DeadEnd.TOP, set("top"))
  DIRS_BY_ID.set(ids.DeadEnd.BOTTOM, set("bottom"))
  DIRS_BY_ID.set(ids.DeadEnd.LEFT, set("left"))
  DIRS_BY_ID.set(ids.DeadEnd.RIGHT, set("right"))
  DIRS_BY_ID.set(ids.Straight.VERTICAL, set("top", "bottom"))
  DIRS_BY_ID.set(ids.Straight.HORIZONTAL, set("left", "right"))
  DIRS_BY_ID.set(ids.Turn.TOP_LEFT, set("top", "left"))
  DIRS_BY_ID.set(ids.Turn.TOP_RIGHT, set("top", "right"))
  DIRS_BY_ID.set(ids.Turn.BOTTOM_LEFT, set("bottom", "left"))
  DIRS_BY_ID.set(ids.Turn.BOTTOM_RIGHT, set("bottom", "right"))
  DIRS_BY_ID.set(
    ids.TJunction.LEFT_RIGHT_BOTTOM,
    set("left", "right", "bottom"),
  )
  DIRS_BY_ID.set(ids.TJunction.TOP_LEFT_BOTTOM, set("top", "left", "bottom"))
  DIRS_BY_ID.set(ids.TJunction.TOP_LEFT_RIGHT, set("top", "left", "right"))
  DIRS_BY_ID.set(ids.TJunction.TOP_RIGHT_BOTTOM, set("top", "right", "bottom"))
  DIRS_BY_ID.set(ids.CROSSROADS, set("top", "left", "right", "bottom"))
}

export default class extends BaseTileLayerManager<"add" | "delete"> {
  /**
   * Persistent 2D array [row][col] of all placed road tiles.
   * An empty set means no road tile has been placed at that position.
   */
  private readonly _dirs = Array.from(
    { length: this.level.tilemap.height },
    () =>
      Array.from(
        { length: this.level.tilemap.width },
        () => new Set() as DirectionSet,
      ),
  )

  /** The type of road currently being placed. */
  private type: keyof typeof layers.tile.data.IDs.Road = "Asphalt"

  constructor(level: Level) {
    super(level, {
      // A direction between 2 tiles is needed to classify a road, so at
      // least 2 tiles must be visited before a road can be added.
      add: { drawDirs: true, highlight: { color: 0x00ff00 }, minTiles: 2 },
      delete: { drawDirs: false, highlight: { color: 0xff0000 } },
    })

    const onHoverMove: Phaser.Input.Events.PointerMove = (...args) =>
      this.updateCursor(...args)
    level.input.on(Phaser.Input.Events.POINTER_MOVE, onHoverMove)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.input.off(Phaser.Input.Events.POINTER_MOVE, onHoverMove)
    })
  }

  protected get box() {
    return "road" as const
  }

  dirs = (tile: Phaser.Types.Tilemaps.Tile) => this._dirs[tile.row][tile.col]

  get ids() {
    return layers.tile.data.IDs.Road[this.type]
  }

  /** Exports the current road grid as a Tiled tile layer's `data`. */
  toTiledData() {
    return Array.from({ length: this.level.tilemap.height }, (_, row) =>
      Array.from({ length: this.level.tilemap.width }, (_, col) =>
        this.dirsToId(this.dirs({ col, row })),
      ),
    ) as (layers.tile.data.RoadID[] & { length: typeof COLS })[] & {
      length: typeof ROWS
    }
  }

  /** Rehydrates the road grid from a previously-exported Tiled layer `data`. */
  fromTiledData(data: readonly layers.tile.data.RoadID[], width: number) {
    data.forEach((id, i) => {
      const dirs = DIRS_BY_ID.get(id)
      if (!dirs) return // Empty tile, or an unrecognized ID.

      const tile = { row: Math.floor(i / width), col: i % width }
      for (const dir of dirs) this.dirs(tile).add(dir)
    })
  }

  /**
   * Called whenever a tile's connections change. Classifies the tile based on
   * its full set of open sides and places the correct road tile. Connections
   * accumulate across drags, so a tile may be upgraded (e.g. turn → T-junction)
   * by a subsequent drag.
   */
  private add(tile: Phaser.Types.Tilemaps.Tile, dirs: DirectionSet) {
    const id = this.dirsToId(dirs)
    this.level.putTileAt("Tile.ROAD", id, tile.col, tile.row)
    this.level.game.events.emit(Events.ADD_ROAD, {
      ...tile,
      id,
    } as Phaser.Events.AddRoadData)
  }

  /** Deletes a road tile at the given tile position. */
  private delete(tile: Phaser.Types.Tilemaps.Tile) {
    this.level.layers["Tile.ROAD"].putTileAt(-1, tile.col, tile.row)
    this.level.game.events.emit(Events.DELETE_ROAD, tile)
  }

  /**
   * Clears the road tile data and visual for every tile highlighted during a
   * delete-road drag. Neighbours of deleted tiles that had a connection into
   * the deleted tile also have that connection removed — so deleting a
   * crossroads turns the four previously-connected straights into dead ends
   * pointing away from where the crossroads was.
   */
  private finalizeDeleteDrag(drag: Pick<DragEndData<"add" | "delete">, "set">) {
    // Collect every tile that needs to be redrawn (deleted tiles + affected
    // neighbours) so we only touch the minimum set.
    const toRedraw = new Set(drag.set)

    for (const key of drag.set) {
      const tile = this.level.keyToTile(key)
      const deletedDirs = this.dirs(tile)

      // For each direction the deleted tile had, remove the back-connection
      // from the neighbouring tile and queue it for redraw.
      for (const dir of deletedDirs) {
        const nTile = this.level.moveFromTile(tile, [dir])
        if (!nTile) continue
        this.dirs(nTile).delete(this.level.dirOpposites[dir])
        toRedraw.add(this.level.tileToKey(nTile))
      }

      // Clear the deleted tile's own directions.
      this.dirs(tile).clear()
    }

    // Redraw only the affected tiles.
    for (const key of toRedraw) {
      const tile = this.level.keyToTile(key)
      const dirs = this.dirs(tile)

      // If the tile has connections, redraw the road tile.
      if (dirs.size !== 0) this.add(tile, dirs)
      // Otherwise, remove the road tile entirely.
      else this.delete(tile)
    }
  }

  /**
   * Derives the exit connections each visited tile gained from the drag, merges
   * them into roadDirs, then calls addRoad() for every affected tile.
   *
   * Only exit connections are recorded: moving from tile A → tile B adds an
   * exit connection to A only. Phaser.Types.Tilemaps.Tile B is only connected when the cursor leaves
   * it. This means two adjacent tiles never force a shared connection on each
   * other.
   */
  private finalizeAddDrag(
    drag: Pick<DragEndData<"add" | "delete">, "sequence">,
  ) {
    const pending = new Map<
      string,
      Phaser.Types.Tilemaps.Tile & { dirs: DirectionSet }
    >()

    for (let i = 0; i < drag.sequence.length; i++) {
      const current = drag.sequence[i]
      const currentKey = this.level.tileToKey(current)
      if (!pending.has(currentKey)) {
        pending.set(currentKey, { ...current, dirs: new Set() as DirectionSet })
      }

      const next = drag.sequence[i + 1]
      if (!next) continue
      const nextKey = this.level.tileToKey(next)
      if (!pending.has(nextKey)) {
        pending.set(nextKey, { ...next, dirs: new Set() as DirectionSet })
      }

      // Bidirectional connection: curr exits toward next, and next connects
      // back to curr. Both are needed for correct road tile classification
      // (e.g. a middle tile needs both its entry and exit directions so it
      // becomes a straight road rather than two dead ends).
      const dir = this.level.dirBetweenTiles(current, next)
      if (this.level.validTileDirs(current)[dir])
        pending.get(currentKey)!.dirs.add(dir)
      const oppositeDir = this.level.dirOpposites[dir]
      if (this.level.validTileDirs(next)[oppositeDir])
        pending.get(nextKey)!.dirs.add(oppositeDir)
    }

    // Merge new connections into the persistent grid, then redraw each tile.
    for (const { dirs, ...tile } of pending.values()) {
      const currentDirs = this.dirs(tile)
      for (const dir of dirs) currentDirs.add(dir)
      this.add(tile, currentDirs)
    }
  }

  protected onDragEnd({ tool, ...drag }: DragEndData<"add" | "delete">) {
    if (tool === "add") this.finalizeAddDrag(drag)
    else if (tool === "delete") this.finalizeDeleteDrag(drag)
  }

  private updateCursor: Phaser.Input.Events.PointerMove = pointer => {
    const tool = this.tool
    if (!tool) return

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    const canAct =
      !!tile &&
      (tool === "add"
        ? this.dirs(tile).size <
          Object.values(this.level.validTileDirs(tile)).filter(Boolean).length
        : this.dirs(tile).size > 0)

    this.level.input.setDefaultCursor(canAct ? "all-scroll" : "default")
  }

  dirsToId(dirs: DirectionSet): layers.tile.data.RoadID {
    // No connections, no road tile.
    if (dirs.size === 0) return layers.tile.data.IDs.EMPTY
    // Dead end
    else if (dirs.size === 1)
      if (dirs.has("top")) return this.ids.DeadEnd.TOP
      else if (dirs.has("bottom")) return this.ids.DeadEnd.BOTTOM
      else if (dirs.has("left")) return this.ids.DeadEnd.LEFT
      else return this.ids.DeadEnd.RIGHT
    // Straight or turn
    else if (dirs.size === 2)
      if (dirs.has("top"))
        if (dirs.has("bottom")) return this.ids.Straight.VERTICAL
        else if (dirs.has("left")) return this.ids.Turn.TOP_LEFT
        else return this.ids.Turn.TOP_RIGHT
      else if (dirs.has("bottom"))
        if (dirs.has("left")) return this.ids.Turn.BOTTOM_LEFT
        else return this.ids.Turn.BOTTOM_RIGHT
      else return this.ids.Straight.HORIZONTAL
    // T-junction
    else if (dirs.size === 3)
      if (!dirs.has("top")) return this.ids.TJunction.LEFT_RIGHT_BOTTOM
      else if (!dirs.has("bottom")) return this.ids.TJunction.TOP_LEFT_RIGHT
      else if (!dirs.has("left")) return this.ids.TJunction.TOP_RIGHT_BOTTOM
      else return this.ids.TJunction.TOP_LEFT_BOTTOM
    // Crossroads
    else return this.ids.CROSSROADS
  }
}
