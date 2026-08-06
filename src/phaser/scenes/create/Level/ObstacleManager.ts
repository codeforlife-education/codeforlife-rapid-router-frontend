import Phaser from "phaser"

import * as layers from "../../../layers"
import * as tilesets from "../../../tilesets"
import { Events, Variables } from "../../../globals"
import BaseManager from "./BaseManager"
import type { default as Level } from "."

type VariantKey = keyof layers.objectGroup.objects.StraightRotationVariants

type ObstacleFactory = layers.objectGroup.objects.Factory<
  layers.objectGroup.objects.obstacles.Name,
  tilesets.obstacles.ID,
  layers.objectGroup.objects.StraightRotationVariants
>

type Obstacle = {
  id: tilesets.obstacles.ID
  variantKey: VariantKey
  obj: Phaser.GameObjects.Image
}

type Drag = {
  tile: Phaser.Types.Tilemaps.Tile
  id: tilesets.obstacles.ID
  /** Whether an obstacle already occupied this tile when the drag started. */
  hadExisting: boolean
  originalVariantKey: VariantKey
}

export default class extends BaseManager {
  /**
   * Persistent 2D array [row][col] of all placed obstacles.
   * `null` means no obstacle has been placed at that position.
   */
  private readonly _obstacles: (Obstacle | null)[][] = Array.from(
    { length: this.level.tilemap.height },
    () => Array.from({ length: this.level.tilemap.width }, () => null),
  )

  /** Maps each obstacle id to its object-group factory (with facing variants). */
  private readonly idToFactory: Record<tilesets.obstacles.ID, ObstacleFactory> =
    {
      [tilesets.IDs.Obstacles.Animal.COW]:
        layers.objectGroup.objects.obstacles.animal.cow,
      [tilesets.IDs.Obstacles.Animal.PIGEON]:
        layers.objectGroup.objects.obstacles.animal.pigeon,
      [tilesets.IDs.Obstacles.TrafficLight.RED]:
        layers.objectGroup.objects.obstacles.trafficLight.red,
      [tilesets.IDs.Obstacles.TrafficLight.GREEN]:
        layers.objectGroup.objects.obstacles.trafficLight.green,
    }

  /** The tile of the currently selected obstacle. */
  private selected: Phaser.Types.Tilemaps.Tile | null = null

  /** The tile, id, and original variant of the obstacle currently being dragged. */
  private drag: Drag | null = null

  /** The tile the ghost is currently snapped/positioned to. */
  private ghostTile: Phaser.Types.Tilemaps.Tile | null = null

  /** The variant key the ghost is currently showing. */
  private ghostVariantKey: VariantKey | null = null

  /** The semi-transparent preview image, also used while dragging. */
  private ghost: {
    id: tilesets.obstacles.ID
    obj: Phaser.GameObjects.Image
  } | null = null

  /** The delete button shown next to the selected obstacle. */
  private deleteButton: Phaser.GameObjects.FloatingActionButton

  constructor(level: Level) {
    super(level)

    this.deleteButton = this.createDeleteButton(level)
    this.registerEventListeners(level)
  }

  private createDeleteButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = pointer => {
      if (this.selected) this.delete(this.selected)
      this.handleGhost(pointer)
    }

