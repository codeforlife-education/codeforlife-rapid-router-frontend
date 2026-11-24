import Phaser from "phaser"

import * as images from "../../images"
import * as sounds from "../../sounds"
import * as tilemaps from "../../tilemaps"
import {
  CRASH_PARTICLE_SIZE,
  FUEL_GAUGE_SIZE,
  SceneKeys,
  TEXTURE_RESOLUTION,
} from "../../globals"
import BasePreloader from "../BasePreloader"
import Level from "./Level"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Gameplay Scene.
 */
export default class extends BasePreloader {
  static readonly KEY = SceneKeys.Play.PRELOADER

  preload() {
    // The gauge isn't part of the (zoomable) level, so it's rendered at the
    // size the HUD displays it at, at most (in canvas pixels). Rendering it any
    // bigger would lose its fine detail once scaled down.
    const gaugeSize = FUEL_GAUGE_SIZE * this.pixelRatio
    this.load.svg("gauge_dial", images.URLs.HUD.FuelGauge.FUEL_GAUGE, {
      width: gaugeSize,
      height: gaugeSize,
    })
    this.load.svg("gauge_pointer", images.URLs.HUD.FuelGauge.POINTER, {
      width: gaugeSize,
      height: gaugeSize,
    })
    // The fire and smoke a character bursts into when it crashes - rendered at
    // a higher resolution, as the crash scales them (see `CharacterSprite`).
    const particleSize = CRASH_PARTICLE_SIZE * TEXTURE_RESOLUTION
    this.load.svg("particle_fire", images.URLs.Particles.FIRE, {
      width: particleSize,
      height: particleSize,
    })
    this.load.svg("particle_smoke", images.URLs.Particles.SMOKE, {
      width: particleSize,
      height: particleSize,
    })
    for (const [key, url] of Object.entries(sounds.URLs)) {
      this.load.audio(key, url)
    }
  }

  create() {
    // When all the assets have loaded, it's often worth creating global objects
    // here that the rest of the game can use. For example, you can define
    // global animations here, so we can use them in other scenes.

    void this.lazyLoadTilemap()
  }

  /**
   * Loads a predefined level by id if one was set, otherwise expands a
   * previously-exported (and possibly still-unsaved) level's Tiled JSON.
   */
  async lazyLoadTilemap() {
    let tilemap: tilemaps.OrthogonalTilemap
    const tilemapGroup = this.getVariable<tilemaps.TilemapGroup>("tilemapGroup")
    const levelId = this.getVariable<number>("levelId")
    if (tilemapGroup !== undefined && levelId !== undefined) {
      tilemap = (
        (await import(`../../tilemaps/${tilemapGroup}/level${levelId}.ts`)) as {
          default: tilemaps.OrthogonalTilemap
        }
      ).default
    } else {
      const exportedTilemap =
        this.getVariable<tilemaps.ExportedOrthogonalTilemap>("exportedLevel")!
      tilemap = tilemaps.importOrthogonal(exportedTilemap)
    }

    this.loadTilemap(tilemap)

    // Handle loading manually as we aren't leveraging Phaser's `preload`
    // lifecycle callback.
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.startLevel(Level)
    })
    this.load.start()
  }
}
