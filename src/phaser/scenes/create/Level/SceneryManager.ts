import Phaser from "phaser"

import * as layers from "../../../layers"
import * as objects from "../../../layers/objectGroup/objects"
import type * as sceneryTilesets from "../../../tilesets/scenery"
import { Events, Variables } from "../../../globals"
import BaseManager from "./BaseManager"
import type { default as Level } from "."

type Drag = {
  obj: Phaser.GameObjects.Image
  start: { x: number; y: number }
  listeners: { on: () => void; off: () => void }
}

export default class extends BaseManager {
  /** The maximum number of scenery objects that can be added to the level. */
  private readonly maxLength = 50

  /** The currently selected scenery object. */
  private selectedObject: Phaser.GameObjects.Image | null = null

  /** The currently dragged scenery object. */
  private drag: Drag | null = null

  /** The semi-transparent preview image. */
  private ghost: {
    obj: Phaser.GameObjects.Image
    id: sceneryTilesets.ID
  } | null = null

  /** The delete button shown next to the active object. */
  private deleteButton: Phaser.GameObjects.FloatingActionButton

  constructor(level: Level) {
    super(level)

    level.setVariable("sceneryObjectCount", this.scenery.length)
    level.setVariable("maxSceneryObjectCount", this.maxLength)

    this.deleteButton = this.createDeleteButton(level)
    this.registerEventListeners(level)
  }

  private createDeleteButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = pointer => {
      if (this.selectedObject) this.delete(this.selectedObject)
      this.handleGhost(pointer)
    }