    return add
      .fab(0, 0, "delete-icon", 0xff0000, 0xc0392b)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      .setVisible(false)
  }

  private registerEventListeners({ game, input, events }: Level) {
    const onDeleteRoad: Phaser.Events.DeleteRoad = (...args) =>
      this.onDeleteRoad(...args)
    game.events.on(Events.DELETE_ROAD, onDeleteRoad)

    const onAddEndpoint: Phaser.Events.AddEndpoint = (...args) =>
      this.onAddEndpoint(...args)
    game.events.on(Events.ADD_ENDPOINT, onAddEndpoint)

    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)

    const onPointerDown: Phaser.Input.Events.PointerDown<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerDown(...args)
    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerMove(...args)
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onPointerUp: Phaser.Input.Events.PointerUp = () => this.endDrag()
    input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    const onPointerUpOutside: Phaser.Input.Events.PointerUpOutside = () =>
      this.endDrag()
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUpOutside)

    const onGameOut: Phaser.Input.Events.GameOut = (...args) =>
      this.onGameOut(...args)
    input.on(Phaser.Input.Events.GAME_OUT, onGameOut)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.DELETE_ROAD, onDeleteRoad)
      game.events.off(Events.ADD_ENDPOINT, onAddEndpoint)
      game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUpOutside)
      input.off(Phaser.Input.Events.GAME_OUT, onGameOut)
    })
  }

  private get tool() {
    return this.level.toolbox?.box === "obstacles"
      ? this.level.toolbox.tool
      : null
  }

  private sameTile(
    a: Phaser.Types.Tilemaps.Tile,
    b: Phaser.Types.Tilemaps.Tile,
  ) {
    return a.row === b.row && a.col === b.col
  }

  private roadId(tile: Phaser.Types.Tilemaps.Tile) {
    return this.level.road.dirsToId(this.level.road.dirs(tile))
  }

  /**
   * Returns the facing variant keys that are valid for the given road shape.
   * Straight/dead-end roads only allow facing along their own axis; turns,
   * T-junctions, and crossroads allow any of the 4 cardinal facings.
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
    if (roadId === roadIds.Turn.TOP_LEFT) return ["top", "left"]
    if (roadId === roadIds.Turn.TOP_RIGHT) return ["top", "right"]
    if (roadId === roadIds.Turn.BOTTOM_LEFT) return ["bottom", "left"]
    if (roadId === roadIds.Turn.BOTTOM_RIGHT) return ["bottom", "right"]
    // T-junction
    if (roadId === roadIds.TJunction.LEFT_RIGHT_BOTTOM)
      return ["left", "right", "bottom"]
    if (roadId === roadIds.TJunction.TOP_LEFT_BOTTOM)
      return ["top", "left", "bottom"]
    if (roadId === roadIds.TJunction.TOP_LEFT_RIGHT)
      return ["top", "left", "right"]
    if (roadId === roadIds.TJunction.TOP_RIGHT_BOTTOM)
      return ["top", "right", "bottom"]
    // Crossroads
    if (roadId === roadIds.CROSSROADS) return ["top", "bottom", "left", "right"]

    return []
  }

  /**
   * Checks if an obstacle can be placed on the given tile: it must be a road
   * tile, have no endpoint on it, and have no obstacle on it already.
   */
  private canPlace(tile: Phaser.Types.Tilemaps.Tile): boolean {
    return (
      this.level.road.dirs(tile).size > 0 &&
      !this.level.endpoint.isOccupied(tile) &&
      this._obstacles[tile.row][tile.col] === null
    )
  }

  private add(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.obstacles.ID,
    variantKey: VariantKey,
  ) {
    const factory = this.idToFactory[id][variantKey]
    const obj = this.level.addObject("ObjectGroup.OBSTACLES", factory(tile))
    this._obstacles[tile.row][tile.col] = { id, variantKey, obj }
  }

  private delete(tile: Phaser.Types.Tilemaps.Tile) {
    const obstacle = this._obstacles[tile.row][tile.col]
    if (!obstacle) return

    if (this.selected && this.sameTile(this.selected, tile)) this.deselect()
    this._obstacles[tile.row][tile.col] = null
    this.level.destroyObject("ObjectGroup.OBSTACLES", obstacle.obj)
  }

  /**
   * Begin dragging the obstacle with the given id from the given tile. If an
   * obstacle already occupies the tile, it's temporarily removed until the
   * drag ends.
   */
  private startDrag(
    tile: Phaser.Types.Tilemaps.Tile,
    id: tilesets.obstacles.ID,
  ) {
    const existing = this._obstacles[tile.row][tile.col]
    const originalVariantKey = existing
      ? existing.variantKey
      : this.roadIdToVariantKeys(this.roadId(tile))[0]

    if (existing) this.delete(tile)

    this.deselect()
    this.drag = { tile, id, hadExisting: !!existing, originalVariantKey }
    this.createGhost(id)
    this.positionGhost(tile, originalVariantKey)
    this.ghost!.obj.setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  /**
   * Finalize the current drag. If the obstacle never left its original tile,
   * treat it as a click and rotate to the next valid facing; otherwise place
   * it at its final (possibly new) tile.
   */
  private endDrag() {
    if (!this.drag) return

    const { id, hadExisting, originalVariantKey } = this.drag
    const finalTile = this.ghostTile ?? this.drag.tile

    if (hadExisting && this.sameTile(finalTile, this.drag.tile)) {
      const validKeys = this.roadIdToVariantKeys(this.roadId(finalTile))
      let index = validKeys.indexOf(originalVariantKey)
      index = index === -1 || ++index >= validKeys.length ? 0 : index
      this.add(finalTile, id, validKeys[index])
    } else {
      this.add(finalTile, id, this.ghostVariantKey ?? originalVariantKey)
    }

    this.drag = null
    this.ghostTile = null
    this.ghostVariantKey = null
    this.ghost?.obj.setVisible(false)

    const tool = this.tool
    if (tool) this.createGhost(tool)
    else this.destroyGhost()

    this.select(finalTile)
    this.level.input.setDefaultCursor("pointer")
  }

  private select(tile: Phaser.Types.Tilemaps.Tile) {
    if (this.selected && this.sameTile(this.selected, tile)) return
    this.deselect()
    this.selected = tile

    this.level.graphics.clear()
    this.level.highlightTile(tile, 0xaaddff)

    const world = this.level.tileToWorld(tile)
    if (!world) return
    this.deleteButton
      .setPosition(
        world.x + this.level.tilemap.tileWidth + this.deleteButton.radius,
        world.y - this.deleteButton.radius,
      )
      .setVisible(true)
  }

  private deselect() {
    if (!this.selected) return
    this.selected = null
    this.level.graphics.clear()
    this.deleteButton.setVisible(false)
  }

  private createGhost(id: tilesets.obstacles.ID) {
    if (this.ghost?.id === id) return
    this.destroyGhost()

    this.ghost = {
      id,
      obj: this.level.add
        .imageFromTileset(0, 0, id)
        .setOrigin(0, 1)
        .setAlpha(0.5)
        .setVisible(false),
    }
  }

  /**
   * Position (and rotate) the ghost for the given tile, resolving the facing
   * variant from the tile's road shape. Keeps `preferredVariantKey` if it's
   * still valid there, otherwise falls back to the shape's default facing.
   */
  private positionGhost(
    tile: Phaser.Types.Tilemaps.Tile,
    preferredVariantKey?: VariantKey,
  ) {
    if (!this.ghost) return

    const validKeys = this.roadIdToVariantKeys(this.roadId(tile))
    const variantKey =
      preferredVariantKey && validKeys.includes(preferredVariantKey)
        ? preferredVariantKey
        : validKeys[0]

    const factoryObj = this.idToFactory[this.ghost.id][variantKey](tile)
    this.ghost.obj
      .setPosition(factoryObj.x, factoryObj.y)
      .setAngle(factoryObj.rotation)
    this.ghostTile = tile
    this.ghostVariantKey = variantKey
  }

  private destroyGhost() {
    this.ghost?.obj.destroy()
    this.ghost = null
    this.ghostTile = null
    this.ghostVariantKey = null
  }

  /** Show/hide and position the ghost based on the tile under the pointer. */
  private handleGhost(pointer?: Phaser.Input.Pointer) {
    if (!this.ghost) return

    const tile = pointer
      ? this.level.worldToTile(pointer.worldX, pointer.worldY)
      : null

    if (!tile || !this.canPlace(tile)) {
      this.ghost.obj.setVisible(false)
      this.ghostTile = null
      this.ghostVariantKey = null
      if (pointer)
        this.level.input.setDefaultCursor(tile ? "not-allowed" : "default")
      return
    }

    this.positionGhost(tile)
    this.ghost.obj.setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  private onPointerDown: Phaser.Input.Events.PointerDown<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      const tool = this.tool
      if (!tool) return

      // Clicking on any existing interactive object (e.g. the delete button):
      // let the individual object's events handle it.
      if (currentlyOver.length > 0) return

      const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
      if (!tile) return

      const existing = this._obstacles[tile.row][tile.col]
      if (existing !== null) this.startDrag(tile, existing.id)
      else if (this.ghost?.obj.visible) this.startDrag(tile, tool)
    }

  private onPointerMove: Phaser.Input.Events.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (!this.tool) return

      if (this.drag) {
        const nearest = this.level.worldToNearestTile(
          pointer.worldX,
          pointer.worldY,
        )
        const valid = !!nearest && this.canPlace(nearest)
        this.positionGhost(
          valid ? nearest : this.drag.tile,
          this.drag.originalVariantKey,
        )
        this.level.input.setDefaultCursor(valid ? "grabbing" : "not-allowed")
        return
      }

      // Directly over an existing interactive object (e.g. the delete button).
      if (currentlyOver.length > 0) {
        this.ghost?.obj.setVisible(false)
        return
      }

      this.handleGhost(pointer)
    }

  /** Handle the pointer leaving the game canvas. */
  private onGameOut: Phaser.Input.Events.GameOut = () => {
    if (!this.tool) return
    if (this.ghost) this.handleGhost()
    if (this.drag) this.endDrag()
    if (this.selected) this.deselect()
  }

  /** When a road tile is deleted, delete any obstacle placed on it too. */
  private onDeleteRoad: Phaser.Events.DeleteRoad = tile => {
    if (this._obstacles[tile.row][tile.col] !== null) this.delete(tile)
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
      if (this._obstacles[tile.row][tile.col] !== null) this.delete(tile)
    }
  }

  private onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
    if (key !== Variables.TOOLBOX) return

    const tool = this.tool
    if (tool) this.createGhost(tool)
    else {
      this.deselect()
      this.destroyGhost()
    }
  }
}
