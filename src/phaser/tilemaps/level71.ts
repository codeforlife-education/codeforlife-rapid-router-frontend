import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.top({
            col: 1,
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 3,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 277,
            y: 172,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 298,
            y: 74,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 360,
            y: 41,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 74,
            y: 297,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 303,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 19,
            y: 339,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 191,
            y: 370,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 81,
            y: 353,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 228,
            y: 401,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: -16,
            y: 371,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 42,
            y: 400,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 115,
            y: 443,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 58,
            y: 464,
          }),
        ],
      },
    },
  },
})
