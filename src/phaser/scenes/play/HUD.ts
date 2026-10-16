import Phaser from "phaser"

import * as images from "../../images"
import { Events, MAX_FUEL, SceneKeys } from "../../globals"
import BaseScene from "../BaseScene"

const SIZE = 130
const MARGIN_X = 20
const MARGIN_Y = 20
/** The needle's angle (degrees) at empty/full - tuned visually against the
 * dial artwork: 0 is straight up (the needle's drawn orientation), positive
 * is clockwise. Full sits at the right-hand end of the dial, empty at the
 * bottom of the red section on the left. */
const EMPTY_ANGLE = -120
const FULL_ANGLE = 120

/**
 * The HUD (Heads-Up Display) Scene is responsible for displaying game
 * information such as score, health, and other relevant data to the player.
 * It typically runs in parallel with the main gameplay scene and is designed to
 * be non-intrusive, allowing players to focus on the game while still providing
 * essential information at a glance.
 */
export default class extends BaseScene {
  static readonly KEY = SceneKeys.Play.HUD

  private pointer!: Phaser.GameObjects.Image

  preload() {
    this.load.svg("gauge_dial", images.URLs.HUD.FuelGauge.FUEL_GAUGE, {
      width: SIZE,
      height: SIZE,
    })
    this.load.svg("gauge_pointer", images.URLs.HUD.FuelGauge.POINTER, {
      width: SIZE,
      height: SIZE,
    })
  }

  create() {
    const x = this.cameras.main.width - MARGIN_X - SIZE / 2
    const y = this.cameras.main.height - MARGIN_Y - SIZE / 2
    this.add.image(x, y, "gauge_dial")
    this.pointer = this.add.image(x, y, "gauge_pointer")
    this.updateGauge(MAX_FUEL)

    const onPhaserSetVariable: Phaser.Events.PhaserSetVariable = key => {
      if (key === "fuel")
        this.updateGauge(this.getVariable<number>("fuel", MAX_FUEL))
    }
    this.game.events.on(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
    })
  }

  private updateGauge(fuel: number) {
    const t = Phaser.Math.Clamp(fuel / MAX_FUEL, 0, 1)
    this.pointer.setAngle(Phaser.Math.Linear(EMPTY_ANGLE, FULL_ANGLE, t))
  }
}
