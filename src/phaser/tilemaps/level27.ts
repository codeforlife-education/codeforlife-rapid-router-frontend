import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "DEE" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of bottom-right-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 2
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of top-left-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of a bottom-facing dead end road tile (house)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.BOTTOM,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 6
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of top-right-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
            // 1 column of bottom-left-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of bottom-right-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
            // 1 column of top-left-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 7
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of top-right-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of top-left-turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 8 - 10 columns of empty tiles
          layers.tile.data.fillRow(),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.right({
            col: 4,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.right({
            col: 8,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 414,
            y: 223,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 141,
            y: 222,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 221,
            y: 246,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 367,
            y: 331,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 390,
            y: 58,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 306,
            y: 59,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 227,
            y: 59,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 137,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 326,
            y: 195,
          }),
        ],
      },
    },
  },
})
