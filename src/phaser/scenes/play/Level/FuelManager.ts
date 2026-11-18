import Phaser from "phaser"

import { Events } from "../../../globals"
import { FUEL_COST } from "../../../LevelSimulator"
import type Level from "."

/**
 * Shows how much fuel remains as the player's commands are executed. Running
 * out is a rule of the game, so it's the \`LevelSimulator\` (replayed by
 * \`CharacterManager\`) that ends the run early when it happens. Fuel is always
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

    const { commands, maxFuel } = this.level
    let cost = 0
    for (let i = 0; i <= index; i++) cost += FUEL_COST[commands[i]]
    // The command the character couldn't afford (if any) is never
    // performed, so the gauge bottoms out at empty.
    this.level.setVariable("fuel", Math.max(0, maxFuel - cost))
  }
}
