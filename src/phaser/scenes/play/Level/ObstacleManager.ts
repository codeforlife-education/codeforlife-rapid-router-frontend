import Phaser from "phaser"

import * as layers from "../../../layers"
import * as tilesets from "../../../tilesets"
import type { Animal, AnimalKind, SimulatorStep } from "../../../LevelSimulator"
import { type Direction, STEP_BY_DIRECTION } from "../../../tilegrid/navigation"
import type Level from "."
import type LevelSimulator from "../../../LevelSimulator"
import { canOverlap } from "../../../layers/objectGroup/objects/overlap"

type Tile = Phaser.Types.Tilemaps.Tile

/** How long a scared-off animal takes to turn towards where it's heading. */
const ANIMAL_TURN_DURATION_MS = 150
/** How long a scared-off animal takes to walk off the road. */
const ANIMAL_WALK_DURATION_MS = 450
/** How long a scared-off animal with nowhere to go takes to shrink away. */
const ANIMAL_SHRINK_DURATION_MS = 400
/** How far (in tiles) a scared-off animal looks for somewhere to go. */
const ANIMAL_EXIT_SEARCH_RADIUS = 3

/** The angle (in degrees, clockwise from facing right) each animal's image
 * faces when unrotated - per their rotation variants, the cow faces up and
 * the pigeon faces right. */
const ANIMAL_FACING_DEG: Record<AnimalKind, number> = { COW: -90, PIGEON: 0 }

const TRAFFIC_LIGHT_NAMES: readonly string[] =
  layers.objectGroup.objects.obstacles.trafficLight.Names
const TRAFFIC_LIGHT_TEXTURES = {
  RED: tilesets.obstacles.trafficLight.red.name,
  GREEN: tilesets.obstacles.trafficLight.green.name,
} as const

const tileKey = ({ row, col }: Pick<Tile, "row" | "col">) => `${row},${col}`

/** Where a scared-off animal goes: a free tile off the road, or nowhere at
 * all (`null`), in which case it shrinks away instead. */
type AnimalExit = { tileKey: string; x: number; y: number; angle: number }

type AnimalSprite = {
  image: Phaser.GameObjects.Image
  /** Where the animal stands on the road at the start of a run. */
  home: { x: number; y: number; angle: number; scaleX: number; scaleY: number }
  /** Where the animal went once scared off - unset while it's on the road. */
  exit?: AnimalExit | null
}

/**
 * Keeps the play-mode obstacle sprites (traffic lights and animals) in sync
 * with the level's `LevelSimulator`: switching each traffic light's colour as
 * it cycles, and walking animals scared by the horn off the road - to the
 * nearest free tile, or shrinking them away if there's nowhere to go.
 */
