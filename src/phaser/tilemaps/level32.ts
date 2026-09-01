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
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 2
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 3
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 4
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 5
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 6
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 7
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 8
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of a top-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 2,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 5,
            row: 7,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 98,
            y: 143,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 21,
            y: 216,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 121,
            y: 258,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 517,
            y: 26,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 568,
            y: 68,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 460,
            y: -3,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 444,
            y: 83,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 377,
            y: 4,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 588,
            y: 134,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 578,
            y: 10,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 523,
            y: -31,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 518,
            y: 124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 567,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 87,
            y: 214,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 52,
            y: 175,
          }),
        ],
      },
    },
  },
})
