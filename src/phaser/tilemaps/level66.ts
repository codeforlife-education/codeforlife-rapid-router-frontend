import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" }, // character: "DEE"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.BOTTOM,
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 7
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 1,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.right({
            col: 1,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 576,
            y: 253,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 456,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 544,
            y: 119,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 471,
            y: 61,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 559,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 389,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 244,
            y: 8,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 576,
            y: 66,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 325,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 376,
            y: 78,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 509,
            y: 22,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 301,
            y: 335,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 278,
            y: 273,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 227,
            y: 273,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 176,
            y: 274,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 123,
            y: 274,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 458,
            y: 335,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 407,
            y: 335,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 355,
            y: 335,
          }),
        ],
      },
    },
  },
})
