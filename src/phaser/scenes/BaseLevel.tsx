import Phaser from "phaser"

import type * as images from "../images"
import * as layers from "../layers"
import type * as tilesets from "../tilesets"
import { Events, TEXTURE_RESOLUTION } from "../globals"
import BaseScene from "./BaseScene"
import { enableHiResTiles } from "../renderNodes"

const ZOOM_STEP = 0.125
const MIN_VISIBLE_TILES = 4
const MIN_ZOOM_MARGIN = 1.5

export interface BaseLevelData {
  backgroundKey: keyof typeof images.URLs.Background
  character: {
    normalKey: keyof typeof images.URLs.Character.Normal
    wreckageKey?: keyof typeof images.URLs.Character.Wreckage
  }
  tilesets: Record<layers.tile.Name, Array<Pick<tilesets.Tileset, "name">>> &
    Record<
      layers.objectGroup.Name,
      Array<Pick<tilesets.Tileset, "name"> & { gid: tilesets.ID }>
    >
}

export default class BaseLevel<
  Data extends BaseLevelData = BaseLevelData,
> extends BaseScene<Data> {
  tilemap!: Phaser.Tilemaps.Tilemap
  backgroundTileSprite!: Phaser.GameObjects.TileSprite
  characterSprite!: Phaser.GameObjects.CharacterSprite
  tilesets: Record<layers.Name, Phaser.Tilemaps.Tileset[]> = {
    "Tile.ROAD": [],
    "ObjectGroup.OBSTACLES": [],
    "ObjectGroup.SCENERY": [],
    "ObjectGroup.ENDPOINTS": [],
  }
  layers: Record<
    layers.tile.Name,
    Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer
  > &
    Record<layers.objectGroup.Name, Phaser.GameObjects.Image[]> = {
    "Tile.ROAD": null as unknown as Phaser.Tilemaps.TilemapLayer,
    "ObjectGroup.OBSTACLES": null as unknown as Phaser.GameObjects.Image[],
    "ObjectGroup.SCENERY": null as unknown as Phaser.GameObjects.Image[],
    "ObjectGroup.ENDPOINTS": null as unknown as Phaser.GameObjects.Image[],
  }

  create() {
    this.createTilemap()

    const zoomIn = () =>
      this.setZoomInBounds(this.cameras.main.zoom + ZOOM_STEP)
    this.game.events.on(Events.ZOOM_IN, zoomIn)

    const zoomOut = () =>
      this.setZoomInBounds(this.cameras.main.zoom - ZOOM_STEP)
    this.game.events.on(Events.ZOOM_OUT, zoomOut)

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.ZOOM_IN, zoomIn)
      this.game.events.off(Events.ZOOM_OUT, zoomOut)
    })

    // When the canvas is resized (e.g. a device is rotated or a panel is
    // resized), re-fit the zoom so the whole tilemap is visible again, grow/
    // shrink the background (and camera bounds) so it still fills the whole
    // canvas, and re-center the tilemap. This resets any zooming/panning the
    // player did, as it may no longer make sense at the new size.
    this.onResize(() => {
      this.setZoomInBounds()
      this.fitBackgroundTileSprite()
      this.cameras.main.centerOn(...this.tilemapCenter)
    })
  }

  /**
   * Lets the player pan around the level by dragging it (with a mouse, pen or
   * finger). The camera's bounds (see `fitBackgroundTileSprite`) stop them
   * panning past the edge of the background.
   */
  enableDragToPan() {
    const camera = this.cameras.main
    this.input.setDefaultCursor("grab")

    const onPointerDown = () => this.input.setDefaultCursor("grabbing")
    const onPointerUp = () => this.input.setDefaultCursor("grab")
    const onPointerMove = (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return
      // Pointer positions are in screen pixels, so convert them to world
      // units at the current zoom level.
      camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom
      camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom
    }

    this.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
    this.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)
    this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUp)
    this.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      this.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      this.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUp)
      this.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
    })
  }

  /** Creates the background tile sprite. */
  private createBackgroundTileSprite() {
    this.backgroundTileSprite = this.add
      .tileSprite(...this.tilemapCenter, 0, 0, this.initData.backgroundKey)
      .setOrigin(0.5, 0.5)
      // Its texture was rendered at TEXTURE_RESOLUTION (see `BasePreloader`),
      // so display each tile at the map's tile size.
      .setTileScale(1 / TEXTURE_RESOLUTION)
      .setDepth(-1) // Render behind everything

    this.setBackgroundTexture(this.initData.backgroundKey)
    this.fitBackgroundTileSprite()
  }

  /**
   * Sets the background's texture (which must already be loaded), disabling
   * its mipmaps. A tile sprite repeats its texture by wrapping its texture
   * coordinates in its shader, and that jump (from 1 back to 0) at the edge
   * of every tile makes the GPU pick the smallest mipmap there - drawing a
   * grid of thin lines across the background.
   */
  setBackgroundTexture(key: string) {
    this.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR)
    this.backgroundTileSprite.setTexture(key)
  }

  /**
   * Sizes the background to cover the tilemap plus half the camera's viewport
   * (once zoomed all the way out) on every side, and bounds the camera to it.
   * That way, no borders appear around the background at any zoom level, even
   * while panning (see `enableDragToPan`), and any part of the tilemap can
   * still be panned to the center of the view.
   */
  private fitBackgroundTileSprite() {
    const camera = this.cameras.main
    const { min: minZoom } = this.zoomBounds
    const padX = Math.ceil(camera.width / minZoom / 2)
    const padY = Math.ceil(camera.height / minZoom / 2)
    const width = this.tilemap.widthInPixels + padX * 2
    const height = this.tilemap.heightInPixels + padY * 2

    camera.setBounds(-padX, -padY, width, height)

    this.backgroundTileSprite
      .setSize(width, height)
      // Shift the tile pattern so it aligns with world (0, 0). The sprite's
      // top-left corner is at (widthInPixels/2 - spriteW/2, ...) in world
      // space. If that position isn't a multiple of tileWidth/tileHeight, the
      // repeating pattern will be offset relative to the tilemap layer. The
      // tile position is in texture pixels, so it's scaled up to match the
      // background's texture (see `createBackgroundTileSprite`).
      .setTilePosition(
        ((((this.backgroundTileSprite.x - this.backgroundTileSprite.width / 2) %
          this.tilemap.tileWidth) +
          this.tilemap.tileWidth) %
          this.tilemap.tileWidth) *
          TEXTURE_RESOLUTION,
        ((((this.backgroundTileSprite.y -
          this.backgroundTileSprite.height / 2) %
          this.tilemap.tileHeight) +
          this.tilemap.tileHeight) %
          this.tilemap.tileHeight) *
          TEXTURE_RESOLUTION,
      )
  }

  /** Creates a tile layer for the specified layer name. */
  /**
   * Stops the tilesets' textures repeating at their edges. Phaser makes
   * power-of-two textures (like the tiles', rendered at TEXTURE_RESOLUTION)
   * repeat, so when smoothly scaled, the pixels along each of their edges are
   * blended with those along the opposite edge - drawing faint lines along the
   * edges of tiles (e.g. a road's edge showing at the opposite side of a tile).
   */
  private clampTilesetTextures() {
    for (const { name } of Object.values(this.initData.tilesets).flat()) {
      this.textures.get(name).setWrap(Phaser.Textures.WrapMode.CLAMP_TO_EDGE)
    }
  }

  private createTileLayer(layer: layers.tile.Name) {
    // The tilesets' images were rendered at TEXTURE_RESOLUTION (see
    // `BasePreloader`), so their tiles are too.
    this.tilesets[layer] = this.initData.tilesets[layer].map(
      ({ name }) =>
        this.tilemap.addTilesetImage(
          name,
          undefined,
          this.tilemap.tileWidth * TEXTURE_RESOLUTION,
          this.tilemap.tileHeight * TEXTURE_RESOLUTION,
        )!,
    )
    this.layers[layer] = this.tilemap.createLayer(layer, this.tilesets[layer])
    // Display the tiles at the map's tile size.
    enableHiResTiles(this.layers[layer])
  }

  /** Creates an object group layer for the specified layer name. */
  private createObjectGroupLayer(layer: layers.objectGroup.Name) {
    const classType = Phaser.GameObjects.Image

    this.layers[layer] = (
      this.tilemap.createFromObjects(
        layer,
        this.initData.tilesets[layer].map(({ name, gid }) => ({
          key: name,
          gid,
          classType,
        })),
      ) as InstanceType<typeof classType>[]
    ).map(image => image.setRequiredProperties())
  }

  /** Creates the character sprite for the player. */
  private createCharacterSprite() {
    this.characterSprite = this.add.characterSprite(
      this.initData.character.wreckageKey
        ? [
            this.initData.character.normalKey,
            this.initData.character.wreckageKey,
          ]
        : this.initData.character.normalKey,
    )
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
    this.clampTilesetTextures()

    // 2. Render a tile sprite behind everything as the background.
    this.createBackgroundTileSprite()

    // 3. The road layer is created on top of the background layer.
    this.createTileLayer("Tile.ROAD")

    // 4. The obstacle objects are created on top of the road layer.
    this.createObjectGroupLayer("ObjectGroup.OBSTACLES")

    // 5. The endpoint objects are created on top of the road layer.
    this.createObjectGroupLayer("ObjectGroup.ENDPOINTS")

    // 6. The scenery objects are created. Their depths vary.
    this.createObjectGroupLayer("ObjectGroup.SCENERY")

    // 7. Create the character sprite on top of everything.
    this.createCharacterSprite()

    // 8. Center the camera on the tilemap.
    this.cameras.main.centerOn(...this.tilemapCenter)

    // 9. Default the zoom so the entire tilemap is visible.
    this.setZoomInBounds()
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
    obj: layers.objectGroup.objects.FactoryObject<N, GID>,
  ): Phaser.GameObjects.Image {
    const image = this.add
      .imageFromTileset(obj.x, obj.y, obj.gid)
      .asTiledObject(obj)
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

  /**
   * Returns the zoom level that fits the specified width and height within the
   * camera view. The zoom level is calculated based on the camera's dimensions
   * and the specified width and height. If no width and height are provided, it
   * defaults to the tilemap's size, ensuring that the entire tilemap is visible
   * within the camera view. The returned zoom level is rounded down to the
   * nearest multiple of ZOOM_STEP, and it will never be less than ZOOM_STEP.
   */
  private getZoom(
    width = this.tilemap.widthInPixels,
    height = this.tilemap.heightInPixels,
  ) {
    const camera = this.cameras.main
    const zoom = Math.min(camera.width / width, camera.height / height)
    // Rounds down to the nearest multiple of ZOOM_STEP, never going below it.
    return Math.max(Math.floor(zoom / ZOOM_STEP) * ZOOM_STEP, ZOOM_STEP)
  }

  /** Returns the min/max zoom levels, each a multiple of ZOOM_STEP. */
  private get zoomBounds() {
    // Min zoom ensures the entire tilemap fits within the camera view. The
    // margin ensures that the tilemap isn't flush against the edge of the
    // camera view, which can be visually unappealing and make it harder to
    // interact with the tilemap.
    const min = this.getZoom(
      this.tilemap.widthInPixels * MIN_ZOOM_MARGIN,
      this.tilemap.heightInPixels * MIN_ZOOM_MARGIN,
    )

    // Max zoom ensures that at least MIN_VISIBLE_TILES are visible in the
    // camera view. This prevents the user from zooming in so much that they can
    // only see a small portion of the tilemap, which can be disorienting and
    // make it difficult to navigate the level.
    const visibleTiles = this.getZoom(
      this.tilemap.tileWidth * MIN_VISIBLE_TILES,
      this.tilemap.tileHeight * MIN_VISIBLE_TILES,
    )

    // The max zoom is the larger of the two zoom levels, ensuring that the user
    // can zoom in enough to see at least MIN_VISIBLE_TILES, but not so much
    // that they can't see the entire tilemap.
    const max = Math.max(visibleTiles, min)

    return { min, max }
  }

  /** Sets the camera zoom level within the bounds defined by getZoomBounds. */
  setZoomInBounds(zoom = this.getZoom()) {
    const { min, max } = this.zoomBounds
    this.cameras.main.zoom = Phaser.Math.Clamp(zoom, min, max)
  }
}
