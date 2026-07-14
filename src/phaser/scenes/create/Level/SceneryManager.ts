import Phaser from "phaser"

import * as images from "../../../images"
import * as scenery from "../../../layers/objectGroup/objects/scenery"
import type { AddRoadEventData } from "./RoadManager"
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"
import type { default as Level } from "."

type WorldXY = { x: number; y: number }

export default class extends BaseManager {
  /** The maximum number of scenery objects that can be added to the level. */
  private readonly maxObjectCount = 100

  /** The current number of scenery objects added to the level. */
  private objectCount = 0

  private readonly trashcan: {
    base: Phaser.GameObjects.Image
    lid: { open: Phaser.GameObjects.Image; closed: Phaser.GameObjects.Image }
  }

  /** The array of scenery objects currently added to the level. */
  // private readonly objects: Phaser.GameObjects.Image[] = []

  constructor(level: Level) {
    super(level)

    const addTrashcanImage = (url: string, tileOffsetRow: number) =>
      this.level.add.image(
        this.level.tilemap.tileWidth * (this.level.tilemap.width - 0.5),
        this.level.tilemap.tileHeight *
          (this.level.tilemap.height + tileOffsetRow),
        url,
      )

    this.trashcan = {
      base: addTrashcanImage(images.URLs.HUD.Trashcan.TRASHCAN, 0.8),
      lid: {
        open: addTrashcanImage(
          images.URLs.HUD.Trashcan.Lid.OPEN,
          0.4,
        ).setVisible(false),
        closed: addTrashcanImage(images.URLs.HUD.Trashcan.Lid.CLOSED, 0.475),
      },
    }

    const onAddRoad = (data: AddRoadEventData) => this.onAddRoad(data)
    level.game.events.on(Events.ADD_ROAD, onAddRoad)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
    })

    // TODO: delete
    this.add({
      x: this.level.tilemap.tileToWorldX(5)!,
      y: this.level.tilemap.tileToWorldY(5)!,
    })
  }

  private get factory() {
    const theme: keyof typeof scenery = "common"
    const factory: keyof typeof scenery.common | keyof typeof scenery.snow =
      "bush"
    return scenery[theme][factory]
  }

  private add(worldXY: WorldXY) {
    if (this.objectCount >= this.maxObjectCount) return null
    this.objectCount++

    const objectSpec = this.factory(worldXY)

    // Shift the origin to the centre so scale changes during drag are symmetric
    // and the object lands exactly where the player releases it.
    objectSpec.x += objectSpec.width / 2
    objectSpec.y -= objectSpec.height / 2

    const obj = this.level
      .addObject("ObjectGroup.SCENERY", objectSpec)
      .setInteractive({ cursor: "grab" })
      .setOrigin(0.5, 0.5)
      .on(Phaser.Input.Events.DRAG_START, () => this.onDragStart(obj))
      .on(
        Phaser.Input.Events.DRAG,
        (_: Phaser.Input.Pointer, dragX: number, dragY: number) =>
          this.onDrag(dragX, dragY, obj),
      )
      .on(Phaser.Input.Events.DRAG_END, () => this.onDragEnd(obj))

    this.level.input.setDraggable(obj)

    return obj
  }

  private delete(obj: Phaser.GameObjects.Image) {
    if (this.objectCount > 0) this.objectCount--
    this.level.destroyObject("ObjectGroup.SCENERY", obj)
  }

  private onAddRoad({ id, ...tile }: AddRoadEventData) {
    // TODO: delete overlapping scenery objects.
  }

  private onDragStart(obj: Phaser.GameObjects.Image) {
    this.level.input.setDefaultCursor("grabbing")
    obj.setScale(1.05) // Slightly enlarge to show it is being dragged.
  }

  private onDrag(dragX: number, dragY: number, obj: Phaser.GameObjects.Image) {
    obj.x = dragX
    obj.y = dragY
  }

  private onDragEnd(obj: Phaser.GameObjects.Image) {
    // Reset global cursor (automatically set to 'grab' over the object).
    this.level.input.setDefaultCursor("default")
    obj.setScale(1) // Reset the scale when dragging ends.
  }
}