export default class ObstacleManager {
  private readonly level: Level
  /** Traffic light sprites, keyed by their tile and variant. */
  private readonly trafficLights = new Map<string, Phaser.GameObjects.Image>()
  /** Animal sprites, keyed by their tile. */
  private readonly animals = new Map<string, AnimalSprite>()
  /** The tiles scared-off animals have gone to this run, so no two share. */
  private readonly claimedTileKeys = new Set<string>()

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
      } else {
        // Pivot the animal around its center (staying exactly where it is),
        // so it can turn and walk off naturally.
        const { centerX, centerY } = image.getBounds()
        image.setOrigin(0.5, 0.5).setPosition(centerX, centerY)
        this.animals.set(key, {
          image,
          home: {
            x: image.x,
            y: image.y,
            angle: image.angle,
            scaleX: image.scaleX,
            scaleY: image.scaleY,
          },
        })
      }
    }
  }

  /**
   * Shows the obstacles as they currently are in `simulator`. Pass
   * `animate: false` to skip straight to the end state (e.g. on respawn), and
   * the `step` just performed so scared-off animals can get out of its way.
   */
  sync(
    simulator: LevelSimulator,
    { animate = true, step }: { animate?: boolean; step?: SimulatorStep } = {},
  ) {
    for (const light of simulator.trafficLights) {
      this.trafficLights
        .get(`${tileKey(light.tile)},${light.variant}`)
        ?.setTexture(TRAFFIC_LIGHT_TEXTURES[light.colour])
    }

    for (const animal of simulator.animals) {
      const sprite = this.animals.get(tileKey(animal.tile))
      if (!sprite) continue

      if (animal.active) this.returnHome(sprite)
      else if (sprite.exit === undefined) {
        // Just scared off the road - find somewhere to go.
        const heading = step?.to.heading ?? "top"
        sprite.exit = this.findExit(sprite, animal, heading)
        if (sprite.exit) this.claimedTileKeys.add(sprite.exit.tileKey)
        this.leave(sprite, animate)
      }
    }
  }

  /** Puts an animal back on the road, where it started the run. */
  private returnHome(sprite: AnimalSprite) {
    const { image, home, exit } = sprite
    if (exit === undefined) return
    if (exit) this.claimedTileKeys.delete(exit.tileKey)
    sprite.exit = undefined
    this.level.tweens.killTweensOf(image)
    image
      .setPosition(home.x, home.y)
      .setAngle(home.angle)
      .setScale(home.scaleX, home.scaleY)
      .setVisible(true)
  }

  /** Moves a scared-off animal to its exit (or shrinks it away, if it has
   * nowhere to go), either animated or instantly. */
  private leave({ image, exit }: AnimalSprite, animate: boolean) {
    const { tweens } = this.level
    tweens.killTweensOf(image)

    if (!exit) {
      if (!animate) image.setVisible(false)
      else
        tweens.add({
          targets: image,
          scaleX: image.scaleX * 0.01,
          scaleY: image.scaleY * 0.01,
          duration: ANIMAL_SHRINK_DURATION_MS,
          onComplete: () => image.setVisible(false),
        })
      return
    }

    if (!animate) {
      image.setPosition(exit.x, exit.y).setAngle(exit.angle)
      return
    }

    // Turn the shortest way round towards the exit, then walk to it.
    const turnDeg = Phaser.Math.Angle.WrapDegrees(exit.angle - image.angle)
    tweens.chain({
      targets: image,
      tweens: [
        { angle: image.angle + turnDeg, duration: ANIMAL_TURN_DURATION_MS },
        {
          x: exit.x,
          y: exit.y,
          duration: ANIMAL_WALK_DURATION_MS,
          ease: "Sine.easeOut",
        },
      ],
    })
  }

  /**
   * Finds the nearest free tile for a scared-off animal to walk to: off the
   * road, not taken by another scared-off animal, and where the animal won't
   * clash with any scenery or endpoint (e.g. a house). Ties prefer stepping
   * to the side of the character's `heading`, rather than ahead or behind it.
   * Returns `null` if there's nowhere free nearby.
   */
  private findExit(
    { image, home }: AnimalSprite,
    { tile: origin, kind }: Animal,
    heading: Direction,
  ): AnimalExit | null {
    const { tilemap, layers } = this.level
    const forward = STEP_BY_DIRECTION[heading]

    const candidates: (AnimalExit & {
      distance: number
      forwardness: number
    })[] = []

    for (let row = 0; row < tilemap.height; row++) {
      for (let col = 0; col < tilemap.width; col++) {
        const dCol = col - origin.col
        const dRow = row - origin.row
        const rings = Math.max(Math.abs(dCol), Math.abs(dRow))
        if (rings === 0 || rings > ANIMAL_EXIT_SEARCH_RADIUS) continue

        const key = tileKey({ row, col })
        if (this.claimedTileKeys.has(key)) continue
        if (layers["Tile.ROAD"].getTileAt(col, row)) continue

        const world = tilemap.tileToWorldXY(col, row)!
        const x = world.x + tilemap.tileWidth / 2
        const y = world.y + tilemap.tileHeight / 2
        const angle =
          Phaser.Math.RadToDeg(Math.atan2(y - home.y, x - home.x)) -
          ANIMAL_FACING_DEG[kind]

        // Where the animal would take up space, facing the way it walked.
        const prevAngle = image.angle
        image.setAngle(angle)
        const bounds = image.getRelativeBounds(x, y)
        image.setAngle(prevAngle)

        const isBlocked =
          layers["ObjectGroup.SCENERY"].some(
            obj => !canOverlap(image, obj, bounds),
          ) ||
          layers["ObjectGroup.ENDPOINTS"].some(endpoint =>
            Phaser.Geom.Rectangle.Overlaps(bounds, endpoint.getBounds()),
          )
        if (isBlocked) continue

        candidates.push({
          tileKey: key,
          x,
          y,
          angle,
          distance: Math.hypot(dCol, dRow),
          forwardness: Math.abs(dCol * forward.col + dRow * forward.row),
        })
      }
    }

    // Candidates were collected in row-then-column order, which the stable
    // sort keeps as the final tie-break.
    candidates.sort(
      (a, b) => a.distance - b.distance || a.forwardness - b.forwardness,
    )
    const exit = candidates[0]
    return exit
      ? { tileKey: exit.tileKey, x: exit.x, y: exit.y, angle: exit.angle }
      : null
  }
}
