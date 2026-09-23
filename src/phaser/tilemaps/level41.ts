import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 3 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 3 }),
          // Row 4
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 6
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 7 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
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
            col: 5,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 63,
            y: 66,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 64,
            y: 131,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 75,
            y: 187,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 65,
            y: 322,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 59,
            y: 380,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 68,
            y: 447,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 388,
            y: 68,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 378,
            y: 132,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 328,
            y: 184,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 382,
            y: 446,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 446,
            y: 447,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 511,
            y: 448,
          }),
        ],
      },
    },
  },
})
