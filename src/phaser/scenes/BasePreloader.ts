import Phaser from "phaser"

import * as images from "../images"
import * as tilesets from "../tilesets"
import type { default as BaseLevel, BaseLevelData } from "./BaseLevel"
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"
import BaseScene from "./BaseScene"
import type { OrthogonalTilemap } from "../tilemaps"

export default class BasePreloader<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  levelData: BaseLevelData = {
    backgroundKey: "GRASS",
    character: { normalKey: "VAN", wreckageKey: "VAN" },
    tilesets: {
      "Tile.ROAD": [],
      "ObjectGroup.OBSTACLES": [],
      "ObjectGroup.ENDPOINTS": [],
      "ObjectGroup.SCENERY": [],
    },
  }

  init() {
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2

    // We loaded this image in our Boot Scene, so we can display it here
    const logo = this.add.image(centerX, centerY, "logo")

    // Render a tile sprite behind everything as the background.
    const background = this.add
      .tileSprite(
        centerX,
        centerY,
        this.scale.width,
        this.scale.height,
        images.URLs.Background.GRASS,
      )
      .setDepth(-1) // Render behind everything

    // A simple progress bar. This is the outline of the bar.
    const barY = centerY + logo.height / 2
    const outline = this.add
      .rectangle(centerX, barY, 468, 32)
      .setStrokeStyle(1, 0xffffff)

    // This is the progress bar itself. It will increase in size from the left
    // based on the % of progress.
    const bar = this.add.rectangle(centerX - 230, barY, 4, 28, 0xffffff)

    // Keep everything centered and the background filling the canvas.
    this.onResize((width, height) => {
      const dx = width / 2 - background.x
      const dy = height / 2 - background.y
      background.setSize(width, height)
      for (const obj of [background, logo, outline, bar]) {
        obj.setPosition(obj.x + dx, obj.y + dy)
      }
    })

    // Use the 'progress' event emitted by the LoaderPlugin to update the
    // loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress
    })
  }

  /**
   * Load a background SVG image and update the level data with the background
   * key.
   */
  private loadBackgroundSvg(
    backgroundKey: keyof typeof images.URLs.Background,
    width: number,
    height: number,
  ) {
    const backgroundUrl = images.URLs.Background[backgroundKey]
    this.load.svg(backgroundKey, backgroundUrl, { width, height })
    this.levelData.backgroundKey = backgroundKey
  }

  /**
   * Load the character SVG images (normal and wreckage) and update the level
   * data with the character keys.
   */
  private loadCharacterSvgs(
    normalKey: keyof typeof images.URLs.Character.Normal,
  ) {
    let scale = (
      {
        DEE: 0.045,
        ELECTRIC_VAN: 0.2,
        KIRSTY: 0.33,
        NIGEL: 0.33,
        PHIL: 0.25,
        SLEIGH: 0.25,
        VAN: 0.045,
        WES: 0.25,
      } as Record<keyof typeof images.URLs.Character.Normal, number>
    )[normalKey]

    const characterUrl = images.URLs.Character.Normal[normalKey]
    const normalSvgKey = `character_normal_${normalKey}`
    this.load.svg(normalSvgKey, characterUrl, { scale })
    this.levelData.character.normalKey = normalKey

    // Only vans are wrecked when they crash - other characters keep their
    // normal texture. There's no electric van wreckage art, so it reuses the
    // van's.
    const wreckageKey = (
      {
        VAN: "VAN",
        ELECTRIC_VAN: "VAN",
      } as Partial<
        Record<
          keyof typeof images.URLs.Character.Normal,
          keyof typeof images.URLs.Character.Wreckage
        >
      >
    )[normalKey]
    this.levelData.character.wreckageKey = wreckageKey
    if (!wreckageKey) return

    scale = (
      {
        SLEIGH: 1, // TODO: Adjust scale if necessary.
        VAN: 0.18675,
      } as Record<keyof typeof images.URLs.Character.Wreckage, number>
    )[wreckageKey]

    const wreckageUrl = images.URLs.Character.Wreckage[wreckageKey]
    const wreckageSvgKey = `character_wreckage_${wreckageKey}`
    this.load.svg(wreckageSvgKey, wreckageUrl, { scale })
  }

  /**
   * Load the tileset images and store relevant data in levelData for later use
   * in the Level Scene. This is necessary because Phaser needs the tileset
   * images to create the tilemap, but we also need to know which tilesets
   * belong to which layers in order to render the correct layers in the correct
   * order in the Level Scene.
   */
  private loadTilesetImages(_tilesets: tilesets.Tileset[]) {
    for (const {
      image,
      name,
      firstgid: id,
      imagewidth,
      imageheight,
      imagescale,
    } of _tilesets) {
      // Track each layer's tilesets.
      if (tilesets.road.IDs.includes(id as tilesets.road.ID)) {
        this.levelData.tilesets["Tile.ROAD"].push({ name })
      } else if (tilesets.obstacles.IDs.includes(id as tilesets.obstacles.ID)) {
        this.levelData.tilesets["ObjectGroup.OBSTACLES"].push({ name, gid: id })
      } else if (tilesets.endpoints.IDs.includes(id as tilesets.endpoints.ID)) {
        this.levelData.tilesets["ObjectGroup.ENDPOINTS"].push({ name, gid: id })
      } else if (tilesets.scenery.IDs.includes(id as tilesets.scenery.ID)) {
        this.levelData.tilesets["ObjectGroup.SCENERY"].push({ name, gid: id })
      } else {
        throw new Error(`Unknown tileset GID: ${id} (tileset name: ${name})`)
      }

      // Load the image.
      if (image.endsWith(".svg")) {
        this.load.svg(name, image, {
          width: imagewidth,
          height: imageheight,
          scale: imagescale,
        })
      } else throw new Error(`Unsupported tileset image format: ${image}`)
    }
  }

  loadTilemap(tilemap: OrthogonalTilemap) {
    // 1. Cache the tilemap data so that it can be accessed in the Level Scene.
    this.cache.tilemap.add("level", {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: tilemap,
    })

    // 2. Load the background image specified in the tilemap properties.
    this.loadBackgroundSvg(
      tilemap.properties[0].value,
      tilemap.tilewidth ?? TILE_WIDTH,
      tilemap.tileheight ?? TILE_HEIGHT,
    )

    // 3. Load the character images specified in the tilemap properties.
    this.loadCharacterSvgs(tilemap.properties[1].value)

    // 4. Load the tileset images specified in the tilemap.
    this.loadTilesetImages(tilemap.tilesets)
  }

  startLevel<LevelData extends BaseLevelData>(
    level: (new () => BaseLevel<LevelData>) & { KEY: string },
    data: LevelData = this.levelData as LevelData,
  ) {
    this.scene.start(level.KEY, data)
  }
}
