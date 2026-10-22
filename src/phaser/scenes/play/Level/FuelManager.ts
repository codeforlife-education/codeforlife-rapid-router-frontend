import Phaser from "phaser"

import { Events } from "../../../globals"
import type { GameCommand } from "../../../../app/slices"
import type Level from "."

/** The amount of fuel each command costs to execute. `wait` never costs
 * fuel, whether it's a real explicit wait block/call or one synthesised
 * purely for editor highlighting (a loop/if header, variable assignment,
 * sensing check, etc.) - only actual movement/action commands do. */
export const FUEL_COST: Record<GameCommand, number> = {
  move_forwards: 1,
  turn_left: 1,
  turn_right: 1,
  turn_around: 1,
  wait: 0,
  deliver: 1,
  sound_horn: 1,
}

/**
 * Tracks how much fuel remains as the player's commands are executed, and
 * ends the game early (same as a crash) once it runs out. Fuel is always
 * recomputed from scratch from `level.commands`/`level.commandIndex` rather
 * than decremented incrementally, so it stays correct no matter how the
 * command index jumps around (Step, Play, restart, etc.).
 */
export default class FuelManager {
  private readonly level: Level
  /** The last run id seen, to detect a restart regardless of where the new index lands. */
  private lastRunId: number

  constructor(level: Level) {
    this.level = level
    this.lastRunId = level.commandIndex.runId

    const onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
      if (key === "commandIndex") this.onGameCommandIndexChanged()
    }
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
    })

    this.level.setVariable("fuel", this.level.maxFuel)
  }

  private onGameCommandIndexChanged() {
    const { runId, index } = this.level.commandIndex
    if (runId !== this.lastRunId) this.lastRunId = runId

    if (index === -1) {
      this.level.setVariable("fuel", this.level.maxFuel)
      return
    }

    // The earliest command index at which cumulative cost reaches the
    // level's max fuel, i.e. where the game should stop for running out.
    const commands = this.level.commands
    const maxFuel = this.level.maxFuel
    let emptyAtIndex = -1
    let cost = 0
    for (let i = 0; i <= index; i++) {
      cost += FUEL_COST[commands[i]]
      // Further commands only increase cost, which is already clamped below.
      if (cost >= maxFuel) {
        emptyAtIndex = i
        break
      }
    }

    this.level.setVariable("fuel", Math.max(0, maxFuel - cost))

    if (emptyAtIndex !== -1)
      this.level.game.events.emit(Events.FINISH_EARLY, emptyAtIndex)
  }
}
