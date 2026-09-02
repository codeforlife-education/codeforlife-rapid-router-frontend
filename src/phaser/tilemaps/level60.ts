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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 2
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a t-junction road tile (top, right, bottom, incl. house)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a top-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 5
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
          // Row 6
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 7
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of a top-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
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
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 1,
            row: 1,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.pond({
            x: 167,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 264,
            y: 212,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 115,
            y: 256,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 134,
            y: 131,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 207,
            y: 264,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 266,
            y: 119,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 505,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 480,
            y: 251,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 516,
            y: 245,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 116,
            y: 20,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 257,
            y: 361,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 211,
            y: 362,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 166,
            y: 362,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 119,
            y: 362,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 72,
            y: 362,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 162,
            y: 20,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 207,
            y: 19,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 252,
            y: 19,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 298,
            y: 19,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 346,
            y: 18,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 391,
            y: 18,
          }),
        ],
      },
    },
  },
})
