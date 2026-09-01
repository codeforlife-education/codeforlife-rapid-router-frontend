import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
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
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 75,
            y: -64,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 156,
            y: -62,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 35,
            y: 4,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 118,
            y: 1,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 75,
            y: 70,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 307,
            y: 64,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 264,
            y: 130,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 348,
            y: 129,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 312,
            y: 195,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 396,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 265,
            y: 264,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 361,
            y: 263,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 451,
            y: 263,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 170,
            y: 261,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 219,
            y: 195,
          }),
        ],
      },
    },
  },
})
