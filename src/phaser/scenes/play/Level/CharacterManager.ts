import Phaser from "phaser"

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
    this.level.characterSprite
      .setVisible(true)
      .setTexture("normal")
      .setPosition(x, y)
      .setAngle(ROTATION_BY_DIRECTION[heading])
  }

  private crash() {
    this.crashed = true
    this.level.characterSprite.setTexture("wreckage")
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
        return this.moveForwards()
      case "turn_left":
        return this.turn(-90)
      case "turn_right":
        return this.turn(90)
      case "turn_around":
        return this.turn(180)
      case "wait":
      case "deliver":
      case "sound_horn":
        // No movement for these yet - future sound/animation hooks.
        return
    }
  }

  private moveForwards() {
    const newTile = this.moveFromTile(this.tile, this.heading)
    const from = this.boundaryPoint(this.tile, this.heading)
    const to = this.boundaryPoint(newTile, this.heading)

    this.level.characterSprite.move(from, to, () => {
      this.tile = newTile
      this.checkForCrash()
    })
  }

  private turn(deltaDeg: -90 | 90 | 180) {
    const newHeading = {
      [-90]: turnLeft(this.heading),
      90: turnRight(this.heading),
      180: turnAround(this.heading),
    }[deltaDeg]
    const newTile = this.moveFromTile(this.tile, this.heading)
    const pivot =
      deltaDeg === 180
        ? // Sweeps a tight 180-degree hairpin pivoting at the (un-offset)
          // center of the boundary it's already on, ending on the opposite
          // lateral side.
          this.boundaryCenter(this.tile, this.heading)
        : // The van advances one tile forward while pivoting 90 degrees around
          // the inside/outside corner shared by its old and new heading.
          this.turnPivot(this.tile, this.heading, newHeading)
    const from = this.boundaryPoint(this.tile, this.heading)

    this.level.characterSprite.turn(
      pivot,
      from,
      ROTATION_BY_DIRECTION[this.heading],
      deltaDeg,
      () => {
        this.tile = newTile
        this.heading = newHeading
        this.checkForCrash()
      },
    )
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
