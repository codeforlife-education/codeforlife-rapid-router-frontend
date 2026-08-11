import Phaser from "phaser"

import * as layers from "../../../layers"
import type * as tilesets from "../../../tilesets"
import BaseRoadObjectManager, { type Placed } from "./BaseRoadObjectManager"
import { Events } from "../../../globals"
import type { default as Level } from "."

type VariantKey = keyof layers.objectGroup.objects.StraightRotationVariants

export default class extends BaseRoadObjectManager<
  layers.objectGroup.objects.obstacles.Name,
  tilesets.obstacles.ID,
  VariantKey
> {
  /**
   * Persistent 2D array [row][col] of all placed obstacles.
   * `null` means no obstacle has been placed at that position.
   */
  private readonly _obstacles: (Placed<
    tilesets.obstacles.ID,
    VariantKey
  > | null)[][] = Array.from({ length: this.level.tilemap.height }, () =>
    Array.from({ length: this.level.tilemap.width }, () => null),
  )

  constructor(level: Level) {
    super(level)

    this.registerEventListeners(level)
  }

  private registerEventListeners({ game, events }: Level) {
    const onDeleteRoad: Phaser.Events.DeleteRoad = (...args) =>
      this.onDeleteRoad(...args)
    game.events.on(Events.DELETE_ROAD, onDeleteRoad)

    const onAddEndpoint: Phaser.Events.AddEndpoint = (...args) =>
      this.onAddEndpoint(...args)
    game.events.on(Events.ADD_ENDPOINT, onAddEndpoint)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.DELETE_ROAD, onDeleteRoad)
      game.events.off(Events.ADD_ENDPOINT, onAddEndpoint)
    })
  }

  protected get tool() {
    return this.level.toolbox?.box === "obstacles"
      ? this.level.toolbox.tool
      : null
  }

  protected getFactory(id: tilesets.obstacles.ID, variantKey: VariantKey) {
    const factory = layers.objectGroup.objects.getFactory<
      layers.objectGroup.objects.obstacles.Name,
      tilesets.obstacles.ID,
      VariantKey
    >(id)

    if (factory) return factory[variantKey]
  }

  private roadId(tile: Phaser.Types.Tilemaps.Tile) {
    return this.level.road.dirsToId(this.level.road.dirs(tile))
  }

  /**
   * Returns the facing variant keys that are valid for the given road shape.
   * Straight/dead-end roads only allow facing along their own axis; turns,
   * T-junctions, and crossroads allow any of the 4 cardinal facings.
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
    const roadIds = this.level.road.ids
    // Dead end
    if (roadId === roadIds.DeadEnd.LEFT) return ["left"]
    if (roadId === roadIds.DeadEnd.RIGHT) return ["right"]
    if (roadId === roadIds.DeadEnd.TOP) return ["top"]
    if (roadId === roadIds.DeadEnd.BOTTOM) return ["bottom"]
    // Straight
    if (roadId === roadIds.Straight.HORIZONTAL) return ["left", "right"]
    if (roadId === roadIds.Straight.VERTICAL) return ["top", "bottom"]
    // Turn
    if (roadId === roadIds.Turn.TOP_LEFT) return ["left", "top"]
    if (roadId === roadIds.Turn.TOP_RIGHT) return ["top", "right"]
    if (roadId === roadIds.Turn.BOTTOM_LEFT) return ["left", "bottom"]
    if (roadId === roadIds.Turn.BOTTOM_RIGHT) return ["right", "bottom"]
    // T-junction
    if (roadId === roadIds.TJunction.LEFT_RIGHT_BOTTOM)
      return ["left", "right", "bottom"]
    if (roadId === roadIds.TJunction.TOP_LEFT_BOTTOM)
      return ["left", "top", "bottom"]
    if (roadId === roadIds.TJunction.TOP_LEFT_RIGHT)
      return ["left", "top", "right"]
    if (roadId === roadIds.TJunction.TOP_RIGHT_BOTTOM)
      return ["top", "right", "bottom"]
    // Crossroads
    if (roadId === roadIds.CROSSROADS) return ["left", "top", "right", "bottom"]

    return []
  }

  protected validVariantKeys(tile: Phaser.Types.Tilemaps.Tile) {
    return this.roadIdToVariantKeys(this.roadId(tile))
  }

  /**
   * Checks if an obstacle can be placed on the given tile: it must be a road
   * tile, have no endpoint on it, and have no obstacle on it already.
   */
  protected canPlace(tile: Phaser.Types.Tilemaps.Tile): boolean {
    return (
      this.level.road.dirs(tile).size > 0 &&
      !this.level.endpoint.isOccupied(tile) &&
      this._obstacles[tile.row][tile.col] === null
    )
  }

  protected getPlaced(tile: Phaser.Types.Tilemaps.Tile) {
    return this._obstacles[tile.row][tile.col]
  }

  protected place(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.obstacles.ID,
    variantKey: VariantKey,
  ) {
    const factory = this.getFactory(id, variantKey)
    if (!factory) return

    const obj = this.level.addObject("ObjectGroup.OBSTACLES", factory(tile))
    this._obstacles[tile.row][tile.col] = { id, variantKey, obj }
  }

  protected remove(tile: Phaser.Types.Tilemaps.Tile) {
    const obstacle = this._obstacles[tile.row][tile.col]
    if (!obstacle) return

    if (this.selected && this.sameTile(this.selected, tile)) this.deselect()
    this._obstacles[tile.row][tile.col] = null
    this.level.destroyObject("ObjectGroup.OBSTACLES", obstacle.obj)
  }

  /** When a road tile is deleted, delete any obstacle placed on it too. */
  private onDeleteRoad: Phaser.Events.DeleteRoad = tile => {
    if (this._obstacles[tile.row][tile.col] !== null) this.remove(tile)
  }

  /**
   * When an endpoint is added, delete any obstacle on its main tile or any of
   * its crossover tiles.
   */
  private onAddEndpoint: Phaser.Events.AddEndpoint = ({
    col,
    row,
    variant,
  }) => {
    for (const tile of [{ col, row }, ...variant.crossoverTiles]) {
      if (this._obstacles[tile.row][tile.col] !== null) this.remove(tile)
    }
  }
}
