import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW", character: "VAN" },
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
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 2
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of a t-junction road tile (left, right, bottom)
            layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of a t-junction road tile (top, left, right)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of a left-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
          ],
          // Row 4
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
          ],
          // Row 5
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 6
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (top, left, bottom)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (top, left, right)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          // Row 7
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (top, left, bottom)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 8
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
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
