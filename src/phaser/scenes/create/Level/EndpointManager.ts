import {
  Delete as DeleteIcon,
  Home as HomeIcon,
  RotateRight as RotateRightIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material"
import Phaser from "phaser"

import * as layers from "../../../layers"
import type { AddRoadEventData, DeleteRoadEventData } from "./RoadManager"
import type { Direction, default as Level, Tile } from "."
import BaseManager from "./BaseManager"
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

type VariantBase<K extends string> = { key: K; crossoverTiles: Tile[] }
type EndpointBase<T extends string, V extends VariantBase<string>> = {
  type: T
  obj: Phaser.GameObjects.Image
  variant: V
}

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
type Pointer<E extends Endpoint = Endpoint> = { main: Tile; endpoint: E }
type Style = Tile & { style: "add" | "rotate" | "delete"; type: Type }

export default class extends BaseManager {
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

  // CSS cursor strings, pre-computed once.
  private readonly rotateCursor = this.level.muiIconToCursor(RotateRightIcon)
  private readonly homeCursor = this.level.muiIconToCursor(HomeIcon)
  private readonly deleteCursor = this.level.muiIconToCursor(DeleteIcon)
  private readonly warehouseCursor = this.level.muiIconToCursor(WarehouseIcon)

  /** The current style applied to the level. */
  private _style: Style | null = null

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

  /** A record of CFC-position-collisions for each house-variant-key. */
  private readonly _houseToCfcPositionCollisions: Record<
    HouseVariantKey,
    Position[]
  > = {
    // Straight variants (straight, dead-end, t-junction).
    left: ["right"],
    top: ["bottom"],
    right: ["left"],
    bottom: ["top"],
    // Inside-corner variants (turn, t-junction, crossroads).
    inTopLeft: ["bottom", "right", "bottomRight"],
    inTopRight: ["bottom", "left", "bottomLeft"],
    inBottomLeft: ["top", "right", "topRight"],
    inBottomRight: ["top", "left", "topLeft"],
    // Outside-corner variants (turn only).
    outTopLeft: ["bottom", "right"],
    outTopRight: ["bottom", "left"],
    outBottomLeft: ["top", "right"],
    outBottomRight: ["top", "left"],
  }

  constructor(level: Level) {
    super(level)

    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    level.game.events.on(Events.ADD_ROAD, onAddRoad)

    const onDeleteRoad = (data: DeleteRoadEventData) => this.onDeleteRoad(data)
    level.game.events.on(Events.DELETE_ROAD, onDeleteRoad)

    const onPointerDown = (pointer: Phaser.Input.Pointer) =>
      this.onPointerDown(pointer)
    level.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove = (pointer: Phaser.Input.Pointer) =>
      this.onPointerMove(pointer)
    level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
      level.game.events.off(Events.DELETE_ROAD, onDeleteRoad)
      level.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    })
  }

  /** Get the endpoint whose main tile is at the given tile, or `null`. */
  private endpoint(tile: Tile): Endpoint | null
  /**
   * Set the endpoint at the given tile.
   * If another endpoint already has its main tile here, it is cleared first.
   */
  private endpoint(tile: Tile, endpoint: Endpoint | null): Endpoint | null
  private endpoint({ row, col }: Tile, endpoint?: Endpoint | null) {
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

  private set style(value: Style | null) {
    // If the style is unchanged, do nothing.
    if (
      (this._style === null && value === null) ||
      (this._style !== null &&
        value !== null &&
        this._style.row === value.row &&
        this._style.col === value.col &&
        this._style.type === value.type &&
        this._style.style === value.style)
    )
      return
    this._style = value

    this.level.graphics.clear() // Clear any previous hover highlight

    if (value === null) {
      this.level.input.setDefaultCursor("pointer")
      return
    }

    const { style, type, ...tile } = value
    if (style === "rotate") {
      this.level.highlightTile(tile, 0xffff00)
      this.level.input.setDefaultCursor(this.rotateCursor)
    } else if (style === "delete") {
      this.level.highlightTile(tile, 0xff0000)
      this.level.input.setDefaultCursor(this.deleteCursor)
    } else {
      this.level.highlightTile(tile, 0x00ff00)
      this.level.input.setDefaultCursor(
        type === "house" ? this.homeCursor : this.warehouseCursor,
      )
    }
  }

  private get house() {
    // TODO: select the house type from the toolbox.
    return layers.objectGroup.objects.endpoints.house.common.orange
  }

  private get cfc() {
    // TODO: select the cfc type from the toolbox.
    return layers.objectGroup.objects.endpoints.cfc.warehouse.default
  }

  /** Checks if an endpoint can be rotated at the given tile. */
  private canRotate(endpoint: Endpoint, variants: Variant[]) {
    return variants.some(({ key }) => key !== endpoint.variant.key)
  }

  /** Adds an endpoint variant to the given tile. */
  private add(tile: Tile, type: Type, variant: Variant) {
    // Get the factory function for the specified type and variant.
    const factory =
      type === "house"
        ? this.house[variant.key as HouseVariantKey]
        : this.cfc[variant.key as CfcVariantKey]

    // Add the endpoint object to the endpoints layer.
    const obj = this.level.addObject("ObjectGroup.ENDPOINTS", factory(tile))

    // Occupy the tile and any crossover tiles for the endpoint variant.
    const endpoint = { type, obj, variant } as Endpoint
    this.endpoint(tile, endpoint)
    return endpoint
  }

  /** Delete an endpoint from the given tile. */
  private delete(tile: Tile, { obj }: Endpoint) {
    this.endpoint(tile, null)
    this.level.destroyObject("ObjectGroup.ENDPOINTS", obj)
  }

  /** Rotates the endpoint at the given tile to the next available variant. */
  private rotate(tile: Tile, endpoint: Endpoint, variants: Variant[]) {
    this.delete(tile, endpoint)

    let variantIndex = variants.findIndex(v => v.key === endpoint.variant.key)
    // Current variant is no longer valid, so reset to first.
    if (variantIndex === -1 || ++variantIndex >= variants.length)
      variantIndex = 0

    return this.add(tile, endpoint.type, variants[variantIndex])
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
    tile: Tile,
    type: Type,
    variantKey: VariantKey,
  ): Tile[] {
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
    tile: Tile,
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
    from: Tile & { type: Type; variant: { key: VariantKey } },
    to: Tile & { type: Type; variant: { key: VariantKey } },
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

    const collides = (pos: Position) => {
      if (to.type === "cfc") {
        const positions = this._houseToCfcPositionCollisions[from.variant.key]
        return positions.includes(pos)
      }
      const keys = this._houseToHouseVariantCollisions[from.variant.key][pos]
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
  private onAddRoad({ id, ...tile }: AddRoadEventData) {
    const endpoint = this.endpoint(tile)
    if (!endpoint) return

    const variants = this.variants(tile, endpoint.type, {
      roadId: id,
      excludeTile: true,
    })
    if (variants.length === 0) this.delete(tile, endpoint)
    else if (variants.every(({ key }) => key !== endpoint.variant.key)) {
      this.delete(tile, endpoint)
      this.add(tile, endpoint.type, variants[0])
    }
  }

  /** Handles the deletion of a road on the map. */
  private onDeleteRoad = (tile: DeleteRoadEventData) => {
    const endpoint = this.endpoint(tile)
    if (endpoint) this.delete(tile, endpoint)
  }

  /**
   * Handles pointer events on the map.
   *
   * This ensures a valid tool is active and that the pointer is over a valid
   * tile before calling the provided handler function. The handler function is
   * responsible for determining the appropriate style to apply based on the
   * tool, tile, and endpoint state.
   */
  private onPointer(
    pointer: Phaser.Input.Pointer,
    handle: (
      tool: "add-house" | "delete-house" | "add-cfc",
      tile: Tile,
      endpoint: Endpoint | null,
    ) => Style["style"] | undefined,
  ) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house" && tool !== "delete-house" && tool !== "add-cfc")
      return
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return
    const endpoint = this.endpoint(tile)
    const style = handle(tool, tile, endpoint)
    const type = tool === "add-cfc" ? "cfc" : "house"
    this.style = style ? { ...tile, style, type } : null
  }

  private onPointerDown = (pointer: Phaser.Input.Pointer) =>
    this.onPointer(pointer, (tool, tile, endpoint) => {
      const add = (type: Type) => {
        const variants = this.variants(tile, type)
        if (variants.length === 0) return null
        return this.add(tile, type, variants[0])
      }

      if (tool === "add-cfc") {
        if (endpoint) return
        const prevCfc = this._cfc // previous CFC
        if (add("cfc") && prevCfc) this.delete(prevCfc.main, prevCfc.endpoint)
      } else if (tool === "add-house") {
        if (!endpoint) {
          if (!(endpoint = add("house"))) return
          const variants = this.variants(tile, "house", { excludeTile: true })
          if (this.canRotate(endpoint, variants)) return "rotate"
        } else if (endpoint.type === "house") {
          const variants = this.variants(tile, "house", { excludeTile: true })
          if (!this.canRotate(endpoint, variants)) return
          this.rotate(tile, endpoint, variants)
          return "rotate"
        }
      } else if (endpoint?.type === "house") this.delete(tile, endpoint)
    })

  private onPointerMove = (pointer: Phaser.Input.Pointer) =>
    this.onPointer(pointer, (tool, tile, endpoint) => {
      const add = (type: Type) =>
        this.variants(tile, type).length > 0 ? "add" : undefined

      if (tool === "add-cfc") {
        if (!endpoint) return add("cfc")
      } else if (tool === "add-house") {
        if (!endpoint) return add("house")
        if (endpoint.type !== "house") return
        const variants = this.variants(tile, "house", { excludeTile: true })
        if (this.canRotate(endpoint, variants)) return "rotate"
      } else if (endpoint?.type === "house") return "delete"
    })
}
