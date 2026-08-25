import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  RotateRight as RotateRightIcon,
  ThreeSixty as ThreeSixtyIcon,
} from "@mui/icons-material"

import * as layers from "../../layers"
import * as tilemaps from "../../tilemaps"
import { SceneKeys, TILE_HEIGHT, TILE_WIDTH } from "../../globals"
import BasePreloader from "../BasePreloader"
import Level from "./Level"
import { default as tilesets } from "../../tilesets"

/**
 * The Preloader Scene is responsible for loading all the assets required for
 * the game. It typically displays a loading bar or progress indicator to inform
 * the player about the loading progress. Once all assets are loaded, the
 * Preloader Scene transitions to the Level Scene.
 */
export default class extends BasePreloader {
  static readonly KEY = SceneKeys.Create.PRELOADER

  preload() {
    // If a level's Tiled JSON was set by React (i.e. the user chose to load an
    // existing level), use it instead of a blank tilemap.
    const exportedTilemap =
      this.getVariable<tilemaps.ExportedOrthogonalTilemap>("exportedLevel")
    const tilemap: tilemaps.OrthogonalTilemap = exportedTilemap
      ? {
          ...exportedTilemap,
          // We want all the tilesets to be loaded, even if the level doesn't
          // use them all.
          tilesets,
          // Remove the objects so Phaser doesn't create them. Instead, the
          // Level Scene's managers recreate them (from the minimal data
          // still in the registry) so their states stay in sync.
          layers: exportedTilemap.layers.map(layer =>
            layer.type === "objectgroup" ? { ...layer, objects: [] } : layer,
          ) as tilemaps.OrthogonalTilemap["layers"],
        }
      : tilemaps.makeOrthogonal({
          properties: { background: "GRASS" },
          tilesets,
          layers: {
            tile: { road: { data: layers.tile.data.fillManyRows() } },
            objectGroup: { endpoints: { objects: [] } },
          },
        })

    this.loadTilemap(tilemap)

    this.loadMuiIcon("delete-icon", DeleteIcon, {
      width: TILE_WIDTH / 3,
      height: TILE_HEIGHT / 3,
    })
    this.loadMuiIcon("rotate-right-icon", RotateRightIcon, {
      width: TILE_WIDTH / 3,
      height: TILE_HEIGHT / 3,
    })
    this.loadMuiIcon("clear-icon", ClearIcon, {
      width: TILE_WIDTH / 3,
      height: TILE_HEIGHT / 3,
    })
    this.loadMuiIcon("three-sixty-icon", ThreeSixtyIcon, {
      width: TILE_WIDTH / 3,
      height: TILE_HEIGHT / 3,
    })
  }

  create() {
    this.startLevel(Level)
  }
}
