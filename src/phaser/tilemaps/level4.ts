import * as layers from "../layers"
import * as tilemaps from "./tilemaps"
import * as tilesets from "../tilesets"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  tilesets: [
    tilesets.road.asphalt.straight,
    tilesets.road.asphalt.deadEnd,
    tilesets.road.asphalt.turn,
    tilesets.endpoints.cfc.warehouse.default,
    tilesets.endpoints.house.common.orange,
    tilesets.scenery.common.tree1,
    tilesets.scenery.common.tree2,
  ],
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 2
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 columns of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 3
          [
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 5 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 4,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.common.tree1({ col: 1, row: -2 }),
          layers.objectGroup.objects.scenery.common.tree1({ col: 2, row: 0 }),
          layers.objectGroup.objects.scenery.common.tree1({ col: 3, row: -2 }),
          layers.objectGroup.objects.scenery.common.tree1({ col: 3, row: -1 }),
          layers.objectGroup.objects.scenery.common.tree2({ col: 4, row: -2 }),
          layers.objectGroup.objects.scenery.common.tree1({ col: 4, row: -1 }),
        ],
      },
    },
  },
})
