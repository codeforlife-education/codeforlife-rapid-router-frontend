import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 2
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
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
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
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
          ],
          // Row 5
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a right-facing dead end road tile (decorative)
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
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          // Row 7
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
          ],
          // Row 8
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
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 1,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 9,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 465,
            y: 187,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 383,
            y: 192,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 322,
            y: 58,
          }),
          layers.objectGroup.objects.scenery.nature.snow.pond({
            x: 28,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 448,
            y: 1,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 215,
            y: 452,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 181,
            y: 428,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 151,
            y: 396,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 124,
            y: 362,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 387,
            y: 428,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 350,
            y: 456,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 3,
            y: 122,
          }),
        ],
      },
    },
  },
})
