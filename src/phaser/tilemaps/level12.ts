import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 2
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 3
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 4
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 5
          [
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 6
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 7 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 4,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 148,
            y: 122,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 107,
            y: 135,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 118,
            y: 89,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 193,
            y: 141,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 225,
            y: 108,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 204,
            y: 75,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 177,
            y: 99,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 164,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 41,
            y: 393,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 65,
            y: 445,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: -17,
            y: 378,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: -24,
            y: 436,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 12,
            y: 447,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 143,
            y: 422,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 298,
            y: 396,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 252,
            y: 353,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 203,
            y: 402,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 287,
            y: 444,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 106,
            y: 371,
          }),
        ],
      },
    },
  },
})
