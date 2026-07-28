import Phaser from "phaser"

import * as objects from "../../../layers/objectGroup/objects"
import type * as sceneryTilesets from "../../../tilesets/scenery"
import type { AddEndpointEventData } from "./EndpointManager"
import type { AddRoadEventData } from "./RoadManager"
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"
import type { default as Level } from "."

export default class extends BaseManager {
  /** The maximum number of scenery objects that can be added to the level. */
  private readonly maxLength = 50

  /** The currently selected scenery object. */
  private selectedObject: Phaser.GameObjects.Image | null = null

  /** The starting position of the currently dragged scenery object. */
  private dragStart: { x: number; y: number } | null = null

  /** The semi-transparent preview image. */
  private ghost: {
    object: Phaser.GameObjects.Image
    id: sceneryTilesets.ID
  } | null = null

  /** The delete button shown next to the active object. */
  private deleteButton: Phaser.GameObjects.FloatingActionButton

  constructor(level: Level) {
    super(level)
    this.deleteButton = this.createDeleteButton(level)
    this.registerEventListeners(level)
  }

  private createDeleteButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.Listeners.GameObjectPointerUp =
      pointer => {
        if (this.selectedObject) this.delete(this.selectedObject)
        this.handleGhost(pointer)
      }

    return add
      .fab(0, 0, "delete-icon", 0xff0000, 0xc0392b)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      .setVisible(false)
  }

  private registerEventListeners({ game, input, events }: Level) {
    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    game.events.on(Events.ADD_ROAD, onAddRoad)

    const onAddEndpoint = (data: AddEndpointEventData) =>
      this.onAddEndpoint(data)
    game.events.on(Events.ADD_ENDPOINT, onAddEndpoint)

    const onSetToolbox = () => this.onSetToolbox()
    game.events.on(Events.SET_TOOLBOX, onSetToolbox)

    // Phaser fires the scene-level POINTER_DOWN with currentlyOver BEFORE the
    // individual game-object POINTER_DOWN events, so we can inspect what is
    // under the cursor here without needing a separate flag.
    const onPointerDown: Phaser.Input.Events.Listeners.PointerDown<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerDown(...args)
    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.Listeners.PointerMove<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerMove(...args)
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onGameOut: Phaser.Input.Events.Listeners.GameOut = (...args) =>
      this.onGameOut(...args)
    input.on(Phaser.Input.Events.GAME_OUT, onGameOut)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.ADD_ROAD, onAddRoad)
      game.events.off(Events.ADD_ENDPOINT, onAddEndpoint)
      game.events.off(Events.SET_TOOLBOX, onSetToolbox)
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

  /** Returns the bounding rectangle of an object at the coordinates. */
  private bounds(obj: Phaser.GameObjects.Image, x: number, y: number) {
    return new Phaser.Geom.Rectangle(
      x - obj.displayWidth / 2,
      y - obj.displayHeight / 2,
      obj.displayWidth,
      obj.displayHeight,
    )
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

  private overlapsScenery(
    obj: Phaser.GameObjects.Image,
    scenery: Phaser.GameObjects.Image,
    bounds = obj.getBounds(),
  ) {
        if (scenery === obj) return false

        const sceneryBounds = scenery.getBounds()

      // This object overlaps another object if...
    return (
        // ...its centre overlaps the other's bounds or...
      sceneryBounds.contains(bounds.centerX, bounds.centerY) ||
        // ...its bounds overlap the other's bounds and...
          (Phaser.Geom.Rectangle.Overlaps(bounds, sceneryBounds) &&
          // ...both are below ground or...
          ((obj.depth === objects.Depths.BELOW_GROUND &&
              scenery.depth === objects.Depths.BELOW_GROUND) ||
            // ...one is below ground and the other is on ground.
            (obj.depth === objects.Depths.BELOW_GROUND &&
                scenery.depth === objects.Depths.GROUND) ||
            (obj.depth === objects.Depths.GROUND &&
                scenery.depth === objects.Depths.BELOW_GROUND)))
    )
  }

  private overlapsObject(obj: Phaser.GameObjects.Image): boolean
  private overlapsObject(
    obj: Phaser.GameObjects.Image,
    x: number,
    y: number,
  ): boolean
  /** Check if the object at the coordinates overlaps any other object. */
  private overlapsObject(obj: Phaser.GameObjects.Image, x = obj.x, y = obj.y) {
    const bounds = this.bounds(obj, x, y)

    return (
      // Check if the object overlaps any other scenery object.
      this.scenery.some(s => this.overlapsScenery(obj, s, bounds)) ||
      // Check if the object overlaps any endpoint object.
      this.endpoints.some(e => this.overlapsEndpoint(obj, e, bounds))
    )
  }

  /** Check if the world coordinates and dimensions overlap a road tile. */
  private overlapsRoad(obj: Phaser.GameObjects.Image, x: number, y: number) {
    const isOverRoad = (x: number, y: number): boolean => {
      const tile = this.level.worldToTile(x, y)
      if (!tile) return false
      return this.level.road.dirsToId(this.level.road.dirs(tile)) !== 0
    }

    const { left, right, top, bottom } = this.bounds(obj, x, y)

    return (
      isOverRoad(left, top) ||
      isOverRoad(right, top) ||
      isOverRoad(left, bottom) ||
      isOverRoad(right, bottom)
    )
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

    const onDragStart: Phaser.Input.Events.Listeners.GameObjectDragStart = () =>
      this.startDrag(obj)

    const onDrag: Phaser.Input.Events.Listeners.GameObjectDrag = (
      _,
      dragX,
      dragY,
    ) => this.dragTo(obj, dragX, dragY)

    const onDragEnd: Phaser.Input.Events.Listeners.GameObjectDragEnd = () =>
      this.endDrag(obj)

    const onPointerOver: Phaser.Input.Events.Listeners.GameObjectPointerOver =
      () => {
        if (!this.tool || this.dragStart) return
        this.level.input.setDefaultCursor("grab")
      }

    const onPointerOut: Phaser.Input.Events.Listeners.GameObjectPointerOut =
      () => {
        if (!this.tool || this.dragStart) return
        this.level.input.setDefaultCursor("default")
      }

    const onPointerUp: Phaser.Input.Events.Listeners.GameObjectPointerUp =
      () => {
        if (!this.tool) return
        this.select(obj)
      }

    obj = obj
      .on(Phaser.Input.Events.DRAG_START, onDragStart)
      .on(Phaser.Input.Events.DRAG, onDrag)
      .on(Phaser.Input.Events.DRAG_END, onDragEnd)
      .on(Phaser.Input.Events.POINTER_OVER, onPointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, onPointerOut)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    this.level.input.setDraggable(obj)

    return obj
  }

  private delete(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) this.deselect()
    this.level.destroyObject("ObjectGroup.SCENERY", obj)
  }

  /** Begin dragging the given scenery object from its current position. */
  private startDrag(obj: Phaser.GameObjects.Image) {
    this.dragStart = { x: obj.x, y: obj.y }
    this.level.input.setDefaultCursor("grabbing")
    obj.setScale(1.1)
    this.deselect()
  }

  /**
   * Move the dragged object to the given position, snapping back to where the
   * drag started if the position is invalid.
   */
  private dragTo(obj: Phaser.GameObjects.Image, dragX: number, dragY: number) {
    const [x, y, cursor] =
      this.overlapsObject(obj, dragX, dragY) ||
      this.overlapsRoad(obj, dragX, dragY)
        ? [this.dragStart!.x, this.dragStart!.y, "not-allowed"]
        : [dragX, dragY, "grabbing"]

    obj.setPosition(x, y)
    this.level.input.setDefaultCursor(cursor)
  }

  /** Stop dragging the given scenery object. */
  private endDrag(obj: Phaser.GameObjects.Image) {
    this.dragStart = null
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
    this.startDrag(obj)

    const onPointerMove: Phaser.Input.Events.Listeners.PointerMove<
      Phaser.GameObjects.Image
    > = pointer => this.dragTo(obj, pointer.worldX, pointer.worldY)

    const onPointerUp: Phaser.Input.Events.Listeners.PointerUp<
      Phaser.GameObjects.Image
    > = () => {
      this.endDrag(obj)
      this.level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      this.level.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
    }

    this.level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    this.level.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  private select(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) return
    this.deselect()
    this.selectedObject = obj
    obj.setTint(0xaaddff)

    this.deleteButton
      .setPosition(
        obj.x + obj.displayWidth / 2 + this.deleteButton.radius,
        obj.y - obj.displayHeight / 2 - this.deleteButton.radius,
      )
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
      object: this.level.add
        .image(0, 0, tileset.name)
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
    if (!pointer || currentlyOver.length > 0 || this.dragStart) {
      this.ghost.object.setVisible(false)
      return
    }

    // Indirectly over an existing object or road tile.
    if (
      this.overlapsObject(this.ghost.object, pointer.worldX, pointer.worldY) ||
      this.overlapsRoad(this.ghost.object, pointer.worldX, pointer.worldY)
    ) {
      this.ghost.object.setVisible(false)
      this.level.input.setDefaultCursor("not-allowed")
      return
    }

    this.ghost.object
      .setPosition(pointer.worldX, pointer.worldY)
      .setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  private destroyGhost() {
    this.ghost?.object.destroy()
    this.ghost = null
  }

  private onPointerDown: Phaser.Input.Events.Listeners.PointerDown<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      const tool = this.tool
      if (!tool) return

      // Clicking on any existing interactive object (scenery, delete button, …):
      // let the individual object's events handle it.
      if (currentlyOver.length > 0) return

      // Only place if the ghost is visible, meaning the position is valid.
      if (!this.ghost?.object.visible) return

      this.deselect()
      const obj = this.add(pointer.worldX, pointer.worldY, tool)

      // Seamlessly continue into a drag if the pointer is still held down.
      if (obj && pointer.isDown) this.dragNewObject(obj)
    }

  private onPointerMove: Phaser.Input.Events.Listeners.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (!this.tool) return
      this.handleGhost(pointer, currentlyOver)
    }

  /** Handle the pointer leaving the game canvas. */
  private onGameOut: Phaser.Input.Events.Listeners.GameOut = () => {
    if (!this.tool) return
    this.handleGhost()
    }

  /** When a road is added, delete any overlapping scenery objects. */
  private onAddRoad({ col, row }: AddRoadEventData) {
    const tile = this.level.tileToBounds({ col, row })
    if (!tile) return

    for (const obj of [...this.scenery]) {
      if (this.level.objectOverlapsTile(obj, tile)) this.delete(obj)
    }
  }

  private onAddEndpoint({ obj: endpoint }: AddEndpointEventData) {
    for (const obj of [...this.scenery]) {
      if (this.overlapsEndpoint(obj, endpoint)) this.delete(obj)
    }
  }

  private onSetToolbox() {
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
