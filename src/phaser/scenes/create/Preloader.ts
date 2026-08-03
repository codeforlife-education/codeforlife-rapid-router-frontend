import { Delete as DeleteIcon } from "@mui/icons-material"

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
    const tilemap = tilemaps.makeOrthogonal({
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
  }

  create() {
    this.startLevel(Level)
  }
}
