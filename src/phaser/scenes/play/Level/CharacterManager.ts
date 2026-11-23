import Phaser from "phaser"

import {
  type Direction,
  STEP_BY_DIRECTION,
  turnLeft,
} from "../../../tilegrid/navigation"
import { Events, RUN_START_DELAY_MS, TILE_WIDTH } from "../../../globals"
import LevelSimulator, {
  type CharacterState,
  type LevelOutcome,
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

/** How long to wait before reporting a win or a crash, so the player can
 * see the van arrive or the wreck burn before the popup covers it. */
const OUTCOME_DELAY_MS = 1000

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
 * An invalid delivery, or running out of fuel, also ends the run early,
 * without wrecking the van.
 *
 * Once the run's over - the last command finishes, or it ends early - its
 * outcome is reported back to React to show the player.
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
  /** Whether this run's outcome has been reported yet. */
  private outcomeReported = false
  /** A delayed outcome report still pending, if any. */
  private outcomeTimer?: Phaser.Time.TimerEvent
  /** Holds back the run's first command while the character starts up. */
  private startTimer?: Phaser.Time.TimerEvent
  /** Applies the held-back first command instantly, if it's cut short. */
  private skipStart?: () => void

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
    this.cancelStart(false)

    this.simulator = new LevelSimulator(this.tilemapData, this.level.maxFuel)
    this.lastCommandIndex = -1
    this.outcomeReported = false
    // A new run - the previous run's outcome no longer applies.
    this.outcomeTimer?.remove()
    this.outcomeTimer = undefined

    this.level.sounds.stopEngine()
    this.sprite.repair().setVisible(true)
    this.placeAt(this.simulator.state)
    this.level.obstacles.sync(this.simulator, { animate: false })
    this.level.destinations.sync(this.simulator)
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
    this.cancelStart(true)
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
    // Nothing more happens once the run has stopped early.
    if (this.simulator.stop || this.outcomeReported) return
    const command = this.level.commands[index]
    if (!command) return

    // The run's first command - the character starts up. Only once there's
    // actually a command to play: a new run with no commands (e.g. the
    // program was just edited) can briefly push index 0 before going idle.
    if (index === 0) this.level.sounds.start()

    const step = this.simulator.perform(command)
    if (instant) {
      this.placeAt(step.to)
      this.onStepFinished(step, index, false)
      return
    }

    const spawnCount = this.spawnCount
    const animate = () =>
      this.animate(step, () => {
        if (spawnCount === this.spawnCount)
          this.onStepFinished(step, index, true)
      })

    // The character takes a moment to start up before its first command.
    if (index === 0) {
      this.skipStart = () => {
        this.placeAt(step.to)
        this.onStepFinished(step, index, false)
      }
      this.startTimer = this.level.time.delayedCall(RUN_START_DELAY_MS, () => {
        this.startTimer = this.skipStart = undefined
        animate()
      })
      return
    }

    animate()
  }

  /** Cancels the held-back first command, if it's still waiting - applying
   * it instantly if `apply` (e.g. the next command's already arrived). */
  private cancelStart(apply: boolean) {
    if (!this.startTimer) return
    this.startTimer.remove()
    const skipStart = this.skipStart
    this.startTimer = this.skipStart = undefined
    if (apply) skipStart?.()
  }

  /** Shows the outcome of a step once the van has finished acting it out. */
  private onStepFinished(step: SimulatorStep, index: number, animate: boolean) {
    if (!step.stopReason) {
      // The program ran to its end - work out whether the level's complete
      // (which, with a single destination, also marks it delivered).
      const isLast = index === this.level.commands.length - 1
      const outcome = isLast ? this.simulator.evaluate() : undefined
      this.level.obstacles.sync(this.simulator, { animate, step })
      this.level.destinations.sync(this.simulator)
      if (outcome) {
        this.level.sounds.stopEngine()
        if (outcome.success) this.level.sounds.win()
        else this.level.sounds.failure()
        this.reportOutcome(outcome, outcome.success ? OUTCOME_DELAY_MS : 0)
      }
      return
    }

    this.level.obstacles.sync(this.simulator, { animate, step })
    // Only driving into something wrecks the van - not running a red light,
    // nor delivering somewhere invalid.
    const crashed =
      step.stopReason === "off_road" || step.stopReason === "animal"
    this.level.sounds.stopEngine()
    if (crashed) {
      this.sprite.wreck()
      this.level.sounds.crash()
    } else this.level.sounds.failure()
    // Report the early stop back to React as an event arg, not via the
    // registry, so a React write racing shortly after can't clobber it.
    this.level.game.events.emit(Events.FINISH_EARLY, index)
    this.reportOutcome(
      this.simulator.evaluate(),
      crashed ? OUTCOME_DELAY_MS : 0,
    )
  }

  /** Reports the run's outcome back to React (once per run), optionally
   * after a delay - cancelled if a new run starts in the meantime. */
  private reportOutcome(outcome: LevelOutcome, delayMs = 0) {
    if (this.outcomeReported) return
    this.outcomeReported = true
    const emit = () => {
      this.outcomeTimer = undefined
      this.level.game.events.emit(Events.LEVEL_OUTCOME, outcome)
    }
    if (delayMs > 0)
      this.outcomeTimer = this.level.time.delayedCall(delayMs, emit)
    else emit()
  }

  /** Animates the van acting out a step, then calls `onComplete`. */
  private animate(
    { command, from, to, stopReason, scaredAnimal, delivered }: SimulatorStep,
    onComplete: () => void,
  ) {
    // Out of fuel, the van can't do anything at all.
    if (stopReason === "out_of_fuel") {
      onComplete()
      return
    }

    // The van never actually moves into an animal - it lurches forward into
    // it and stops dead.
    if (stopReason === "animal") {
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
      case "sound_horn":
        this.level.sounds.horn()
        if (scaredAnimal) this.level.sounds.animal(scaredAnimal.kind)
        onComplete()
        return
      case "deliver":
        if (delivered && this.simulator.destinations.length > 1)
          this.level.sounds.delivery()
        onComplete()
        return
      default:
        // No movement for the rest (wait, observe).
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
