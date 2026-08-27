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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
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
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 2
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
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
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.LEFT,
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.TOP_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.TJunction.TOP_LEFT_RIGHT,
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
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 7
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a top-right turn road tile
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
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
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
          layers.objectGroup.objects.endpoints.cfc.barn.red.left({
            col: 8,
            row: 6,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.top({
            col: 5,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [],
      },
    },
  },
})