    return add
      .fab(0, 0, "delete-icon", 0xff0000, 0xc0392b)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      .setVisible(false)
  }

  private registerEventListeners({ game, input, events }: Level) {
    const onAddRoad: Phaser.Events.AddRoad = (...args) =>
      this.onAddRoad(...args)
    game.events.on(Events.ADD_ROAD, onAddRoad)

    const onAddEndpoint: Phaser.Events.AddEndpoint = (...args) =>
      this.onAddEndpoint(...args)
    game.events.on(Events.ADD_ENDPOINT, onAddEndpoint)

    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)

    // Phaser fires the scene-level POINTER_DOWN with currentlyOver BEFORE the
    // individual game-object POINTER_DOWN events, so we can inspect what is
    // under the cursor here without needing a separate flag.
    const onPointerDown: Phaser.Input.Events.PointerDown<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerDown(...args)
    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerMove(...args)
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onGameOut: Phaser.Input.Events.GameOut = (...args) =>
      this.onGameOut(...args)
    input.on(Phaser.Input.Events.GAME_OUT, onGameOut)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.ADD_ROAD, onAddRoad)
      game.events.off(Events.ADD_ENDPOINT, onAddEndpoint)
      game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      input.off(Phaser.Input.Events.GAME_OUT, onGameOut)
    })
  }

  private get scenery() {
    return this.level.layers["ObjectGroup.SCENERY"]
  }

  private get endpoints() {
    return this.level.layers["ObjectGroup.ENDPOINTS"]
  }

  private get tool() {
    return this.level.toolbox?.box === "scenery"
      ? this.level.toolbox.tool
      : null
  }

  private overlapsEndpoint(
    obj: Phaser.GameObjects.Image,
    endpoint: Phaser.GameObjects.Image,
    bounds = obj.getBounds(),
  ) {
    return (
      obj !== endpoint &&
      Phaser.Geom.Rectangle.Overlaps(bounds, endpoint.getBounds())
    )
  }

  /**
   * Check if an object overlaps another scenery object. Returns:
   * - `true` if the objects are not allowed to overlap.
   * - `false` if the objects are allowed to overlap.
   */
  private overlapsScenery(
    obj: Phaser.GameObjects.Image,
    scenery: Phaser.GameObjects.Image,
    bounds = obj.getBounds(),
  ) {
    if (scenery === obj) return false

    const sceneryBounds = scenery.getBounds()

    // The centre of one object can never be inside the bounds of another.
    if (sceneryBounds.contains(bounds.centerX, bounds.centerY)) return true

    // The bounds of the objects don't overlap - no need for further checks.
    if (!Phaser.Geom.Rectangle.Overlaps(bounds, sceneryBounds)) return false

    // 2 objects that are both below ground can't overlap.
    if (
      obj.depth === objects.Depths.BELOW_GROUND &&
      scenery.depth === objects.Depths.BELOW_GROUND
    )
      return true

    // A solid object can't overlap another object unless one is above ground
    // and the other is below ground.
    if (
      (objects.getDensity(obj.name as objects.Name) ===
        objects.Densities.SOLID ||
        objects.getDensity(scenery.name as objects.Name) ===
          objects.Densities.SOLID) &&
      !(
        (obj.depth === objects.Depths.BELOW_GROUND &&
          scenery.depth === objects.Depths.ABOVE_GROUND) ||
        (obj.depth === objects.Depths.ABOVE_GROUND &&
          scenery.depth === objects.Depths.BELOW_GROUND)
      )
    )
      return true

    return false // The objects are allowed to overlap.
  }

  private overlapsObject(obj: Phaser.GameObjects.Image): boolean
  private overlapsObject(
    obj: Phaser.GameObjects.Image,
    x: number,
    y: number,
  ): boolean
  /** Check if the object at the coordinates overlaps any other object. */
  private overlapsObject(obj: Phaser.GameObjects.Image, x = obj.x, y = obj.y) {
    const bounds = obj.getRelativeBounds(x, y)

    return (
      // Check if the object overlaps any other scenery object.
      this.scenery.some(s => this.overlapsScenery(obj, s, bounds)) ||
      // Check if the object overlaps any endpoint object.
      this.endpoints.some(e => this.overlapsEndpoint(obj, e, bounds))
    )
  }

  /** Check if the world coordinates and dimensions overlap a road tile. */
  private overlapsRoad(obj: Phaser.GameObjects.Image, x: number, y: number) {
    const bounds = obj.getRelativeBounds(x, y)

    const tiles = this.level.tilemap.getTilesWithinWorldXY(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      { isNotEmpty: true },
      undefined,
      layers.Names.Tile.ROAD,
    )

    return !!tiles && tiles.length > 0
  }

  private add(
    worldX: number,
    worldY: number,
    id: sceneryTilesets.ID,
  ): Phaser.GameObjects.Image | null {
    if (this.scenery.length >= this.maxLength) return null

    const factory = objects.getFactory(id)
    if (!factory) return null

    let obj = this.level
      .addObject("ObjectGroup.SCENERY", factory({ x: 0, y: 0 }))
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .setPosition(worldX, worldY)

    this.level.setVariable("sceneryObjectCount", this.scenery.length)

    const onDragStart: Phaser.Input.Events.GameObjectDragStart = () =>
      this.startDrag(obj, {
        on: () => {
          obj
            .on(Phaser.Input.Events.DRAG, onDrag)
            .on(Phaser.Input.Events.DRAG_END, onDragEnd)
        },
        off: () => {
          obj
            .off(Phaser.Input.Events.DRAG, onDrag)
            .off(Phaser.Input.Events.DRAG_END, onDragEnd)
        },
      })

    const onDrag: Phaser.Input.Events.GameObjectDrag = (_, dragX, dragY) =>
      this.dragTo(obj, dragX, dragY)

    const onDragEnd: Phaser.Input.Events.GameObjectDragEnd = () =>
      this.endDrag(obj)

    const onPointerOver: Phaser.Input.Events.GameObjectPointerOver = () => {
      if (!this.tool || this.drag) return
      this.level.input.setDefaultCursor("grab")
    }

    const onPointerOut: Phaser.Input.Events.GameObjectPointerOut = () => {
      if (!this.tool || this.drag) return
      this.level.input.setDefaultCursor("default")
    }

    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      if (!this.tool) return
      this.select(obj)
    }

    obj = obj
      .on(Phaser.Input.Events.DRAG_START, onDragStart)
      .on(Phaser.Input.Events.POINTER_OVER, onPointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, onPointerOut)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    this.level.input.setDraggable(obj)

    return obj
  }

  private delete(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) this.deselect()
    this.level.destroyObject("ObjectGroup.SCENERY", obj)
    this.level.setVariable("sceneryObjectCount", this.scenery.length)
  }

  /** Begin dragging the given scenery object from its current position. */
  private startDrag(
    obj: Phaser.GameObjects.Image,
    listeners: Drag["listeners"],
  ) {
    this.drag = { obj, start: { x: obj.x, y: obj.y }, listeners }
    this.level.input.setDefaultCursor("grabbing")
    obj.setScale(1.1)
    this.deselect()
    listeners.on()
  }

  /**
   * Move the dragged object to the given position, snapping back to where the
   * drag started if the position is invalid.
   */
  private dragTo(obj: Phaser.GameObjects.Image, dragX: number, dragY: number) {
    if (!this.drag) return

    const [x, y, cursor] =
      this.overlapsObject(obj, dragX, dragY) ||
      this.overlapsRoad(obj, dragX, dragY)
        ? [this.drag.start.x, this.drag.start.y, "not-allowed"]
        : [dragX, dragY, "grabbing"]

    obj.setPosition(x, y)
    this.level.input.setDefaultCursor(cursor)
  }

  /** Stop dragging the given scenery object. */
  private endDrag(obj: Phaser.GameObjects.Image) {
    if (!this.drag) return

    this.drag.listeners.off()
    this.drag = null
    this.level.input.setDefaultCursor("grab")
    obj.setScale(1)
  }

  /**
   * Phaser only starts its own drag tracking for objects that were already
   * interactive when the pointer went down, so a just-placed object won't be
   * picked up automatically. If the pointer is still held after placing an
   * object, drive the same drag behaviour manually until it's released.
   */
  private dragNewObject(obj: Phaser.GameObjects.Image) {
    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = pointer => this.dragTo(obj, pointer.worldX, pointer.worldY)

    const onPointerUp: Phaser.Input.Events.PointerUp<
      Phaser.GameObjects.Image
    > = () => this.endDrag(obj)

    this.startDrag(obj, {
      on: () => {
        this.level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
        this.level.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      },
      off: () => {
        this.level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
        this.level.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      },
    })
  }

  private select(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) return
    this.deselect()
    this.selectedObject = obj
    obj.setTint(0xaaddff)

    const { x, y } = obj.getTopRight()
    this.deleteButton
      .setPosition(x + this.deleteButton.radius, y - this.deleteButton.radius)
      .setVisible(true)
  }

  private deselect() {
    if (!this.selectedObject) return
    this.selectedObject.clearTint()
    this.selectedObject = null

    this.deleteButton.setVisible(false)
  }

  private createGhost(id: sceneryTilesets.ID) {
    if (this.ghost?.id === id) return
    this.destroyGhost()

    const factory = objects.getFactory(id)
    if (!factory) return

    const obj = factory({ x: 0, y: 0 })
    const tileset = this.level.initData.tilesets["ObjectGroup.SCENERY"].find(
      ({ gid }) => gid === obj.gid,
    )
    if (!tileset) return

    const frame = this.level.textures.get(tileset.name).get()

    this.ghost = {
      id,
      obj: this.level.add
        .image(0, 0, tileset.name)
        .setName(obj.name)
        .setOrigin(0.5, 0.5)
        .setDisplaySize(frame.realWidth, frame.realHeight)
        .setAlpha(0.5)
        .setDepth(objects.getDepth(id))
        .setVisible(false),
    }
  }

  private handleGhost(
    pointer?: Phaser.Input.Pointer,
    currentlyOver: Phaser.GameObjects.Image[] = pointer
      ? (this.level.input.hitTestPointer(pointer) as Phaser.GameObjects.Image[])
      : [],
  ) {
    if (!this.ghost) return

    // Directly over an existing object or dragging an object.
    if (!pointer || currentlyOver.length > 0 || this.drag) {
      this.ghost.obj.setVisible(false)
      return
    }

    // Indirectly over an existing object or road tile.
    if (
      this.scenery.length >= this.maxLength ||
      this.overlapsObject(this.ghost.obj, pointer.worldX, pointer.worldY) ||
      this.overlapsRoad(this.ghost.obj, pointer.worldX, pointer.worldY)
    ) {
      this.ghost.obj.setVisible(false)
      this.level.input.setDefaultCursor("not-allowed")
      return
    }

    this.ghost.obj.setPosition(pointer.worldX, pointer.worldY).setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  private destroyGhost() {
    this.ghost?.obj.destroy()
    this.ghost = null
  }

  private onPointerDown: Phaser.Input.Events.PointerDown<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      const tool = this.tool
      if (!tool) return

      // Clicking on any existing interactive object (scenery, delete button, …):
      // let the individual object's events handle it.
      if (currentlyOver.length > 0) return

      // Only place if the ghost is visible, meaning the position is valid.
      if (!this.ghost?.obj.visible) return

      this.deselect()
      const obj = this.add(pointer.worldX, pointer.worldY, tool)

      // Seamlessly continue into a drag if the pointer is still held down.
      if (obj && pointer.isDown) this.dragNewObject(obj)
    }

  private onPointerMove: Phaser.Input.Events.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (!this.tool) return
      this.handleGhost(pointer, currentlyOver)
    }

  /** Handle the pointer leaving the game canvas. */
  private onGameOut: Phaser.Input.Events.GameOut = () => {
    if (!this.tool) return
    if (this.ghost) this.handleGhost()
    if (this.selectedObject) this.deselect()
    if (this.drag) this.endDrag(this.drag.obj)
  }

  /** When a road is added, delete any overlapping scenery objects. */
  private onAddRoad: Phaser.Events.AddRoad = ({ col, row }) => {
    const tile = this.level.tileToBounds({ col, row })
    if (!tile) return

    for (const obj of [...this.scenery]) {
      if (this.level.objectOverlapsTile(obj, tile)) this.delete(obj)
    }
  }

  private onAddEndpoint: Phaser.Events.AddEndpoint = ({ obj: endpoint }) => {
    for (const obj of [...this.scenery]) {
      if (this.overlapsEndpoint(obj, endpoint)) this.delete(obj)
    }
  }

  private onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
    if (key !== Variables.TOOLBOX) return

    let draggable = true

    const tool = this.tool
    if (tool) this.createGhost(tool)
    else {
      this.deselect()
      this.destroyGhost()
      draggable = false
    }

    // Enable or disable dragging for all scenery objects.
    this.level.input.setDraggable(this.scenery, draggable)
  }
}
