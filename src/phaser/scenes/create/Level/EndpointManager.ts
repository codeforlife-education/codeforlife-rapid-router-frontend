import Phaser from "phaser"

import * as layers from "../../../layers"
import * as tilesets from "../../../tilesets"
import BasePlaceableManager, { type Placed } from "./BasePlaceableManager"
import type { Direction, default as Level } from "."
import { Events } from "../../../globals"

type Position =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"

// TODO: move to types phaser.d.ts
type VariantBase<K extends string> = {
  key: K
  crossoverTiles: Phaser.Types.Tilemaps.Tile[]
}
type EndpointBase<T extends string, V extends VariantBase<string>> = {
  id: tilesets.endpoints.ID
  type: T
  obj: Phaser.GameObjects.Image
  variant: V
}

/** Checks if the given endpoint id is a house variant. */
const isHouseId = (
  id: tilesets.endpoints.ID,
): id is tilesets.endpoints.house.ID =>
  (tilesets.endpoints.house.IDs as readonly number[]).includes(id)

type HouseVariantKey =
  | keyof layers.objectGroup.objects.StraightRotationVariants
  | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants
type HouseVariant = VariantBase<HouseVariantKey>
type HouseType = "house"
type House = EndpointBase<HouseType, HouseVariant>

type CfcVariantKey = keyof layers.objectGroup.objects.StraightRotationVariants
type CfcVariant = VariantBase<CfcVariantKey>
type CfcType = "cfc"
type Cfc = EndpointBase<CfcType, CfcVariant>

type VariantKey = HouseVariantKey | CfcVariantKey
type Variant = HouseVariant | CfcVariant
type Type = HouseType | CfcType
type Endpoint = House | Cfc
type Pointer<E extends Endpoint = Endpoint> = {
  main: Phaser.Types.Tilemaps.Tile
  endpoint: E
}

export default class extends BasePlaceableManager<
  layers.objectGroup.objects.endpoints.Name,
  tilesets.endpoints.ID,
  VariantKey
