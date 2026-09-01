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
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 2
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
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 7
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
          // Row 8
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
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.top({
            col: 5,
            row: 7,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 3,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 305,
            y: 74,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 271,
            y: 143,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 166,
            y: 274,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 126,
            y: 200,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 169,
            y: 226,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 200,
            y: 388,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 249,
            y: 435,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 350,
            y: 299,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 384,
            y: 388,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 344,
            y: 344,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 409,
            y: 331,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 199,
            y: 440,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 256,
            y: 91,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 316,
            y: 120,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 125,
            y: -1,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 259,
            y: 1,
          }),
        ],
      },
    },
  },
})
