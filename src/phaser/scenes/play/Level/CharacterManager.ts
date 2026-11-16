import Phaser from "phaser"

import {
  type Direction,
  STEP_BY_DIRECTION,
  turnLeft,
} from "../../../tilegrid/navigation"
import { Events, TILE_WIDTH } from "../../../globals"
import LevelSimulator, {
  type CharacterState,
  type SimulatorStep,
} from "../../../LevelSimulator"
import type Level from "."
import type { OrthogonalTilemap } from "../../../tilemaps"

type Point = Phaser.Types.Math.Vector2Like
type Tile = Phaser.Types.Tilemaps.Tile

const ROTATION_BY_DIRECTION: Record<Direction, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
}

/** How far off the tile-boundary center the van sits, so it drives on the left. */
const LANE_OFFSET = 0.125 * TILE_WIDTH

/** How far (as a fraction of a tile, and of a full move's duration) the van
 * lurches forward when it drives into an animal. */
const ANIMAL_BUMP_RATIO = 0.25

/**
 * Drives the van around the play-mode tilemap. The van always straddles the
 * boundary between two adjacent road tiles - `tile` (its back half) and the
 * tile ahead of it in its `heading` (its front half) - offset laterally so it
 * drives on the left side of the road.
 *
 * Every command is replayed through a `LevelSimulator` - the same model that
 * ran the player's program upfront - so where the van goes, and whether it
 * collides with something, always matches it exactly. A colliding move/turn
 * still plays out so the collision is visible:
 * - Off road: the van drives off the road, then is wrecked.
 * - Into an animal: the van lurches forward into it, then is wrecked.
 * - Through a red light: the van drives through it (but isn't wrecked).
 */
export default class CharacterManager {
  private readonly level: Level
  /** The level's Tiled data, used to (re)create the simulator on respawn. */
  private readonly tilemapData: OrthogonalTilemap
  /** Replays this run's commands. */
  private simulator!: LevelSimulator
  /** The last command index actually applied, to detect/catch up on any skipped in between. */
  private lastCommandIndex = -1
  /** The last run id seen, to detect a restart regardless of where the new index lands. */
  private lastRunId = 0
  /** Bumped on every respawn, so a previous run's animation can't finish
   * into (and so affect) the current run. */
  private spawnCount = 0

