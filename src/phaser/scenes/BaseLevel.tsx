import Phaser from "phaser"

import type * as images from "../images"
import * as layers from "../layers"
import BaseScene from "./BaseScene"
import { Events } from "../globals"

const ZOOM_STEP = 0.125
const MIN_ZOOM = 1 - ZOOM_STEP * 2
const MAX_ZOOM = 1 + ZOOM_STEP * 8

export interface BaseLevelData {
  background: (typeof images.URLs.Background)[keyof typeof images.URLs.Background]
  tilesets: Record<layers.tile.Name, Array<{ name: string }>> &
    Record<layers.objectGroup.Name, Array<{ name: string; gid: number }>>
}

export default class BaseLevel<
  Data extends BaseLevelData = BaseLevelData,
> extends BaseScene<Data> {
  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTileSprite!: Phaser.GameObjects.TileSprite
  tilesets: Record<layers.Name, Phaser.Tilemaps.Tileset[]> = {
    "Tile.ROAD": [],
    "Tile.ENVIRONMENT": [],
    "ObjectGroup.SCENERY": [],
    "ObjectGroup.ENDPOINTS": [],
  }
  layers: Record<
    layers.tile.Name,
    Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  > &
    Record<layers.objectGroup.Name, Phaser.GameObjects.GameObject[]> = {
    "Tile.ROAD": null as unknown as Phaser.Tilemaps.TilemapLayer,
    "Tile.ENVIRONMENT": null as unknown as Phaser.Tilemaps.TilemapLayer,
    "ObjectGroup.SCENERY": null as unknown as Phaser.GameObjects.Image[],
    "ObjectGroup.ENDPOINTS": null as unknown as Phaser.GameObjects.Image[],

  create() {
    this.createTilemap()

    const zoomIn = () => this.zoom(ZOOM_STEP)
    this.game.events.on(Events.ZOOM_IN, zoomIn)

    const zoomOut = () => this.zoom(-ZOOM_STEP)
    this.game.events.on(Events.ZOOM_OUT, zoomOut)

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.ZOOM_IN, zoomIn)
      this.game.events.off(Events.ZOOM_OUT, zoomOut)
    })
  }

  /**
  /** Creates the background tile sprite. */
  private createBackgroundTileSprite() {
    this.backgroundTileSprite = this.add.tileSprite(
      ...this.tilemapCenter,
      this.scale.width * 1.5,
      this.scale.height * 1.5,
      this.initData.background,
    )
    this.backgroundTileSprite
      .setOrigin(0.5, 0.5)
      // Shift the tile pattern so it aligns with world (0, 0). The sprite's
      // top-left corner is at (widthInPixels/2 - spriteW/2, ...) in world
      // space. If that position isn't a multiple of tileWidth/tileHeight, the
      // repeating pattern will be offset relative to the tilemap layer.
      .setTilePosition(
        (((this.backgroundTileSprite.x - this.backgroundTileSprite.width / 2) %
          this.tilemap.tileWidth) +
          this.tilemap.tileWidth) %
          this.tilemap.tileWidth,
        (((this.backgroundTileSprite.y - this.backgroundTileSprite.height / 2) %
          this.tilemap.tileHeight) +
          this.tilemap.tileHeight) %
          this.tilemap.tileHeight,
      )
      .setDepth(-1) // Render behind everything
  }

  /** Creates a tile layer for the specified layer name. */
  private createTileLayer(layer: layers.tile.Name) {
    this.tilesets[layer] = this.initData.tilesets[layer].map(
      ({ name }) => this.tilemap.addTilesetImage(name)!,
    )
    this.layers[layer] = this.tilemap.createLayer(layer, this.tilesets[layer])
  }

  /** Creates an object group layer for the specified layer name. */
  private createObjectGroupLayer(layer: layers.objectGroup.Name) {
    this.layers[layer] = this.tilemap
      .createFromObjects(
        layer,
        this.initData.tilesets[layer].map(({ name: key, gid }) => ({
          key,
          gid,
          classType: Phaser.GameObjects.Image,
        })),
      )
      .map(obj => {
        const image = obj as Phaser.GameObjects.Image
        return image.setDepth(
          layers.objectGroup.objects.getDepth(
            image.name as layers.objectGroup.objects.Name,
          ),
        )
      })
  }

  /** Returns the center coordinates of the tilemap as [x, y]. */
  get tilemapCenter(): [number, number] {
    return [this.tilemap.widthInPixels / 2, this.tilemap.heightInPixels / 2]
  }

  /**
   * Creates the tilemap for the level using the specified key and tileset
   * names.The tilemap is the main structure that holds all the layers and
   * objects in the level. This method ensures that the layers and objects are
   * created in the correct order for proper rendering.
   */
  createTilemap() {
    // 1. Create a tilemap from the cached tilemap data.
    this.tilemap = this.make.tilemap({ key: "level" })

    // 2. Render a tile sprite behind everything as the background.
    this.createBackgroundTileSprite()

    // 3. The road layer is created, on top of the background layer.
    this.createTileLayer("Tile.ROAD")

    // 4. The environment layer is created, on top of the road layer.
    this.createTileLayer("Tile.ENVIRONMENT")

    // 5. The endpoint objects are created, on top of the environment layer.
    this.createObjectGroupLayer("ObjectGroup.ENDPOINTS")

    // 6. The scenery objects are created, on top of all layers.
    this.createObjectGroupLayer("ObjectGroup.SCENERY")

    // 7. Center the camera on the tilemap.
    this.cameras.main.centerOn(...this.tilemapCenter)
  }

  putTileAt(
    layerName: layers.tile.Name,
    id: layers.tile.data.ID,
    col: number,
    row: number,
  ) {
    const { index, flipX, flipY, rotation } = layers.tile.data.decode(id)

    const tile = this.layers[layerName].putTileAt(index, col, row)
    tile.flipX = flipX
    tile.flipY = flipY
    tile.rotation = rotation

    return tile
  }

  addObject<
    N extends layers.objectGroup.objects.Name,
    GID extends layers.objectGroup.objects.ID,
  >(
    layerName: layers.objectGroup.Name,
    obj: Omit<layers.objectGroup.objects.FactoryObject<N, GID>, "id">,
  ): Phaser.GameObjects.Image {
    const tileset = this.initData.tilesets[layerName].find(
      ({ gid }) => gid === obj.gid,
    )
    if (!tileset) throw new Error(`No tileset found for GID ${obj.gid}`)

    const frame = this.textures.get(tileset.name).get()

    const image = this.add
      .image(
        // Tiled tile object x,y is the bottom-left corner; origin (0,1)
        // matches createFromObjects so rotation pivots around the same point.
        obj.x,
        obj.y,
        tileset.name,
      )
      .setOrigin(0, 1)
      .setDisplaySize(frame.realWidth, frame.realHeight)
      .setAngle(obj.rotation)
      .setVisible(obj.visible)
      .setDepth(layers.objectGroup.objects.getDepth(obj.gid))

    this.layers[layerName].push(image)
    return image
  }

  destroyObject(
    layerName: layers.objectGroup.Name,
    obj: Phaser.GameObjects.Image,
  ) {
    const layer = this.layers[layerName]
    const index = layer.indexOf(obj)
    if (index === -1) throw new Error("Object not found in layer")
    layer.splice(index, 1)
    obj.destroy()
  }

  zoom(step = ZOOM_STEP) {
    this.cameras.main.zoom = Phaser.Math.Clamp(
      this.cameras.main.zoom + step,
      MIN_ZOOM,
      MAX_ZOOM,
    )
  }
}
