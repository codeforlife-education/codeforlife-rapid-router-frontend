import Phaser from "phaser"

import * as layers from "../../../layers"
import * as tilesets from "../../../tilesets"
import { Events, TILE_WIDTH } from "../../../globals"
import type { GameCommand } from "../../../../app/slices"
import type Level from "."

export type Direction = "top" | "right" | "bottom" | "left"

type Point = { x: number; y: number }
type Tile = Phaser.Types.Tilemaps.Tile

/** Clockwise order of directions - matches the endpoints' own rotation convention. */
const DIRECTION_ORDER: readonly Direction[] = ["top", "right", "bottom", "left"]

const ROTATION_BY_DIRECTION: Record<Direction, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
}

/** Unit row/col step for each direction. */
const STEP_BY_DIRECTION: Record<Direction, { row: number; col: number }> = {
  top: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  bottom: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
}

const turnLeft = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 3) % 4]
const turnRight = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 1) % 4]
const turnAround = (dir: Direction) =>
  DIRECTION_ORDER[(DIRECTION_ORDER.indexOf(dir) + 2) % 4]

/** How long a move/turn animation takes. Fixed - not tied to `playSpeed`. */
const MOVE_DURATION_MS = 400
const TURN_AROUND_DURATION_MS = 500
/** How far off the tile-boundary center the van sits, so it drives on the left. */
const LANE_OFFSET = 0.125 * TILE_WIDTH

/**
 * Drives the van around the play-mode tilemap. The van always straddles the
 * boundary between two adjacent road tiles - `tile` (its back half) and
 * `moveFromTile(tile, heading)` (its front half, always derived, never
 * stored) - offset laterally so it drives on the left side of the road.
 * A move/turn is never blocked up front: it always plays out, and only once
 * the van has arrived does it check whether it's still on the road - so an
 * invalid command visibly drives the van off the road before it crashes.
 */
export default class CharacterManager {
  private readonly level: Level
  private sprite!: Phaser.GameObjects.Sprite
  private tile!: Tile
  private heading!: Direction
  private crashed = false
  private pending: { tween: Phaser.Tweens.Tween; finish: () => void } | null =
    null

