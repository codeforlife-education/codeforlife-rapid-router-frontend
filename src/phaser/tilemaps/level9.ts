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
    tilesets.scenery.common.bush,
  ],
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 2 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 5 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 5,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 4
          [
            // 1 column1 of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 6 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 6,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 3 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 6,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 8,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          // layers.objectGroup.objects.scenery.common.tree2({ col: 0, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 1, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 2, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 3, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 4, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 5, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 6, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 7, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 8, row: 1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 9, row: 1 }),
        ],
      },
    },
  },
})
