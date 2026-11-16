import type Phaser from "phaser"

import * as layers from "../../../layers"
import * as tilesets from "../../../tilesets"
import type Level from "."
import type LevelSimulator from "../../../LevelSimulator"

type Tile = Phaser.Types.Tilemaps.Tile

/** How long a scared-off animal takes to fade off the road, in milliseconds. */
const ANIMAL_LEAVE_DURATION_MS = 400

const TRAFFIC_LIGHT_NAMES: readonly string[] =
  layers.objectGroup.objects.obstacles.trafficLight.Names
const TRAFFIC_LIGHT_TEXTURES = {
  RED: tilesets.obstacles.trafficLight.red.name,
  GREEN: tilesets.obstacles.trafficLight.green.name,
} as const

const tileKey = ({ row, col }: Tile) => `${row},${col}`

/**
 * Keeps the play-mode obstacle sprites (traffic lights and animals) in sync
 * with the level's `LevelSimulator`: switching each traffic light's colour as
 * it cycles, and fading out animals scared off the road by the horn.
 */
export default class ObstacleManager {
  private readonly level: Level
  /** Traffic light sprites, keyed by their tile and variant. */
  private readonly trafficLights = new Map<string, Phaser.GameObjects.Image>()
  /** Animal sprites, keyed by their tile. */
  private readonly animals = new Map<string, Phaser.GameObjects.Image>()

  constructor(level: Level) {
    this.level = level

    // Phaser copies each Tiled object's custom properties onto its sprite's
    // data, so the sprites can be matched up with the simulator's obstacles.
    for (const image of level.layers["ObjectGroup.OBSTACLES"]) {
      const key = tileKey({
        row: image.getData("tileRow") as number,
        col: image.getData("tileCol") as number,
      })
      if (TRAFFIC_LIGHT_NAMES.includes(image.name)) {
        const variant = image.getData("variant") as string
        this.trafficLights.set(`${key},${variant}`, image)
        // Traffic lights stand over the road, so the character drives under them.
        image.setDepth(level.characterSprite.depth + 1)
      } else this.animals.set(key, image)
    }
  }

  /**
   * Shows the obstacles as they currently are in `simulator`. Pass
   * `animate: false` to skip straight to the end state (e.g. on respawn).
   */
  sync(simulator: LevelSimulator, { animate = true } = {}) {
    for (const light of simulator.trafficLights) {
      this.trafficLights
        .get(`${tileKey(light.tile)},${light.variant}`)
        ?.setTexture(TRAFFIC_LIGHT_TEXTURES[light.colour])
    }

    for (const animal of simulator.animals) {
      const image = this.animals.get(tileKey(animal.tile))
      if (!image) continue

      if (animal.active) {
        this.level.tweens.killTweensOf(image)
        image.setVisible(true).setAlpha(1)
      } else if (!animate) {
        this.level.tweens.killTweensOf(image)
        image.setVisible(false)
      } else if (image.visible && !this.level.tweens.isTweening(image)) {
        this.level.tweens.add({
          targets: image,
          alpha: 0,
          duration: ANIMAL_LEAVE_DURATION_MS,
          onComplete: () => image.setVisible(false),
        })
      }
    }
  }
}
