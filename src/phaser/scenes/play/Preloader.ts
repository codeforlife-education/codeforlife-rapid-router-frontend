import Phaser from "phaser"

import * as images from "../../images"
import * as tilemaps from "../../tilemaps"
import BasePreloader from "../BasePreloader"
import Level from "./Level"
import { SceneKeys } from "../../globals"

const VAN_SCALE = 0.045

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Gameplay Scene.
 */
export default class extends BasePreloader {
  static readonly KEY = SceneKeys.Play.PRELOADER

  create() {
    // When all the assets have loaded, it's often worth creating global objects
    // here that the rest of the game can use. For example, you can define
    // global animations here, so we can use them in other scenes.

    // TODO: dynamically load character from tilemap property
    this.load.svg("Character.VAN", images.URLs.Character.TopView.VAN, {
      scale: VAN_SCALE,
    })
    this.load.svg(
      "Character.VAN_WRECKAGE",
      images.URLs.Character.TopView.VAN_WRECKAGE,
      { scale: VAN_SCALE * 4.15 },
    )

    void this.lazyLoadTilemap()
  }

  /**
   * Loads a predefined level by id if one was set, otherwise expands a
   * previously-exported (and possibly still-unsaved) level's Tiled JSON.
   */
  async lazyLoadTilemap() {
    let tilemap: tilemaps.OrthogonalTilemap
    const levelId = this.getVariable<number>("levelId")
    if (levelId !== undefined) {
      tilemap = (
        (await import(`../../tilemaps/level${levelId}.ts`)) as {
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
