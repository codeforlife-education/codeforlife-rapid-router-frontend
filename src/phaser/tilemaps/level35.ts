import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 - 10 columns of empty tiles
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 3
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
          // Row 4
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
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
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
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
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a right-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 8 - 10 columns of empty tiles
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 8,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 1,
            row: 6,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 438,
            y: 257,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 310,
            y: 258,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 395,
            y: 264,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 346,
            y: 250,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 369,
            y: 127,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 426,
            y: 127,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 325,
            y: 117,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 397,
            y: 124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 475,
            y: 120,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 236,
            y: 229,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 196,
            y: 294,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 269,
            y: -7,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 351,
            y: 8,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 447,
            y: -8,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 307,
            y: 12,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 404,
            y: 8,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 486,
            y: 2,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 525,
            y: -20,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 575,
            y: 5,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 571,
            y: 253,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 575,
            y: 77,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 575,
            y: 115,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 564,
            y: 164,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 568,
            y: 211,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 531,
            y: 139,
          }),
        ],
      },
    },
  },
})
