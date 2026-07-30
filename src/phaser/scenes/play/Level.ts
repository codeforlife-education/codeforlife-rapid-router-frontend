import Phaser from "phaser"

import BaseLevel, { type BaseLevelData } from "../BaseLevel"
import { Events, SceneKeys, Variables } from "../../globals"
import type { GameCommand } from "../../../app/slices"
import HUD from "./HUD"

export interface LevelData extends BaseLevelData {}

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends BaseLevel<LevelData> {
  static readonly KEY = SceneKeys.Play.LEVEL

  private get commands() {
    return this.getVariable<GameCommand[]>("commands", [])
  }

  create() {
    this.scene.launch(HUD.KEY)

    super.create()

    // Listen for updates to the game commands.
    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    this.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
    })
  }

  // @ts-expect-error will be used in the future
  private pause() {
    this.scene.pause(HUD.KEY)
    this.scene.pause()
  }

  // @ts-expect-error will be used in the future
  private runCommands() {
    // TODO: Implement the logic to process the character commands and update
    // the game state accordingly.
    console.log(this.commands)
  }

  private onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
    if (key !== Variables.COMMANDS) return

    // TODO: Implement the logic to process the character commands and update
    // the game state accordingly.
    console.log(this.commands)
  }
}
