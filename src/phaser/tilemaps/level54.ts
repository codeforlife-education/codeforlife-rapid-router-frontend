import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 4
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
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 5
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 8 columns of crossroads road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 8,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 7
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 0,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 9,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 19,
            y: 150,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 26,
            y: 386,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 189,
            y: 127,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 460,
            y: 415,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 416,
            y: 140,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 78,
            y: 39,
          }),
          layers.objectGroup.objects.scenery.nature.pond({
            x: 266,
            y: 434,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 415,
            y: 197,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 288,
            y: 196,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 159,
            y: 195,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 160,
            y: 319,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 288,
            y: 319,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 416,
            y: 318,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 31,
            y: 321,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 32,
            y: 195,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 543,
            y: 319,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 545,
            y: 196,
          }),
        ],
      },
    },
  },
})
