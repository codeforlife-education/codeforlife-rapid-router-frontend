import Phaser from "phaser"

import { Events } from "../../../globals"
import { FUEL_COST } from "../../../../app/slices"
import type Level from "."

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

    const commands = this.level.commands.slice(0, index + 1)

    // The earliest command index at which cumulative cost reaches the
    // level's max fuel, i.e. where the game should stop for running out.
    const maxFuel = this.level.maxFuel
    let emptyAtIndex = -1
    let cost = 0
    for (let i = 0; i < commands.length; i++) {
      cost += FUEL_COST[commands[i]]
      if (emptyAtIndex === -1 && cost >= maxFuel) emptyAtIndex = i
    }

    this.level.setVariable("fuel", Math.max(0, maxFuel - cost))

    if (emptyAtIndex !== -1)
      this.level.game.events.emit(Events.FINISH_EARLY, emptyAtIndex)
  }
}
