import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "KIRSTY" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of a bottom-right turn road tile
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
            // 1 column of a bottom-left turn road tile
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
            // 1 column of a bottom-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (left, right, bottom)
            layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
            // 1 column of a bottom-left turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
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
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of a bottom-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
            // 1 column of a t-junction road tile (left, right, bottom)
            layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
            // 1 column of a top-left turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of a top-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of a t-junction road tile (top, right, bottom)
            layers.tile.data.IDs.Road.Dirt.TJunction.TOP_RIGHT_BOTTOM,
            // 1 column of a t-junction road tile (top, left, bottom)
            layers.tile.data.IDs.Road.Dirt.TJunction.TOP_LEFT_BOTTOM,
            // 1 column of a top-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
            // 1 column of a t-junction road tile (left, right, bottom)
            layers.tile.data.IDs.Road.Dirt.TJunction.LEFT_RIGHT_BOTTOM,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of a top-left turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
            // 1 column of a top-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of a t-junction road tile (top, left, right)
            layers.tile.data.IDs.Road.Dirt.TJunction.TOP_LEFT_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of a top-left turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 7
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of a top-right turn road tile
            layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
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
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
            // 1 column of a left-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.LEFT,
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
          ],
          // Row 8
          layers.tile.data.fillRow(),
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
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 3,
            y: 5,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 3,
            y: 398,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 1,
            y: 306,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 3,
            y: 197,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 5,
            y: 93,
          }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 497,
            y: 33,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 525,
            y: 107,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 557,
            y: 239,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 523,
            y: 239,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 488,
            y: 239,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 592,
            y: 239,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 575,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 540,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 506,
            y: 219,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 557,
            y: 197,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 521,
            y: 198,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 536,
            y: 177,
          }),
        ],
      },
    },
  },
})
