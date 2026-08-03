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
    tilesets.scenery.common.bush,
  ],
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 2
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 4
          [
            // 1 column1 of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 5 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 4 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 4,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          // layers.objectGroup.objects.scenery.common.tree1({ col: 1, row: -2 }),
          // layers.objectGroup.objects.scenery.common.tree1({ col: 2, row: 0 }),
          // layers.objectGroup.objects.scenery.common.tree1({ col: 3, row: -2 }),
          // layers.objectGroup.objects.scenery.common.tree1({ col: 3, row: -1 }),
          // layers.objectGroup.objects.scenery.common.tree2({ col: 4, row: -2 }),
          // layers.objectGroup.objects.scenery.common.tree1({ col: 4, row: -1 }),
        ],
      },
    },
  },
})
