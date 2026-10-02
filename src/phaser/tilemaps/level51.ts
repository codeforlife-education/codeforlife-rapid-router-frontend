import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 2
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 4
          [
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (top, left, right)
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 5
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 3 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 0,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 8,
            row: 1,
          }),
        ],
      },
      scenery: {
        objects: [],
      },
    },
  },
})
