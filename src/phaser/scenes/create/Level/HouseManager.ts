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
type House = Tile & { obj: Phaser.GameObjects.Image; variant: Variant }
type Style = Tile & { type: "add" | "rotate" | "delete" }

export default class extends BaseManager {
  /**
   * Persistent 2D array [row][col] indicating if a house is occupying a tile.
   * - `null` means the tile is unoccupied.
   * - `House` means the tile is occupied by the 'main tile' of a house.
   * - `House[]` means the tile is occupied by one or more 'non-colliding
   *    crossover tiles' of a house. Each value points to the house that is
   *    crossing over into this tile.
   */
  private readonly _houses: (House | House[] | null)[][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => null),
  )

  /** CSS cursor string for the rotate-right icon, pre-computed once. */
  private readonly rotateCursor = this.level.muiIconToCursor(RotateRightIcon)

  /** The current style applied to the level. */
  private _style: Style | null = null

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

  /**
   * Get the house variant for a given tile.
   * If the tile is a crossover tile, returns the main house variant.
   */
  private houses(tile: Tile): House | House[] | null
  /**
   * Set the house variant for a given tile.
   * If the tile is already occupied by a house, it's main and crossover tiles
   * will first be removed before the new house is placed.
   */
  private houses(tile: Tile, house: Omit<House, keyof Tile> | null): void
  private houses({ row, col }: Tile, house?: Omit<House, keyof Tile> | null) {
    const currentValue = this._houses[row][col]
    if (house === undefined) return currentValue

    // Clear any currently occupied tiles.
    if (currentValue !== null) {
      ;(Array.isArray(currentValue) ? currentValue : [currentValue]).forEach(
        house => {
          // Clear the house's main tile.
          this._houses[house.row][house.col] = null
          // Remove the house from the crossover tiles.
          house.variant.crossoverTiles.forEach(cTile => {
            let value: House[] | null = null
            let houses = this._houses[cTile.row][cTile.col]
            if (Array.isArray(houses)) {
              houses = houses.filter(h => h !== house)
              if (houses.length > 0) value = houses
            }
            this._houses[cTile.row][cTile.col] = value
          })
        },
      )
    }

    let value: House | null = null
    if (house !== null) {
      value = { row, col, ...house }

      // Set the house's crossover tiles.
      value.variant.crossoverTiles.forEach(cTile => {
        let houses = this._houses[cTile.row][cTile.col]
        if (!Array.isArray(houses))
          this._houses[cTile.row][cTile.col] = houses = []
        houses.push(value!)
      })
    }

    // Set the new value (may be null or a main tile).
    this._houses[row][col] = value
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

  /** Checks if the given tile is the main tile of a house. */
  private isMainTile(tile: Tile, houses?: House | House[] | null) {
    houses = houses === undefined ? this.houses(tile) : houses
    return (
      houses !== null &&
      !Array.isArray(houses) &&
      houses.col === tile.col &&
      houses.row === tile.row
    )
  }

  /** Checks if a house can be added at the given tile. */
  private canAdd = (tile: Tile) =>
    !this.isMainTile(tile) && this.variants(tile).length > 0

  /** Checks if a house can be rotated at the given tile. */
  private canRotate = (tile: Tile) => {
    const house = this.houses(tile)
    return (
      house !== null &&
      !Array.isArray(house) &&
      this.variants(house, undefined, house).length >= 2
    )
  }

  /** Checks if a house can be deleted at the given tile. */
  private canDelete = (tile: Tile) => this.isMainTile(tile)

  /** Adds a house variant to the given tile. */
  private addVariant({
    variant,
    ...tile
  }: Pick<House, keyof Tile | "variant">) {
    // Add the house object to the endpoints layer.
    const obj = this.level.addObject(
      "ObjectGroup.ENDPOINTS",
      // TODO: fix the +1 offset so the house is centered on the tile.
      this.type[variant.key]({ col: tile.col + 1, row: tile.row + 1 }),
    )

    // Occupy the tile and any crossover tiles for the house variant.
    this.houses(tile, { obj, variant })
  }

  /** Adds a house to the given tile, using the first available variant. */
  private add(tile: Tile) {
    // Get the first available house variant for the tile.
    const variants = this.variants(tile)
    if (variants.length > 0) this.addVariant({ ...tile, variant: variants[0] })
  }

  /** Destroys the given house object. */
  private delete({ obj, ...tile }: Pick<House, keyof Tile | "obj">) {
    this.houses(tile, null)
    this.level.destroyObject("ObjectGroup.ENDPOINTS", obj)
  }

  /** Destroys the current house object and adds a new variant to the tile. */
  private deleteAndAddVariant(house: House) {
    this.delete(house)
    this.addVariant(house)
  }

  /** Rotates the house at the given tile to the next available variant. */
  private rotate(tile: Tile) {
    const house = this.houses(tile)
    if (!house || Array.isArray(house)) return

    // Exclude the current house so its own crossovers don't block other variants.
    const variants = this.variants(house, undefined, house)
    if (variants.length < 2) return // No other variants to rotate to.

    let variantIndex = variants.findIndex(v => v.key === house.variant.key)
    // Current variant is no longer valid, so reset to first.
    if (variantIndex === -1 || ++variantIndex >= variants.length)
      variantIndex = 0

    this.deleteAndAddVariant({ ...house, variant: variants[variantIndex] })
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
    roadId?: layers.tile.data.RoadID,
    excludeHouse?: House,
  ): Variant[] {
    roadId ??= this.level.road.dirsToId(this.level.road.dirs(tile))

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
          crossoverTiles.every(cTile => {
            const houses = this.houses(cTile)
            return (
              houses === null ||
              (Array.isArray(houses) &&
                houses.every(cHouse => {
                  if (
                    excludeHouse &&
                    cHouse.col === excludeHouse.col &&
                    cHouse.row === excludeHouse.row
                    //cHouse.variant.key === excludeHouse.variant.key
                  )
                    return true

                  const collisions = this.variantCollisions(cTile, cHouse)
                  // console.log({ cTile, cHouse, collisions, key })
                  return !collisions.includes(key)
                }))
            )
          }),
        )
    )
  }

  /** Returns the colliding variant keys for a tile that a house occupies. */
  private variantCollisions(tile: Tile, house: House): VariantKey[] {
    const isDirections = (dirs: Direction[]) => {
      const newTile = this.level.moveFromTile(house, dirs)
      return newTile && newTile.col === tile.col && newTile.row === tile.row
    }

    const collisions = ({
      left = [],
      right = [],
      top = [],
      bottom = [],
      topLeft = [],
      topRight = [],
      bottomLeft = [],
      bottomRight = [],
    }: {
      left?: VariantKey[]
      right?: VariantKey[]
      top?: VariantKey[]
      bottom?: VariantKey[]
      topLeft?: VariantKey[]
      topRight?: VariantKey[]
      bottomLeft?: VariantKey[]
      bottomRight?: VariantKey[]
    }): VariantKey[] => {
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

    const key = house.variant.key
    // Straight and dead-end variants.
    if (key === "left")
      return collisions({
        topRight: ["inTopRight"],
        right: [
          "right",
          "outTopRight",
          "outBottomRight",
          "inTopRight",
          "inBottomRight",
        ],
        bottomRight: ["inBottomRight"],
      })
    if (key === "top")
      return collisions({
        bottomLeft: ["inBottomLeft"],
        bottom: [
          "bottom",
          "outBottomLeft",
          "outBottomRight",
          "inBottomLeft",
          "inBottomRight",
        ],
        bottomRight: ["inBottomRight"],
      })
    if (key === "right")
      return collisions({
        topLeft: ["inTopLeft"],
        left: [
          "left",
          "outTopLeft",
          "outBottomLeft",
          "inTopLeft",
          "inBottomLeft",
        ],
        bottomLeft: ["inBottomLeft"],
      })
    if (key === "bottom")
      return collisions({
        topLeft: ["inTopLeft"],
        top: ["top", "outTopLeft", "outTopRight", "inTopLeft", "inTopRight"],
        topRight: ["inTopRight"],
      })
    // Inside-corner variants (turn and t-junction and crossroads).
    if (key === "inTopLeft")
      return collisions({
        bottom: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
        right: ["top", "right", "inTopRight", "outTopRight"],
        bottomRight: ["bottom", "right", "inBottomRight", "outBottomRight"],
      })
    if (key === "inTopRight")
      return collisions({
        bottom: ["bottom", "right", "inBottomRight", "outBottomRight"],
        left: ["top", "left", "inTopLeft", "outTopLeft"],
        bottomLeft: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
      })
    if (key === "inBottomLeft")
      return collisions({
        top: ["top", "left", "inTopLeft", "outTopLeft"],
        right: ["bottom", "right", "inBottomRight", "outBottomRight"],
        topRight: ["top", "right", "inTopRight", "outTopRight"],
      })
    if (key === "inBottomRight")
      return collisions({
        top: ["top", "right", "inTopRight", "outTopRight"],
        left: ["bottom", "left", "inBottomLeft", "outBottomLeft"],
        topLeft: ["top", "left", "inTopLeft", "outTopLeft"],
      })
    return []
  }

  /** Handles the addition of a road on the map. */
  private onAddRoad({ id: roadId, ...tile }: AddRoadEventData) {
    const house = this.houses(tile)
    if (!house || Array.isArray(house)) return

    const variants = this.variants(tile, roadId)
    if (variants.length === 0) this.delete(house)
    else if (variants.every(v => v.key !== house.variant.key)) {
      this.deleteAndAddVariant({ ...house, variant: variants[0] })
    }
  }

  /** Handles the deletion of a road on the map. */
  private onDeleteRoad(tile: DeleteRoadEventData) {
    // NOTE: `canDelete` asserts this is the main tile of a house.
    if (this.canDelete(tile)) this.delete(this.houses(tile) as House)
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house" && tool !== "delete-house") return

    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
    if (!tile) return

    if (tool === "add-house") {
      // Add a house if possible.
      let add = false
      if (this.canAdd(tile)) {
        this.add(tile)
        add = true
      }

      if (this.canRotate(tile)) {
        // Rotate the house if no house was added.
        if (!add) this.rotate(tile)
        // Set the style to indicate that the house can be rotated.
        this.style = { ...tile, type: "rotate" }
      } else this.style = null // Clear the style.
    } else if (this.canDelete(tile)) {
      // NOTE: `canDelete` asserts this is the main tile of a house.
      this.delete(this.houses(tile) as House)
      this.style = null // Clear the style.
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    const tool = this.level.toolbox?.activeTool
    if (tool !== "add-house" && tool !== "delete-house") return

    // Get the tile under the cursor (if in map).
    const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)

    // Set the style based on if the tile can be added, rotated, or neither.
    let style: Style | null = null
    if (tile) {
      if (tool === "add-house") {
        if (this.canAdd(tile)) style = { ...tile, type: "add" }
        else if (this.canRotate(tile)) style = { ...tile, type: "rotate" }
      } else {
        if (this.canDelete(tile)) style = { ...tile, type: "delete" }
      }
    }
    this.style = style
  }
}
