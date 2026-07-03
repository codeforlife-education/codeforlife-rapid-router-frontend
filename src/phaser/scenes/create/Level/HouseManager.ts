import Phaser from "phaser"
import RotateRightIcon from "@mui/icons-material/RotateRight"

import * as layers from "../../../layers"
import type { AddRoadEventData, DeleteRoadEventData } from "./RoadManager"
import type { Direction, default as Level, Tile } from "."
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"

type VariantKey =
  | keyof layers.objectGroup.objects.StraightRotationVariants
  | keyof layers.objectGroup.objects.endpoints.house.DiagonalRotationVariants
type Variant = { key: VariantKey; crossoverTiles: Tile[] }
type House = { obj: Phaser.GameObjects.Image; variant: Variant }
type Crossover = House & Tile
type Style = Tile & { type: "add" | "rotate" | "delete" }

export default class extends BaseManager {
  /**
   * Persistent 2D arrays [row][col] tracking house occupancy.
   * - `_main[r][c]` is the house whose **main tile** is at (r, c), or `null`.
   * - `_crossovers[r][c]` is the list of houses that have a **crossover tile**
   *   at (r, c). A tile can simultaneously have a main house and crossovers
   *   from non-colliding houses, so these must be tracked separately.
   */
  private readonly _main: (House | null)[][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => null),
  )
  private readonly _crossovers: Crossover[][][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => []),
  )

  /** CSS cursor string for the rotate-right icon, pre-computed once. */
  private readonly rotateCursor = this.level.muiIconToCursor(RotateRightIcon)

  /** The current style applied to the level. */
  private _style: Style | null = null

  private readonly _variantCollisions: Record<
    VariantKey,
    Partial<
      Record<
        | "left"
        | "right"
        | "top"
        | "bottom"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight",
        VariantKey[]
      >
    >
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

  /** Get the house whose main tile is at the given tile, or `null`. */
  private houses(tile: Tile): House | null
  /**
   * Set the house at the given tile.
   * If another house already has its main tile here, it is cleared first.
   * Crossover entries from non-colliding houses are preserved.
   */
  private houses(tile: Tile, house: House | null): House | null
  private houses({ row, col }: Tile, house?: House | null) {
    const currentMain = this._main[row][col]
    if (house === undefined) return currentMain

    // Clear the existing main house at this tile (if any).
    if (currentMain !== null) {
      // Remove it from its crossover tiles.
      currentMain.variant.crossoverTiles.forEach(cTile => {
        const arr = this._crossovers[cTile.row][cTile.col]
        const idx = arr.findIndex(c => c.col === col && c.row === row)
        if (idx !== -1) arr.splice(idx, 1)
      })
      this._main[row][col] = null
    }

    if (house !== null) {
      this._main[row][col] = house
      // Register this house as a crossover in each of its crossover tiles.
      house.variant.crossoverTiles.forEach(cTile => {
        this._crossovers[cTile.row][cTile.col].push({ row, col, ...house })
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
        this._style.type === value.type)
    )
      return
    this._style = value

    this.level.graphics.clear() // Clear any previous hover highlight

    if (value === null) {
      this.level.input.setDefaultCursor("pointer")
      return
    }

    const { type, ...tile } = value
    if (type === "rotate") {
      this.level.highlightTile(tile, 0xffff00)
      this.level.input.setDefaultCursor(this.rotateCursor)
    } else {
      this.level.highlightTile(tile, type === "add" ? 0x00ff00 : 0xff0000)
      this.level.input.setDefaultCursor("pointer")
    }
  }

  private get type() {
    // TODO: select the house type from the toolbox.
    return layers.objectGroup.objects.endpoints.house.common.orange
  }

  /** Checks if a house can be rotated at the given tile. */
  private canRotate = (house: House, variants: Variant[]) => {
    return variants.some(({ key }) => key !== house.variant.key)
  }

  /** Adds a house variant to the given tile. */
  private add(tile: Tile, variant: Variant) {
    // Add the house object to the endpoints layer.
    const obj = this.level.addObject(
      "ObjectGroup.ENDPOINTS",
      // TODO: fix the +1 offset so the house is centered on the tile.
      this.type[variant.key]({ col: tile.col + 1, row: tile.row + 1 }),
    )

    // Occupy the tile and any crossover tiles for the house variant.
    const house: House = { obj, variant }
    this.houses(tile, house)
    return house
  }

  /** Clears the house from the tracking arrays and destroys its Phaser object. */
  private delete(tile: Tile, { obj }: House) {
    this.houses(tile, null)
    this.level.destroyObject("ObjectGroup.ENDPOINTS", obj)
  }

  /** Rotates the house at the given tile to the next available variant. */
  private rotate(tile: Tile, house: House, variants: Variant[]) {
    this.delete(tile, house)

    let variantIndex = variants.findIndex(v => v.key === house.variant.key)
    // Current variant is no longer valid, so reset to first.
    if (variantIndex === -1 || ++variantIndex >= variants.length)
      variantIndex = 0

    return this.add(tile, variants[variantIndex])
  }

  /**
   * Returns the house variants for a given road ID.
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
  private roadIdToVariantKeys(roadId: layers.tile.data.RoadID): VariantKey[] {
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
    // No road tile means no house can be placed, so skip.
    return []
  }

  /** Returns the tiles that a house variant crosses over into. */
  private variantKeyToCrossoverTiles(
    tile: Tile,
    variantKey: VariantKey,
  ): Tile[] {
    const step = (dirs: Direction[]) => {
      const destination = this.level.moveFromTile(tile, dirs)
      return destination ? [destination] : []
    }

    // Precompute the neighbouring tiles in each direction.
    const left = step(["left"])
    const right = step(["right"])
    const top = step(["top"])
    const bottom = step(["bottom"])
    const topRight = step(["top", "right"])
    const topLeft = step(["top", "left"])
    const bottomRight = step(["bottom", "right"])
    const bottomLeft = step(["bottom", "left"])

    // Return the crossover tiles based on the house variant.
    if (variantKey === "top") return bottom
    if (variantKey === "bottom") return top
    if (variantKey === "left") return right
    if (variantKey === "right") return left
    if (variantKey === "inTopLeft") return [...bottom, ...right, ...bottomRight]
    if (variantKey === "inTopRight") return [...bottom, ...left, ...bottomLeft]
    if (variantKey === "inBottomLeft") return [...top, ...right, ...topRight]
    if (variantKey === "inBottomRight") return [...top, ...left, ...topLeft]

    return [] // No crossover tiles for variant.
  }

  /**
   * Returns the house variants that can be placed on a given tile.
   *
   * @param excludeHouse - A house already placed at `tile` that should be
   * ignored during collision checks (used when rotating, so the current house
   * does not block its own replacement variants).
   */
  private variants(
    tile: Tile,
    {
      roadId = this.level.road.dirsToId(this.level.road.dirs(tile)),
      exclude,
    }: Partial<{
      roadId?: layers.tile.data.RoadID
      exclude?: Tile
    }> = {},
  ): Variant[] {
    return (
      this.roadIdToVariantKeys(roadId)
        // Map each variant key to its crossover tiles.
        .map(variantKey => ({
          key: variantKey,
          crossoverTiles: this.variantKeyToCrossoverTiles(tile, variantKey),
        }))
        // Filter out variants where the main tile or any crossover tile is
        // already occupied by a colliding house.
        // - A `House` entry (main tile of another house) always blocks.
        // - A `House[]` entry (non-colliding crossovers) blocks only if
        //   variantCollisions() says the new key conflicts with one of them.
        .filter(({ key, crossoverTiles }) =>
          // Check the main tile and every crossover tile of the candidate variant.
          [tile, ...crossoverTiles].every(cTile => {
            const main = this._main[cTile.row][cTile.col]
            const crossovers = this._crossovers[cTile.row][cTile.col]

            // If another house has its main tile here, check whether the new
            // variant actually conflicts with it (not all overlaps are collisions).
            if (
              main !== null &&
              !(
                exclude &&
                cTile.col === exclude.col &&
                cTile.row === exclude.row
              ) &&
              // Ask from the new variant's perspective: placing `key` at `tile`
              // with a crossover at `cTile` — does that conflict with `main`?
              this.variantCollisions(cTile, {
                ...tile,
                variant: { key, crossoverTiles: [] },
              } as unknown as Crossover).includes(main.variant.key)
            )
              return false

            // Crossovers at this tile block only if they collide with the key.
            return crossovers.every(
              c =>
                (exclude && c.col === exclude.col && c.row === exclude.row) ||
                !this.variantCollisions(cTile, c).includes(key),
            )
          }),
        )
    )
  }

  /** Returns the colliding variant keys for a tile that a house occupies. */
  private variantCollisions(tile: Tile, crossover: Crossover): VariantKey[] {
    const {
      left = [],
      right = [],
      top = [],
      bottom = [],
      topLeft = [],
      topRight = [],
      bottomLeft = [],
      bottomRight = [],
    } = this._variantCollisions[crossover.variant.key]

    const isDirections = (dirs: Direction[]) => {
      const newTile = this.level.moveFromTile(crossover, dirs)
      return newTile && newTile.col === tile.col && newTile.row === tile.row
    }

    if (isDirections(["left"])) return left
    if (isDirections(["right"])) return right
    if (isDirections(["top"])) return top
    if (isDirections(["bottom"])) return bottom
    if (isDirections(["top", "left"])) return topLeft
    if (isDirections(["top", "right"])) return topRight
    if (isDirections(["bottom", "left"])) return bottomLeft
    if (isDirections(["bottom", "right"])) return bottomRight
    return []
  }

  /** Handles the addition of a road on the map. */
  private onAddRoad({ id, ...tile }: AddRoadEventData) {
    const house = this.houses(tile)
    if (!house) return

    const variants = this.variants(tile, { roadId: id, exclude: tile })
    if (variants.length === 0) this.delete(tile, house)
    else if (variants.every(({ key }) => key !== house.variant.key)) {
      this.delete(tile, house)
      this.add(tile, variants[0])
    }
  }

  /** Handles the deletion of a road on the map. */
  private onDeleteRoad = (tile: DeleteRoadEventData) => {
    const house = this.houses(tile)
    if (house) this.delete(tile, house)
  }

  private onPointer(
    pointer: Phaser.Input.Pointer,
    handle: (
      tool: "add-house" | "delete-house",
      tile: Tile,
      house: House | null,
    ) => Style["type"] | undefined,
  ) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house" && tool !== "delete-house") return
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return
    const house = this.houses(tile)
    const style = handle(tool, tile, house)
    this.style = style ? { ...tile, type: style } : null
  }

  private onPointerDown = (pointer: Phaser.Input.Pointer) =>
    this.onPointer(pointer, (tool, tile, house) => {
      if (tool === "add-house") {
        if (!house) {
          let variants = this.variants(tile)
          if (variants.length === 0) return
          house = this.add(tile, variants[0])
          variants = this.variants(tile, { exclude: tile })
          if (this.canRotate(house, variants)) return "rotate"
        } else {
          const variants = this.variants(tile, { exclude: tile })
          if (!this.canRotate(house, variants)) return
          this.rotate(tile, house, variants)
          return "rotate"
        }
      } else if (house) this.delete(tile, house)
    })

  private onPointerMove = (pointer: Phaser.Input.Pointer) =>
    this.onPointer(pointer, (tool, tile, house) => {
      if (tool === "add-house") {
        if (!house) {
          const roadDirs = this.level.road.dirs(tile)
          return roadDirs.size > 0 ? "add" : undefined
        }
        const variants = this.variants(tile, { exclude: tile })
        if (this.canRotate(house, variants)) return "rotate"
      } else if (house) return "delete"
    })
}
