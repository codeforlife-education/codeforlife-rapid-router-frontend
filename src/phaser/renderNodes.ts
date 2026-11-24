import Phaser from "phaser"

import { TEXTURE_RESOLUTION } from "./globals"

const HI_RES_TILE_TRANSFORMER = "HiResTileTransformer"

/**
 * Makes a tilemap layer draw its tiles at `1 / TEXTURE_RESOLUTION` of their
 * tilesets' tile size, so tilesets whose images (and tile size) were rendered
 * at `TEXTURE_RESOLUTION` are displayed at the map's tile size.
 *
 * Phaser draws each tile at its tileset's tile size, which it also uses to
 * work out which part of the tileset's image to draw. So a tileset can't just
 * declare the map's tile size for a higher resolution image - only part of
 * its image would be drawn. Instead, the tileset declares its real (higher
 * resolution) tile size, and this swaps the layer's transformer render node
 * (which only sizes and positions each tile) for one that scales it back down.
 *
 * Only applies to the WebGL renderer.
 */
export function enableHiResTiles(
  layer: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer,
) {
  const { renderer } = layer.scene.game
  if (!(renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)) return

  // Each game has its own renderer, so register the render node once per game.
  const { renderNodes } = renderer
  if (!renderNodes.hasNode(HI_RES_TILE_TRANSFORMER)) {
    const node = new Phaser.Renderer.WebGL.RenderNodes.TransformerTile(
      renderNodes,
      { name: HI_RES_TILE_TRANSFORMER },
    )
    const run = node.run.bind(node)
    // The texturer data's frame size is only used (by the transformer) to size
    // the tile - its texture coordinates were already worked out from it.
    node.run = (drawingContext, gameObject, texturerNode, ...args) => {
      const texturer = texturerNode as unknown as {
        frameWidth: number
        frameHeight: number
      }
      const { frameWidth, frameHeight } = texturer
      texturer.frameWidth = frameWidth / TEXTURE_RESOLUTION
      texturer.frameHeight = frameHeight / TEXTURE_RESOLUTION
      try {
        run(drawingContext, gameObject, texturerNode, ...args)
      } finally {
        texturer.frameWidth = frameWidth
        texturer.frameHeight = frameHeight
      }
    }
    renderNodes.addNode(HI_RES_TILE_TRANSFORMER, node)
  }

  layer.setRenderNodeRole("Transformer", HI_RES_TILE_TRANSFORMER)
}