  constructor(level: Level) {
    this.level = level
    this.spawn()

    const onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
      if (key === "commandIndex") this.onGameCommandIndexChanged()
    }
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      this.pending?.tween.stop()
    })
  }

  /** Finds the level's single CFC (start) endpoint and its tile/facing. */
  private findStart(): { tile: Tile; heading: Direction } {
    const cfcIds = tilesets.endpoints.cfc.IDs as readonly number[]
    const obj = this.level.tilemap
      .getObjectLayer("ObjectGroup.ENDPOINTS")
      ?.objects.find(({ gid }) => gid !== undefined && cfcIds.includes(gid))
    if (!obj) throw new Error("Level has no CFC start endpoint")

    const properties = obj.properties as { name: string; value: unknown }[]
    const property = (name: string) =>
      properties.find(p => p.name === name)?.value

    return {
      tile: {
        row: property("tileRow") as number,
        col: property("tileCol") as number,
      },
      heading: property("variant") as Direction,
    }
  }

  /** (Re)spawns the van at the start endpoint's tile boundary. */
  private spawn() {
    const { tile, heading } = this.findStart()
    this.tile = tile
    this.heading = heading
    this.crashed = false

    const { x, y } = this.boundaryPoint(tile, heading)
    if (this.sprite) {
      this.sprite
        .setTexture("Character.VAN")
        .setPosition(x, y)
        .setAngle(ROTATION_BY_DIRECTION[heading])
    } else {
      this.sprite = this.level.add
        .sprite(x, y, "Character.VAN")
        .setOrigin(0.5, 0.5)
        .setAngle(ROTATION_BY_DIRECTION[heading])
        // Place above all obstacles/endpoints/scenery.
        .setDepth(
          Math.max(...Object.values(layers.objectGroup.objects.Depths)) + 1,
        )
    }
  }

  private crash() {
    this.crashed = true
    this.sprite.setTexture("Character.VAN_WRECKAGE")
  }

  private onGameCommandIndexChanged() {
    // Skip any still-running animation straight to its end state first.
    if (this.pending) this.pending.finish()

    const index = this.level.commandIndex
    if (index === -1) {
      this.spawn()
      return
    }
    if (this.crashed) return

    const command = this.level.commands[index]
    if (command) this.runCommand(command)
  }

  private runCommand(command: GameCommand) {
    switch (command) {
      case "move_forwards":
        return this.commandMoveForwards()
      case "turn_left":
        return this.commandTurn(-90)
      case "turn_right":
        return this.commandTurn(90)
      case "turn_around":
        return this.commandTurnAround()
      case "wait":
      case "deliver":
      case "sound_horn":
        // No movement for these yet - future sound/animation hooks.
        return
    }
  }

  private commandMoveForwards() {
    const newTile = this.moveFromTile(this.tile, this.heading)
    const from = this.boundaryPoint(this.tile, this.heading)
    const to = this.boundaryPoint(newTile, this.heading)

    this.beginAnimation(
      MOVE_DURATION_MS,
      t => {
        this.sprite.setPosition(
          Phaser.Math.Linear(from.x, to.x, t),
          Phaser.Math.Linear(from.y, to.y, t),
        )
      },
      () => {
        this.tile = newTile
        this.checkForCrash()
      },
    )
  }

  private commandTurn(deltaDeg: -90 | 90) {
    const newHeading =
      deltaDeg < 0 ? turnLeft(this.heading) : turnRight(this.heading)
    const newTile = this.moveFromTile(this.tile, this.heading)

    // The van advances one tile forward while pivoting 90 degrees around the
    // inside/outside corner shared by its old and new heading.
    const pivot = this.turnPivot(this.tile, this.heading, newHeading)
    const from = this.boundaryPoint(this.tile, this.heading)

    this.animateRotationAroundPivot(
      pivot,
      from,
      ROTATION_BY_DIRECTION[this.heading],
      deltaDeg,
      MOVE_DURATION_MS,
      () => {
        this.tile = newTile
        this.heading = newHeading
        this.checkForCrash()
      },
    )
  }

  private commandTurnAround() {
    const newHeading = turnAround(this.heading)
    const newTile = this.moveFromTile(this.tile, this.heading)

    // Sweeps a tight 180-degree hairpin pivoting at the (un-offset) center of
    // the boundary it's already on, ending on the opposite lateral side.
    const pivot = this.boundaryCenter(this.tile, this.heading)
    const from = this.boundaryPoint(this.tile, this.heading)

    this.animateRotationAroundPivot(
      pivot,
      from,
      ROTATION_BY_DIRECTION[this.heading],
      180,
      TURN_AROUND_DURATION_MS,
      () => {
        this.tile = newTile
        this.heading = newHeading
        this.checkForCrash()
      },
    )
  }

  /**
   * Animates the sprite tracing a circular arc of `deltaDeg` around `pivot`,
   * starting at `from` (at angle `fromAngleDeg`), while rotating the sprite's
   * own angle by the same `deltaDeg`. Used by both the 90-degree turns and
   * the 180-degree u-turn - only the pivot/angle/duration differ.
   */
  private animateRotationAroundPivot(
    pivot: Point,
    from: Point,
    fromAngleDeg: number,
    deltaDeg: number,
    duration: number,
    commit: () => void,
  ) {
    const offset = { x: from.x - pivot.x, y: from.y - pivot.y }

    this.beginAnimation(
      duration,
      t => {
        const rad = Phaser.Math.DegToRad(deltaDeg * t)
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        this.sprite.setPosition(
          pivot.x + offset.x * cos - offset.y * sin,
          pivot.y + offset.x * sin + offset.y * cos,
        )
        this.sprite.setAngle(fromAngleDeg + deltaDeg * t)
      },
      commit,
    )
  }

  /**
   * Drives `onUpdate(t)` (t: 0..1) over `duration`, then calls `commit()`.
   * Exposes a `finish()` escape hatch (via `this.pending`) that jumps
   * straight to `onUpdate(1)` and `commit()`, for when the next command
   * arrives before this animation naturally completes.
   */
  private beginAnimation(
    duration: number,
    onUpdate: (t: number) => void,
    commit: () => void,
  ) {
    const state = { t: 0 }
    const complete = () => {
      this.pending = null
      commit()
    }

    const tween = this.level.tweens.add({
      targets: state,
      t: 1,
      duration,
      onUpdate: () => onUpdate(state.t),
      onComplete: complete,
    })

    this.pending = {
      tween,
      finish: () => {
        tween.stop()
        onUpdate(1)
        complete()
      },
    }
  }

  /** The tile after moving one step in `dir` (may be off the edge of the map). */
  private moveFromTile(tile: Tile, dir: Direction): Tile {
    const step = STEP_BY_DIRECTION[dir]
    return { row: tile.row + step.row, col: tile.col + step.col }
  }

  /** `false` for any tile off the road, including off the edge of the map. */
  private hasRoad(tile: Tile): boolean {
    return (
      this.level.tilemap.hasTileAt(tile.col, tile.row, "Tile.ROAD") === true
    )
  }

  /** The van is on the road only while both tiles it straddles are road. */
  private isValidState(tile: Tile, heading: Direction): boolean {
    return this.hasRoad(tile) && this.hasRoad(this.moveFromTile(tile, heading))
  }

  /** Crashes if the van's current position has driven off the road. */
  private checkForCrash() {
    if (!this.isValidState(this.tile, this.heading)) this.crash()
  }

  private tileCenterWorld(tile: Tile): Point {
    const world = this.level.tilemap.tileToWorldXY(tile.col, tile.row)!
    return {
      x: world.x + this.level.tilemap.tileWidth / 2,
      y: world.y + this.level.tilemap.tileHeight / 2,
    }
  }

  /** The un-offset midpoint of the shared edge between `tile` and its `heading` neighbour. */
  private boundaryCenter(tile: Tile, heading: Direction): Point {
    const center = this.tileCenterWorld(tile)
    const step = STEP_BY_DIRECTION[heading]
    return {
      x: center.x + step.col * (this.level.tilemap.tileWidth / 2),
      y: center.y + step.row * (this.level.tilemap.tileHeight / 2),
    }
  }

  /** `boundaryCenter`, offset laterally so the van drives on the left. */
  private boundaryPoint(tile: Tile, heading: Direction): Point {
    const center = this.boundaryCenter(tile, heading)
    const lane = STEP_BY_DIRECTION[turnLeft(heading)]
    return {
      x: center.x + lane.col * LANE_OFFSET,
      y: center.y + lane.row * LANE_OFFSET,
    }
  }

  /** The tile-grid corner shared by a tile's `heading` and `newHeading` sides. */
  private turnPivot(
    tile: Tile,
    heading: Direction,
    newHeading: Direction,
  ): Point {
    const center = this.tileCenterWorld(tile)
    const a = STEP_BY_DIRECTION[heading]
    const b = STEP_BY_DIRECTION[newHeading]
    return {
      x: center.x + (a.col + b.col) * (this.level.tilemap.tileWidth / 2),
      y: center.y + (a.row + b.row) * (this.level.tilemap.tileHeight / 2),
    }
  }
}
