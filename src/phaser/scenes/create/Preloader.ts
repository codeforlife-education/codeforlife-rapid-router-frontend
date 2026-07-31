import { Delete as DeleteIcon } from "@mui/icons-material"

import * as layers from "../../layers"
import * as tilemaps from "../../tilemaps"
import * as tilesets from "../../tilesets"
import { SceneKeys, TILE_HEIGHT, TILE_WIDTH } from "../../globals"
import BasePreloader from "../BasePreloader"
import Level from "./Level"

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
      tilesets: [
        // Road
        tilesets.road.asphalt.crossroads,
        tilesets.road.asphalt.deadEnd,
        tilesets.road.asphalt.straight,
        tilesets.road.asphalt.tJunction,
        tilesets.road.asphalt.turn,
        tilesets.road.dirt.crossroads,
        tilesets.road.dirt.deadEnd,
        tilesets.road.dirt.straight,
        tilesets.road.dirt.tJunction,
        tilesets.road.dirt.turn,
        // Environment
        tilesets.environment.animal.cow,
        tilesets.environment.animal.pigeon,
        tilesets.environment.trafficLight.green,
        tilesets.environment.trafficLight.red,
        // Endpoints
        tilesets.endpoints.cfc.barn.black,
        tilesets.endpoints.cfc.barn.red,
        tilesets.endpoints.cfc.barn.snow,
        tilesets.endpoints.cfc.warehouse.default,
        tilesets.endpoints.cfc.warehouse.snow,
        tilesets.endpoints.house.common.blue,
        tilesets.endpoints.house.common.orange,
        tilesets.endpoints.house.common.straw,
        tilesets.endpoints.house.snow.blue,
        tilesets.endpoints.house.snow.orange,
        tilesets.endpoints.house.snow.straw,
        // Scenery
        tilesets.scenery.building.hospital,
        tilesets.scenery.building.house,
        tilesets.scenery.building.logCabin,
        tilesets.scenery.building.school,
        tilesets.scenery.building.shop,
        tilesets.scenery.nature.bush,
        tilesets.scenery.nature.crops,
        tilesets.scenery.nature.hay,
        tilesets.scenery.nature.pond,
        tilesets.scenery.nature.tree.oak,
        tilesets.scenery.nature.tree.pine,
        tilesets.scenery.other.solarPanel,
        tilesets.scenery.snow.building.hospital,
        tilesets.scenery.snow.building.school,
        tilesets.scenery.snow.building.shop,
        tilesets.scenery.snow.nature.bush,
        tilesets.scenery.snow.nature.crops,
        tilesets.scenery.snow.nature.pond,
        tilesets.scenery.snow.nature.tree.oak,
        tilesets.scenery.snow.nature.tree.pine,
        tilesets.scenery.snow.other.solarPanel,
      ],
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
