import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
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
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 107,
            y: 188,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 168,
            y: 190,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 233,
            y: 191,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 365,
            y: 190,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 298,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 19,
            y: 43,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 323,
            y: -97,
          }),
        ],
      },
    },
  },
})
