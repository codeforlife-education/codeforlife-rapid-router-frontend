import Phaser from "phaser"

import * as images from "../../../images"
import * as sceneryObjects from "../../../layers/objectGroup/objects/scenery"
import type * as sceneryTilesets from "../../../tilesets/scenery"
import type { AddRoadEventData } from "./RoadManager"
import BaseManager from "./BaseManager"
import { Events } from "../../../globals"
import type { default as Level } from "."

export default class extends BaseManager {
  /** The maximum number of scenery objects that can be added to the level. */
  private readonly maxObjectCount = 50

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

    const onPointerDown = (pointer: Phaser.Input.Pointer) =>
      this.onPointerDown(pointer)
    level.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.ADD_ROAD, onAddRoad)
      level.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
    })
  }

  // private factoryFor(name: SceneryFactoryName): SceneryFactory {
  //   return scenery.common[name]
  // }

  private add(
    worldX: number,
    worldY: number,
    id: sceneryTilesets.ID,
  ): Phaser.GameObjects.Image | null {
    if (this.objectCount >= this.maxObjectCount) return null
    this.objectCount++

    const factory = sceneryObjects.FACTORIES[id]
    if (!factory) return null

    const obj = this.level
      .addObject("ObjectGroup.SCENERY", factory({ x: worldX, y: worldY }))
      .setInteractive({ cursor: "grab" })
      .setOrigin(0.5, 0.5)
      .on(Phaser.Input.Events.DRAG_START, () => this.onDragStart(obj))
      .on(
        Phaser.Input.Events.DRAG,
        (_: Phaser.Input.Pointer, dragX: number, dragY: number) =>
          this.onDrag(dragX, dragY, obj),
      )
      .on(Phaser.Input.Events.DRAG_END, () => this.onDragEnd(obj))

    // Position the image so its visual centre lands exactly at centerXY.
    obj.setPosition(worldX, worldY)

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

  // private onAddScenery({ factory: name, x, y }: AddSceneryEventData) {
  //   // Convert canvas coordinates to world coordinates using the Level camera.
  //   const worldCenter = this.level.cameras.main.getWorldPoint(x, y)

  //   // Only place scenery within the tilemap bounds.
  //   const mapWidth = this.level.tilemap.widthInPixels
  //   const mapHeight = this.level.tilemap.heightInPixels
  //   if (
  //     worldCenter.x < 0 ||
  //     worldCenter.x > mapWidth ||
  //     worldCenter.y < 0 ||
  //     worldCenter.y > mapHeight
  //   )
  //     return

  //   this.add(worldCenter, this.factoryFor(name))
  // }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    const toolbox = this.level.toolbox
    if (toolbox?.box !== "scenery") return
    this.add(pointer.worldX, pointer.worldY, toolbox.tool)
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