> {
  /**
   * The current CFC endpoint tile, if any.
   *
   * There can only be one CFC endpoint at a time.
   */
  private _cfc: Pointer<Cfc> | null = null

  /**
   * Persistent 2D array [row][col] tracking a endpoint's **main tile**. `null`
   * means no endpoint has its main tile at that position.
   */
  private readonly _main: (Endpoint | null)[][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => null),
  )

  /**
   * Persistent 2D array [row][col] tracking endpoints' **crossover tiles**. A
   * crossover tile is a tile that's occupied by an endpoint, but is not the
   * endpoint's main tile. Multiple endpoints can share a crossover tile so long
   * as they don't collide.
   */
  private readonly _crossovers: Pointer[][][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => []),
  )

  /** A record of house-variant-key collisions for each house-variant-key. */
  private readonly _houseToHouseVariantCollisions: Record<
    HouseVariantKey,
    Partial<Record<Position, HouseVariantKey[]>>
  > = {
    // Straight variants (straight, dead-end, t-junction).
    left: {
      topRight: ["inTopRight"],
      right: [
        "right",
        "outTopRight",
        "outBottomRight",
        "inTopRight",
        "inBottomRight",
      ],
      bottomRight: ["inBottomRight"],
    },
    top: {
      bottomLeft: ["inBottomLeft"],
      bottom: [
        "bottom",
        "outBottomLeft",
        "outBottomRight",
        "inBottomLeft",
        "inBottomRight",
      ],
      bottomRight: ["inBottomRight"],
    },
    right: {
      topLeft: ["inTopLeft"],
      left: [
        "left",
        "outTopLeft",
        "outBottomLeft",
        "inTopLeft",
        "inBottomLeft",
      ],
      bottomLeft: ["inBottomLeft"],
    },
    bottom: {
      topLeft: ["inTopLeft"],
      top: ["top", "outTopLeft", "outTopRight", "inTopLeft", "inTopRight"],
      topRight: ["inTopRight"],
    },
    // Inside-corner variants (turn, t-junction, crossroads).
    inTopLeft: {
      bottom: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
      right: ["top", "right", "inTopRight", "outTopRight"],
      bottomRight: ["bottom", "right", "inBottomRight", "outBottomRight"],
    },
    inTopRight: {
      bottom: ["bottom", "right", "inBottomRight", "outBottomRight"],
      left: ["top", "left", "inTopLeft", "outTopLeft"],
      bottomLeft: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
    },
    inBottomLeft: {
      top: ["top", "left", "inTopLeft", "outTopLeft"],
      right: ["bottom", "right", "inBottomRight", "outBottomRight"],
      topRight: ["top", "right", "inTopRight", "outTopRight"],
    },
    inBottomRight: {
      top: ["top", "right", "inTopRight", "outTopRight"],
      left: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
      topLeft: ["top", "left", "inTopLeft", "outTopLeft"],
    },
    // Outside-corner variants (turn only).
    outTopLeft: {
      bottom: ["bottom", "inBottomLeft"],
      right: ["right", "inTopRight"],
      bottomRight: ["inBottomRight"],
    },
    outTopRight: {
      bottom: ["bottom", "inBottomRight"],
      left: ["left", "inTopLeft"],
      bottomLeft: ["inBottomLeft"],
    },
    outBottomLeft: {
      top: ["top", "inTopLeft"],
      right: ["right", "inBottomRight"],
      topRight: ["inTopRight"],
    },
    outBottomRight: {
      top: ["top", "inTopRight"],
      left: ["left", "inBottomLeft"],
      topLeft: ["inTopLeft"],
    },
  }

  /** A record of CFC-variant-key collisions for each house-variant-key. */
  private readonly _houseToCfcVariantCollisions: Record<
    HouseVariantKey,
    Partial<Record<Position, CfcVariantKey[]>>
  > = {
    // Straight variants (straight, dead-end, t-junction).
    left: { right: ["top", "right", "bottom"] },
    top: { bottom: ["left", "right", "bottom"] },
    right: { left: ["left", "top", "bottom"] },
    bottom: { top: ["left", "top", "right"] },
    // Inside-corner variants (turn, t-junction, crossroads).
    inTopLeft: {
      bottom: ["bottom", "left"],
      right: ["top", "right"],
      bottomRight: ["bottom", "right"],
    },
    inTopRight: {
      bottom: ["bottom", "right"],
      left: ["top", "left"],
      bottomLeft: ["bottom", "left"],
    },
    inBottomLeft: {
      top: ["top", "left"],
      right: ["bottom", "right"],
      topRight: ["top", "right"],
    },
    inBottomRight: {
      top: ["top", "right"],
      left: ["bottom", "left"],
      topLeft: ["top", "left"],
    },
    // Outside-corner variants (turn only).
    outTopLeft: { bottom: ["bottom"], right: ["right"] },
    outTopRight: { bottom: ["bottom"], left: ["left"] },
    outBottomLeft: { top: ["top"], right: ["right"] },
    outBottomRight: { top: ["top"], left: ["left"] },
  }

  constructor(level: Level) {
    super(level)

    const onAddRoad: Phaser.Events.AddRoad = (...args) =>
      this.onAddRoad(...args)
    level.game.events.on(Events.ADD_ROAD, onAddRoad)

    const onDeleteRoad: Phaser.Events.DeleteRoad = (...args) =>
      this.onDeleteRoad(...args)
    level.game.events.on(Events.DELETE_ROAD, onDeleteRoad)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
      level.game.events.off(Events.DELETE_ROAD, onDeleteRoad)
    })
  }

  /**
   * Checks if the given tile is occupied by any endpoint, either as its main
   * tile or one of its crossover tiles.
   */
  isOccupied({ row, col }: Phaser.Types.Tilemaps.Tile): boolean {
    return (
      this._main[row][col] !== null || this._crossovers[row][col].length > 0
    )
  }

  /** Get the endpoint whose main tile is at the given tile, or `null`. */
  private endpoint(tile: Phaser.Types.Tilemaps.Tile): Endpoint | null
  /**
   * Set the endpoint at the given tile.
   * If another endpoint already has its main tile here, it is cleared first.
   */
  private endpoint(
    tile: Phaser.Types.Tilemaps.Tile,
    endpoint: Endpoint | null,
  ): Endpoint | null
  private endpoint(
    { row, col }: Phaser.Types.Tilemaps.Tile,
    endpoint?: Endpoint | null,
  ) {
    const currentMain = this._main[row][col]
    if (endpoint === undefined) return currentMain

    // Clear the existing main endpoint at this tile (if any).
    if (currentMain !== null) {
      // Remove it from its crossover tiles.
      currentMain.variant.crossoverTiles.forEach(cTile => {
        const arr = this._crossovers[cTile.row][cTile.col]
        const idx = arr.findIndex(
          ({ main }) => main.col === col && main.row === row,
        )
        if (idx !== -1) arr.splice(idx, 1)
      })
      this._main[row][col] = null
      // Clear the tracked CFC endpoint if it's the one being removed.
      if (
        currentMain.type === "cfc" &&
        this._cfc?.main.col === col &&
        this._cfc.main.row === row
      )
        this._cfc = null
    }

    if (endpoint !== null) {
      this._main[row][col] = endpoint
      // Track the CFC endpoint if applicable.
      if (endpoint.type === "cfc") this._cfc = { main: { row, col }, endpoint }
      // Register this endpoint as a crossover in each of its crossover tiles.
      endpoint.variant.crossoverTiles.forEach(cTile => {
        const crossover: Pointer = { main: { row, col }, endpoint }
        this._crossovers[cTile.row][cTile.col].push(crossover)
      })
    }

    return currentMain
  }

  protected get tool() {
    return this.level.toolbox?.box === "endpoints"
      ? this.level.toolbox.tool
      : null
  }

  protected getFactory(id: tilesets.endpoints.ID, variantKey: VariantKey) {
    const factory = layers.objectGroup.objects.getFactory<
      layers.objectGroup.objects.endpoints.Name,
      tilesets.endpoints.ID,
      VariantKey
    >(id)
    return factory?.[variantKey]
  }

  protected canPlace(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.endpoints.ID,
  ): boolean {
    return this.variants(tile, isHouseId(id) ? "house" : "cfc").length > 0
  }

  protected validVariantKeys(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.endpoints.ID,
  ): VariantKey[] {
    return this.variants(tile, isHouseId(id) ? "house" : "cfc", {
      excludeTile: true,
    }).map(({ key }) => key)
  }

  protected getPlaced(
    tile: Phaser.Types.Tilemaps.Tile,
  ): Placed<tilesets.endpoints.ID, VariantKey> | null {
    const endpoint = this._main[tile.row][tile.col]
    return endpoint
      ? { id: endpoint.id, variantKey: endpoint.variant.key, obj: endpoint.obj }
      : null
  }

  /** Places an endpoint variant onto the given tile. */
  protected place(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.endpoints.ID,
    variantKey: VariantKey,
  ) {
    const type = isHouseId(id) ? "house" : "cfc"
    const factory = this.getFactory(id, variantKey)
    if (!factory) return

    const variant = {
      key: variantKey,
      crossoverTiles: this.variantKeyToCrossoverTiles(tile, type, variantKey),
    } as Variant

    // Add the endpoint object to the endpoints layer.
    const obj = this.level.addObject("ObjectGroup.ENDPOINTS", factory(tile))

    // A new CFC replaces the previous one (only 1 CFC is allowed on the map).
    const prevCfc = type === "cfc" ? this._cfc : null

    // Occupy the tile and any crossover tiles for the endpoint variant.
    const endpoint = { id, type, obj, variant } as Endpoint
    this.endpoint(tile, endpoint)

    if (prevCfc && !this.sameTile(prevCfc.main, tile)) this.remove(prevCfc.main)

    // Emit an event to notify other systems that an endpoint has been added.
    this.level.game.events.emit(Events.ADD_ENDPOINT, {
      ...tile,
      ...endpoint,
    } as Phaser.Events.AddEndpointData)
  }

  /** Removes the endpoint from the given tile, if any. */
  protected remove(tile: Phaser.Types.Tilemaps.Tile) {
    const endpoint = this._main[tile.row][tile.col]
    if (!endpoint) return

    if (this.selected && this.sameTile(this.selected, tile)) this.deselect()
    this.endpoint(tile, null)
    this.level.destroyObject("ObjectGroup.ENDPOINTS", endpoint.obj)
  }

  /**
   * Returns the endpoint variants for a given road ID.
   *
   * Variants are ordered in a clockwise direction starting from left:
   * 1. Left
   * 2. Top Left
   * 3. Top
   * 4. Top Right
   * 5. Right
   * 6. Bottom Right
   * 7. Bottom
   * 8. Bottom Left
   */
  private roadIdToVariantKeys(
    type: Type,
    roadId: layers.tile.data.RoadID,
  ): VariantKey[] {
    if (type === "cfc") {
      if (roadId === this.level.road.ids.DeadEnd.TOP) return ["top"]
      if (roadId === this.level.road.ids.DeadEnd.BOTTOM) return ["bottom"]
      if (roadId === this.level.road.ids.DeadEnd.LEFT) return ["left"]
      if (roadId === this.level.road.ids.DeadEnd.RIGHT) return ["right"]
    } else {
      // Straight
      if (roadId === this.level.road.ids.Straight.HORIZONTAL)
        return ["top", "bottom"]
      if (roadId === this.level.road.ids.Straight.VERTICAL)
        return ["left", "right"]
      // Dead end
      if (roadId === this.level.road.ids.DeadEnd.TOP)
        return ["left", "top", "right"]
      if (roadId === this.level.road.ids.DeadEnd.BOTTOM)
        return ["left", "right", "bottom"]
      if (roadId === this.level.road.ids.DeadEnd.LEFT)
        return ["left", "top", "bottom"]
      if (roadId === this.level.road.ids.DeadEnd.RIGHT)
        return ["top", "right", "bottom"]
      // Turn
      if (roadId === this.level.road.ids.Turn.TOP_LEFT)
        return ["outTopLeft", "inBottomRight"]
      if (roadId === this.level.road.ids.Turn.TOP_RIGHT)
        return ["outTopRight", "inBottomLeft"]
      if (roadId === this.level.road.ids.Turn.BOTTOM_LEFT)
        return ["inTopRight", "outBottomLeft"]
      if (roadId === this.level.road.ids.Turn.BOTTOM_RIGHT)
        return ["inTopLeft", "outBottomRight"]
      // T-junction
      if (roadId === this.level.road.ids.TJunction.TOP_LEFT_RIGHT)
        return ["top", "inBottomRight", "inBottomLeft"]
      if (roadId === this.level.road.ids.TJunction.LEFT_RIGHT_BOTTOM)
        return ["inTopLeft", "inTopRight", "bottom"]
      if (roadId === this.level.road.ids.TJunction.TOP_RIGHT_BOTTOM)
        return ["inTopLeft", "right", "inBottomLeft"]
      if (roadId === this.level.road.ids.TJunction.TOP_LEFT_BOTTOM)
        return ["left", "inTopRight", "inBottomRight"]
      // Crossroads
      if (roadId === this.level.road.ids.CROSSROADS)
        return ["inTopLeft", "inTopRight", "inBottomRight", "inBottomLeft"]
    }

    // No road tile means no endpoint can be placed, so skip.
    return []
  }

  /** Returns the tiles that a endpoint variant crosses over into. */
  private variantKeyToCrossoverTiles(
    tile: Phaser.Types.Tilemaps.Tile,
    type: Type,
    variantKey: VariantKey,
  ): Phaser.Types.Tilemaps.Tile[] {
    const step = (dirs: Direction[]) => {
      const destination = this.level.moveFromTile(tile, dirs)
      return destination ? [destination] : []
    }

    // Precompute the neighbouring tiles in each direction.
    const l = step(["left"])
    const r = step(["right"])
    const t = step(["top"])
    const b = step(["bottom"])
    const tr = step(["top", "right"])
    const tl = step(["top", "left"])
    const br = step(["bottom", "right"])
    const bl = step(["bottom", "left"])

    if (type === "cfc") {
      const key = variantKey as CfcVariantKey
      if (key === "top") return b
      if (key === "bottom") return t
      if (key === "left") return r
      if (key === "right") return l
    } else {
      // Return the crossover tiles based on the house variant.
      const key = variantKey as HouseVariantKey
      if (key === "top") return b
      if (key === "bottom") return t
      if (key === "left") return r
      if (key === "right") return l
      if (key === "inTopLeft") return [...b, ...r, ...br]
      if (key === "inTopRight") return [...b, ...l, ...bl]
      if (key === "inBottomLeft") return [...t, ...r, ...tr]
      if (key === "inBottomRight") return [...t, ...l, ...tl]
    }

    return [] // No crossover tiles for variant.
  }

  /**
   * Returns the endpoint variants that can be placed on a given tile.
   *
   * A variant is valid if the main tile and all crossover tiles are unoccupied
   * by a colliding endpoint.
   */
  private variants(
    tile: Phaser.Types.Tilemaps.Tile,
    type: Type,
    {
      roadId = this.level.road.dirsToId(this.level.road.dirs(tile)),
      excludeTile = false,
    }: Partial<{
      roadId?: layers.tile.data.RoadID
      excludeTile?: boolean
    }> = {},
  ): Variant[] {
    return (
      // Get all variants for the given road ID.
      this.roadIdToVariantKeys(type, roadId)
        // For each variant, compute its crossover tiles.
        .map(variantKey => ({
          key: variantKey,
          crossoverTiles: this.variantKeyToCrossoverTiles(
            tile,
            type,
            variantKey,
          ),
        }))
        // Filter out variants where the main tile or any crossover tile is
        // already occupied by a colliding endpoint.
        // - A main tile of another endpoint blocks only if it collides with the
        //   new variant.
        // - A crossover of another endpoint blocks only if it collides with the
        //   new variant.
        .filter(({ key, crossoverTiles }) => {
          const variant = { ...tile, type, variant: { key } }

          return [tile, ...crossoverTiles].every(t => {
            const main = this._main[t.row][t.col]
            const crossovers = this._crossovers[t.row][t.col]

            if (
              // If this is the main tile of an endpoint...
              main !== null && //
              // ...and we're not excluding the endpoint at the variant's main
              // tile (or `t` is not the variant's main tile)...
              !(excludeTile && t.col === tile.col && t.row === tile.row) &&
              // ...and the new variant collides with the existing main tile...
              this.variantCollides(variant, { ...t, ...main })
            )
              return false // ...then the variant is invalid.

            // The variant is also invalid if any existing endpoint with a
            // crossover at `t` collides with the new variant `key` at `tile`.
            return crossovers.every(
              c =>
                // Ignore the endpoint at `tile` if it's being excluded (i.e.
                // the endpoint currently being rotated).
                (excludeTile &&
                  c.main.col === tile.col &&
                  c.main.row === tile.row) ||
                // The new variant is valid if it doesn't collide with `c`.
                !this.variantCollides({ ...c.main, ...c.endpoint }, variant),
            )
          })
        })
    )
  }

  /**
   * Returns the colliding variants for a tile that an endpoint occupies.
   *
   * Collisions are determined by the direction from the endpoint's main tile to
   * the crossover tile. For example, if an endpoint's main tile is at (1, 1)
   * and it has a crossover tile at (1, 2), then the direction is "right" and
   * the colliding variants are determined accordingly.
   */
  private variantCollides(
    from: Phaser.Types.Tilemaps.Tile & {
      type: Type
      variant: { key: VariantKey }
    },
    to: Phaser.Types.Tilemaps.Tile & {
      type: Type
      variant: { key: VariantKey }
    },
  ): boolean {
    if (from.type === "cfc") {
      // 2 CFCs cannot collide as there is only ever 1 CFC on the map.
      if (to.type !== "house") return false
      ;[from, to] = [to, from] // `from` is always the house and `to` is the CFC
    }

    const isAtDirs = (dirs: Direction[]) => {
      const newTile = this.level.moveFromTile(from, dirs)
      return newTile && newTile.col === to.col && newTile.row === to.row
    }

    const collides = (position: Position) => {
      const keys = (
        to.type === "house"
          ? this._houseToHouseVariantCollisions
          : this._houseToCfcVariantCollisions
      )[from.variant.key][position]
      return keys ? keys.includes(to.variant.key) : false
    }

    // Determine the direction from the main tile to the crossover tile and
    // return the colliding variants.
    if (isAtDirs(["left"])) return collides("left")
    if (isAtDirs(["right"])) return collides("right")
    if (isAtDirs(["top"])) return collides("top")
    if (isAtDirs(["bottom"])) return collides("bottom")
    if (isAtDirs(["top", "left"])) return collides("topLeft")
    if (isAtDirs(["top", "right"])) return collides("topRight")
    if (isAtDirs(["bottom", "left"])) return collides("bottomLeft")
    if (isAtDirs(["bottom", "right"])) return collides("bottomRight")

    return false
  }

  /** Handles the addition of a road on the map. */
  private onAddRoad: Phaser.Events.AddRoad = ({ id, ...tile }) => {
    const endpoint = this.endpoint(tile)
    if (!endpoint) return

    const variants = this.variants(tile, endpoint.type, {
      roadId: id,
      excludeTile: true,
    })
    if (variants.length === 0) this.remove(tile)
    else if (variants.every(({ key }) => key !== endpoint.variant.key)) {
      this.remove(tile)
      this.place(tile, endpoint.id, variants[0].key)
    }
  }

  /** Handles the deletion of a road on the map. */
  private onDeleteRoad: Phaser.Events.DeleteRoad = tile => {
    if (this.endpoint(tile)) this.remove(tile)
  }
}