  constructor(level: Level) {
    this.level = level
    this.tilemapData = (
      level.cache.tilemap.get("level") as { data: OrthogonalTilemap }
    ).data
    this.spawn()
    this.lastRunId = level.commandIndex.runId

    const onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
      if (key === "commandIndex") this.onGameCommandIndexChanged()
    }
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
    })
  }

  private get sprite() {
    return this.level.characterSprite
  }

  /** (Re)spawns the van at the start endpoint's tile boundary, and resets
   * every obstacle to its starting state. */
  private spawn() {
    this.spawnCount++
    // Skip any still-running animation (now stale) straight to its end.
    this.sprite.finishAnimation()

    this.simulator = new LevelSimulator(this.tilemapData)
    this.lastCommandIndex = -1

    this.sprite.repair().setVisible(true)
    this.placeAt(this.simulator.state)
    this.level.obstacles.sync(this.simulator, { animate: false })
  }

  private onGameCommandIndexChanged() {
    const { runId, index } = this.level.commandIndex
    // Respawn whenever a new run begins, however the index itself changed.
    if (runId !== this.lastRunId) {
      this.lastRunId = runId
      this.spawn()
    } else if (index <= this.lastCommandIndex) {
      // A phase change alone (e.g. reaching the last step, or pausing)
      // re-broadcasts the same index without it actually advancing, and the
      // run ending early (e.g. running out of fuel) can move it backwards -
      // ignore both, or it'd replay commands a second time.
      return
    }

    // Skip any still-running animation straight to its end state first.
    this.sprite.finishAnimation()

    if (index === -1) return // Not playing yet this run.

    // React/redux can coalesce several index changes into a single push to
    // Phaser (e.g. clicking Step twice quickly), skipping past intermediate
    // indices entirely - apply any skipped commands' effects instantly (no
    // animation, there's no time left to show them) so the van's position
    // and collisions stay correct, then animate only the latest.
    for (let i = this.lastCommandIndex + 1; i < index; i++) this.play(i, true)
    this.play(index, false)
    this.lastCommandIndex = index
  }

  /** Replays the command at `index`, either animated or instantly. */
  private play(index: number, instant: boolean) {
    // Nothing more happens once the van has collided with something.
    if (this.simulator.crash) return
    const command = this.level.commands[index]
    if (!command) return

    const step = this.simulator.perform(command)
    if (instant) {
      this.placeAt(step.to)
      this.onStepFinished(step, index, false)
      return
    }

    const spawnCount = this.spawnCount
    this.animate(step, () => {
      if (spawnCount === this.spawnCount) this.onStepFinished(step, index, true)
    })
  }

  /** Shows the outcome of a step once the van has finished acting it out. */
  private onStepFinished(step: SimulatorStep, index: number, animate: boolean) {
    this.level.obstacles.sync(this.simulator, { animate })
    if (!step.collision) return

    // Running a red light isn't a crash - the van's still in one piece.
    if (step.collision !== "red_light") this.sprite.wreck()
    // Report the collision back to React as an event arg, not via the
    // registry, so a React write racing shortly after can't clobber it.
    this.level.game.events.emit(Events.FINISH_EARLY, index)
  }

  /** Animates the van acting out a step, then calls `onComplete`. */
  private animate(
    { command, from, to, collision }: SimulatorStep,
    onComplete: () => void,
  ) {
    // The van never actually moves into an animal - it lurches forward into
    // it and stops dead.
    if (collision === "animal") {
      const start = this.boundaryPoint(from)
      const step = STEP_BY_DIRECTION[from.heading]
      this.sprite.move(
        start,
        {
          x:
            start.x +
            step.col * this.level.tilemap.tileWidth * ANIMAL_BUMP_RATIO,
          y:
            start.y +
            step.row * this.level.tilemap.tileHeight * ANIMAL_BUMP_RATIO,
        },
        onComplete,
        this.sprite.defaultMoveDurationMs * ANIMAL_BUMP_RATIO,
      )
      return
    }

    switch (command) {
      case "move_forwards":
        this.sprite.move(
          this.boundaryPoint(from),
          this.boundaryPoint(to),
          onComplete,
        )
        return
      case "turn_left":
      case "turn_right":
      case "turn_around": {
        const deltaDeg = (
          { turn_left: -90, turn_right: 90, turn_around: 180 } as const
        )[command]
        const pivot =
          deltaDeg === 180
            ? // Sweeps a tight 180-degree hairpin pivoting at the (un-offset)
              // center of the boundary it's already on, ending on the
              // opposite lateral side.
              this.boundaryCenter(from)
            : // The van advances one tile forward while pivoting 90 degrees
              // around the inside/outside corner shared by its old and new
              // heading.
              this.turnPivot(from.tile, from.heading, to.heading)
        this.sprite.turn(
          pivot,
          this.boundaryPoint(from),
          ROTATION_BY_DIRECTION[from.heading],
          deltaDeg,
          onComplete,
        )
        return
      }
      default:
        // No movement for the rest (wait, deliver, sound_horn, observe) yet -
        // future sound/animation hooks.
        onComplete()
    }
  }

  /** Instantly places the van at the given position. */
  private placeAt(state: CharacterState) {
    const { x, y } = this.boundaryPoint(state)
    this.sprite.setPosition(x, y).setAngle(ROTATION_BY_DIRECTION[state.heading])
  }

  private tileCenterWorld(tile: Tile): Point {
    const world = this.level.tilemap.tileToWorldXY(tile.col, tile.row)!
    return {
      x: world.x + this.level.tilemap.tileWidth / 2,
      y: world.y + this.level.tilemap.tileHeight / 2,
    }
  }

  /** The un-offset midpoint of the shared edge between `tile` and its `heading` neighbour. */
  private boundaryCenter({ tile, heading }: CharacterState): Point {
    const center = this.tileCenterWorld(tile)
    const step = STEP_BY_DIRECTION[heading]
    return {
      x: center.x + step.col * (this.level.tilemap.tileWidth / 2),
      y: center.y + step.row * (this.level.tilemap.tileHeight / 2),
    }
  }

  /** `boundaryCenter`, offset laterally so the van drives on the left. */
  private boundaryPoint(state: CharacterState): Point {
    const center = this.boundaryCenter(state)
    const lane = STEP_BY_DIRECTION[turnLeft(state.heading)]
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
