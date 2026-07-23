import Phaser from "phaser"

import * as sceneryObjects from "../../../layers/objectGroup/objects/scenery"
import type * as sceneryTilesets from "../../../tilesets/scenery"
import type { AddRoadEventData } from "./RoadManager"
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"
import type { default as Level } from "."

export default class extends BaseManager {
  /** The maximum number of scenery objects that can be added to the level. */
  private readonly maxObjectCount = 50

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
  private deleteButton: Phaser.GameObjects.Container

  constructor(level: Level) {
    super(level)
    this.deleteButton = this.createDeleteButton(level)
    this.registerEventListeners(level)
  }

  private createDeleteButton({ add }: Level) {
    const deleteIcon = add.image(0, 0, "delete-icon")
    const deleteRadius = deleteIcon.displayHeight / 2 + 4
    const deleteColor = 0xff0000
    const deleteBg = add.circle(0, 0, deleteRadius, deleteColor)

    const onPointerOver: Phaser.Input.Events.Listeners.GameObjectPointerOver =
      () => deleteBg.setFillStyle(0xc0392b)

    const onPointerOut: Phaser.Input.Events.Listeners.GameObjectPointerOut =
      () => deleteBg.setFillStyle(deleteColor)

    const onPointerUp: Phaser.Input.Events.Listeners.GameObjectPointerUp =
      () => {
        if (this.selectedObject) this.delete(this.selectedObject)
      }

    return add
      .container(0, 0, [deleteBg, deleteIcon])
      .setDepth(1)
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, deleteRadius),
        (shape: Phaser.Geom.Circle, px: number, py: number) =>
          Phaser.Geom.Circle.Contains(shape, px, py),
      )
      .on(Phaser.Input.Events.POINTER_OVER, onPointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, onPointerOut)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      .setVisible(false)
  }

  private registerEventListeners({ game, input, events }: Level) {
    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    game.events.on(Events.ADD_ROAD, onAddRoad)

    const onSetToolbox = () => this.onSetToolbox()
    game.events.on(Events.SET_TOOLBOX, onSetToolbox)

    // Phaser fires the scene-level POINTER_DOWN with currentlyOver BEFORE the
    // individual game-object POINTER_DOWN events, so we can inspect what is
    // under the cursor here without needing a separate flag.
    const onPointerDown: Phaser.Input.Events.Listeners.PointerDown<
      Phaser.GameObjects.Image
    > = (pointer, currentlyOver) => this.onPointerDown(pointer, currentlyOver)
    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.Listeners.PointerMove<
      Phaser.GameObjects.Image
    > = (pointer, currentlyOver) => this.onPointerMove(pointer, currentlyOver)
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.ADD_ROAD, onAddRoad)
      game.events.off(Events.SET_TOOLBOX, onSetToolbox)
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    })
  }

  private get objects() {
    return this.level.layers[
      "ObjectGroup.SCENERY"
    ] as Phaser.GameObjects.Image[]
  }

  private get deleteButtonBackground(): Phaser.GameObjects.Arc {
    return this.deleteButton.getAt(0)
  }

  private get deleteButtonRadius(): number {
    return this.deleteButtonBackground.displayWidth / 2
  }

  private get tool() {
    return this.level.toolbox?.box === "scenery"
      ? this.level.toolbox.tool
      : null
  }

  /** Returns the scenery objects whose bounds contain the given point. */
  private objectsAt(x: number, y: number) {
    return this.objects.filter(other => other.getBounds().contains(x, y))
  }

  /** Check if the world coordinates and dimensions overlap a road tile. */
  private overRoad(
    worldX: number,
    worldY: number,
    obj: Phaser.GameObjects.Image,
  ) {
    const isOverRoad = (worldX: number, worldY: number): boolean => {
      const tile = this.level.worldToTile(worldX, worldY)
      if (!tile) return false
      return this.level.road.dirsToId(this.level.road.dirs(tile)) !== 0
    }

    const { left, right, top, bottom } = new Phaser.Geom.Rectangle(
      worldX - obj.displayWidth / 2,
      worldY - obj.displayHeight / 2,
      obj.displayWidth,
      obj.displayHeight,
    )

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
    if (this.objects.length >= this.maxObjectCount) return null

    const factory = sceneryObjects.FACTORIES[id]
    if (!factory) return null

    let obj = this.level
      .addObject("ObjectGroup.SCENERY", factory({ x: 0, y: 0 }))
      .setInteractive({ cursor: "grab" })
      .setOrigin(0.5, 0.5)
      .setPosition(worldX, worldY)

    const onDragStart: Phaser.Input.Events.Listeners.GameObjectDragStart =
      () => {
        this.dragStart = { x: obj.x, y: obj.y }
        this.level.input.setDefaultCursor("grabbing")
        obj.setScale(1.1)
        this.deselect()
      }

    const onDrag: Phaser.Input.Events.Listeners.GameObjectDrag = (
      _,
      dragX,
      dragY,
    ) => {
      const overObject = this.objectsAt(dragX, dragY).some(
        other => other !== obj,
      )
      const overRoad = this.overRoad(dragX, dragY, obj)
      const [x, y, cursor] =
        overObject || overRoad
          ? [this.dragStart!.x, this.dragStart!.y, "not-allowed"]
          : [dragX, dragY, "grabbing"]
      obj.setPosition(x, y)
      this.level.input.setDefaultCursor(cursor)
    }

    const onDragEnd: Phaser.Input.Events.Listeners.GameObjectDragEnd = () => {
      this.dragStart = null
      this.level.input.setDefaultCursor("default")
      obj.setScale(1)
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
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    this.level.input.setDraggable(obj)

    return obj
  }

  private delete(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) this.deselect()
    this.level.destroyObject("ObjectGroup.SCENERY", obj)
  }

  private select(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) return
    this.deselect()
    this.selectedObject = obj
    obj.setTint(0xaaddff)

    this.deleteButton
      .setPosition(
        obj.x + obj.displayWidth / 2 + this.deleteButtonRadius,
        obj.y - obj.displayHeight / 2 - this.deleteButtonRadius,
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

    const factory = sceneryObjects.FACTORIES[id]
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
        .setDepth(2)
        .setVisible(false),
    }
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
      this.add(pointer.worldX, pointer.worldY, tool)
    }

  private onPointerMove: Phaser.Input.Events.Listeners.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (!this.tool || !this.ghost) return

      // Over an existing object or dragging an object.
      if (currentlyOver.length > 0 || this.dragStart) {
        this.ghost.object.setVisible(false)
        return
      }

      if (this.overRoad(pointer.worldX, pointer.worldY, this.ghost.object)) {
        this.ghost.object.setVisible(false)
        this.level.input.setDefaultCursor("not-allowed")
        return
      }

      this.ghost.object
        .setPosition(pointer.worldX, pointer.worldY)
        .setVisible(true)
      this.level.input.setDefaultCursor("grabbing")
    }

  /** When a road is added, delete any overlapping scenery objects. */
  private onAddRoad({ col, row }: AddRoadEventData) {
    const tile = this.level.tileToBounds({ col, row })
    if (!tile) return

    for (const obj of [...this.objects]) {
      if (this.level.objectOverlapsTile(obj, tile)) this.delete(obj)
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
    this.level.input.setDraggable(this.objects, draggable)
  }
}
