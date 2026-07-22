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

  /** The delete button shown next to the active object. */
  private deleteButton: Phaser.GameObjects.Container

  constructor(level: Level) {
    super(level)

    const deleteIcon = this.level.add.image(0, 0, "delete-icon")
    const deleteRadius = deleteIcon.displayHeight / 2 + 4
    const deleteColor = 0xff0000
    const deleteBg = this.level.add.circle(0, 0, deleteRadius, deleteColor)
    this.deleteButton = this.level.add
      .container(0, 0, [deleteBg, deleteIcon])
      .setDepth(1)
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, deleteRadius),
        (shape: Phaser.Geom.Circle, px: number, py: number) =>
          Phaser.Geom.Circle.Contains(shape, px, py),
      )
      .on(Phaser.Input.Events.POINTER_OVER, () =>
        deleteBg.setFillStyle(0xc0392b),
      )
      .on(Phaser.Input.Events.POINTER_OUT, () =>
        deleteBg.setFillStyle(deleteColor),
      )
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.selectedObject) this.delete(this.selectedObject)
      })
      .setVisible(false)

    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    level.game.events.on(Events.ADD_ROAD, onAddRoad)

    const onSetToolbox = () => this.onSetToolbox()
    level.game.events.on(Events.SET_TOOLBOX, onSetToolbox)

    // Phaser fires the scene-level POINTER_DOWN with currentlyOver BEFORE the
    // individual game-object POINTER_DOWN events, so we can inspect what is
    // under the cursor here without needing a separate flag.
    const onPointerDown = (
      pointer: Phaser.Input.Pointer,
      currentlyOver: Phaser.GameObjects.GameObject[],
    ) => this.onPointerDown(pointer, currentlyOver)
    level.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove = (pointer: Phaser.Input.Pointer) =>
      this.onPointerMove(pointer)
    level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
      level.game.events.off(Events.SET_TOOLBOX, onSetToolbox)
      level.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
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

  private add(
    worldX: number,
    worldY: number,
    id: sceneryTilesets.ID,
  ): Phaser.GameObjects.Image | null {
    if (this.objects.length >= this.maxObjectCount) return null

    const factory = sceneryObjects.FACTORIES[id]
    if (!factory) return null

    const obj = this.level
      .addObject("ObjectGroup.SCENERY", factory({ x: 0, y: 0 }))
      .setInteractive({ cursor: "grab" })
      .setOrigin(0.5, 0.5)
      .setPosition(worldX, worldY)
      .on(Phaser.Input.Events.DRAG_START, () => {
        this.level.input.setDefaultCursor("grabbing")
        obj.setScale(1.1)
        this.deselect()
      })
      .on(
        Phaser.Input.Events.DRAG,
        (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          obj.x = dragX
          obj.y = dragY
        },
      )
      .on(Phaser.Input.Events.DRAG_END, () => {
        this.level.input.setDefaultCursor("default")
        obj.setScale(1)
      })
      .on(Phaser.Input.Events.POINTER_UP, () => this.select(obj))

    this.level.input.setDraggable(obj)

    return obj
  }

  private delete(obj: Phaser.GameObjects.Image) {
    if (this.selectedObject === obj) this.deselect()
    this.level.destroyObject("ObjectGroup.SCENERY", obj)
  }

  private select(obj: Phaser.GameObjects.Image) {
    if (this.level.toolbox?.box !== "scenery" || this.selectedObject === obj)
      return
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

  private onPointerDown(
    pointer: Phaser.Input.Pointer,
    currentlyOver: Phaser.GameObjects.GameObject[],
  ) {
    const toolbox = this.level.toolbox
    if (toolbox?.box !== "scenery") return

    // Clicking on any existing interactive object (scenery, delete button, …):
    // let the individual object's events handle it.
    if (currentlyOver.length > 0) return

    // Clicking on empty space: deselect and place a new object.
    this.deselect()
    this.add(pointer.worldX, pointer.worldY, toolbox.tool)
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {}

  /** When a road is added, delete any overlapping scenery objects. */
  private onAddRoad({ col, row }: AddRoadEventData) {
    const tile = this.level.tileToBounds({ col, row })
    if (!tile) return

    for (const obj of [...this.objects]) {
      if (this.level.objectOverlapsTile(obj, tile)) this.delete(obj)
    }
  }

  private onSetToolbox() {
    if (this.level.toolbox?.box !== "scenery") this.deselect()
  }
}
