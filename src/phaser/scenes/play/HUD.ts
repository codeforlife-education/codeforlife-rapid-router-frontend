import Phaser from "phaser"

import {
  DEFAULT_MAX_FUEL,
  Events,
  FUEL_GAUGE_SIZE,
  SceneKeys,
} from "../../globals"
import BaseScene from "../BaseScene"

/** The gauge's size as a fraction of the canvas's shortest side. It's capped
 * at FUEL_GAUGE_SIZE, so it doesn't get too big on big screens, and at
 * MIN_GAUGE_SIZE, so it stays readable on small ones (both in CSS pixels). */
const GAUGE_SIZE_RATIO = 0.2
const MIN_GAUGE_SIZE = 56
/** The gap between the gauge and the canvas's edges, as a fraction of the
 * gauge's size. */
const MARGIN_RATIO = 0.15
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

  create() {
    const dial = this.add.image(0, 0, "gauge_dial")
    this.pointer = this.add.image(0, 0, "gauge_pointer")
    this.updateGauge()

    // Size the gauge relative to the canvas and keep it pinned to the canvas's
    // bottom-right corner.
    const layoutGauge = (width: number, height: number) => {
      // The canvas's size is in canvas pixels, but the gauge's limits are in
      // CSS pixels (see `pixelRatio`).
      const size = Phaser.Math.Clamp(
        Math.min(width, height) * GAUGE_SIZE_RATIO,
        MIN_GAUGE_SIZE * this.pixelRatio,
        FUEL_GAUGE_SIZE * this.pixelRatio,
      )
      const margin = size * MARGIN_RATIO
      const x = width - margin - size / 2
      const y = height - margin - size / 2
      for (const image of [dial, this.pointer]) {
        image.setDisplaySize(size, size).setPosition(x, y)
      }
    }
    layoutGauge(this.cameras.main.width, this.cameras.main.height)
    this.onResize(layoutGauge)

    const onPhaserSetVariable: Phaser.Events.PhaserSetVariable = key => {
      if (key === "fuel") this.updateGauge()
    }
    this.game.events.on(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.PHASER_SET_VARIABLE, onPhaserSetVariable)
    })
  }

  /** The current level's max fuel, or the default if it didn't specify one. */
  private get maxFuel() {
    return this.getVariable<number>("maxFuel", DEFAULT_MAX_FUEL)
  }

  /** The current level's current fuel, or the max fuel if it wasn't set. */
  private get fuel() {
    return this.getVariable<number>("fuel", this.maxFuel)
  }

  private updateGauge() {
    const t = Phaser.Math.Clamp(this.fuel / this.maxFuel, 0, 1)
    this.pointer.setAngle(Phaser.Math.Linear(EMPTY_ANGLE, FULL_ANGLE, t))
  }
}
