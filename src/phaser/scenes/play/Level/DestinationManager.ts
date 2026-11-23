import type Phaser from "phaser"

import * as layers from "../../../layers"
import type Level from "."
import type LevelSimulator from "../../../LevelSimulator"

type Tile = Phaser.Types.Tilemaps.Tile

/** The border's colour before/after the destination's been delivered to. */
const NOT_DELIVERED_COLOUR = 0xff0000
const DELIVERED_COLOUR = 0x008000
const BORDER_WIDTH = 1

const tileKey = ({ row, col }: Tile) => `${row},${col}`

/**
 * Draws a border around each destination tile, kept in sync with the level's
 * `LevelSimulator`: red until the destination's been delivered to, then green.
 */
export default class DestinationManager {
  private readonly level: Level
  /** Border graphics, keyed by their destination's tile. */
  private readonly borders = new Map<string, Phaser.GameObjects.Graphics>()

  constructor(level: Level) {
    this.level = level
  }

  /** The border around `tile`, created on first use. */
  private border(tile: Tile) {
    const key = tileKey(tile)
    let border = this.borders.get(key)
    if (!border) {
      // Drawn just above the road, beneath the houses and everything else.
      border = this.level.add
        .graphics()
        .setDepth(layers.objectGroup.objects.Depths.BELOW_GROUND)
      this.borders.set(key, border)
    }
    return border
  }

  /** Shows the destinations as they currently are in `simulator`. */
  sync(simulator: LevelSimulator) {
    const { tilemap } = this.level
    for (const { tile, delivered } of simulator.destinations) {
      const { x, y } = tilemap.tileToWorldXY(tile.col, tile.row)!
      // Inset by half the line width, so the whole border stays on its tile.
      const inset = BORDER_WIDTH / 2
      this.border(tile)
        .clear()
        .lineStyle(
          BORDER_WIDTH,
          delivered ? DELIVERED_COLOUR : NOT_DELIVERED_COLOUR,
        )
        .strokeRect(
          x + inset,
          y + inset,
          tilemap.tileWidth - BORDER_WIDTH,
          tilemap.tileHeight - BORDER_WIDTH,
        )
    }
  }
}
