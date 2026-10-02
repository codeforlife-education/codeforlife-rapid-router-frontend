import Phaser from "phaser"

import { Events, MAX_FUEL } from "../../../globals"
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

  constructor(level: Level) {
    this.level = level

    const onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
      if (key === "commandIndex") this.onGameCommandIndexChanged()
    }
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
    })

    this.level.setVariable("fuel", MAX_FUEL)
  }

  private onGameCommandIndexChanged() {
    const index = this.level.commandIndex
    if (index === -1) {
      this.level.setVariable("fuel", MAX_FUEL)
      return
    }

    const commands = this.level.commands.slice(0, index + 1)
    const synthetic = this.level.commandsSynthetic.slice(0, index + 1)

    // The earliest command index at which cumulative cost reaches MAX_FUEL,
    // i.e. where the game should stop for running out of fuel.
    let emptyAtIndex = -1
    let cost = 0
    for (let i = 0; i < commands.length; i++) {
      // Synthetic commands are only injected so the editor can highlight a
      // loop/if header or sensing-only line - the player didn't actually
      // issue them, so they must not cost fuel.
      if (!synthetic[i]) cost += FUEL_COST[commands[i]]
      if (emptyAtIndex === -1 && cost >= MAX_FUEL) emptyAtIndex = i
    }

    this.level.setVariable("fuel", Math.max(0, MAX_FUEL - cost))

    if (emptyAtIndex !== -1)
      this.level.game.events.emit(Events.FINISH_EARLY, emptyAtIndex)
  }
}
