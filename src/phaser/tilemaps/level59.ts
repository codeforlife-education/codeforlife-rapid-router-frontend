import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
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
            // 1 column of bottom-right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
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
            // 1 column of bottom-left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
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
            // 1 column of a top-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a top-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a top-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 4
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of a crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of a crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 1 column of a crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a bottom-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of top-right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (no house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
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
          layers.objectGroup.objects.endpoints.cfc.barn.red.right({
            col: 0,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.top({
            col: 7,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 6,
            y: 121,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 520,
            y: 192,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 456,
            y: 124,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 456,
            y: 262,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 106,
            y: 235,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 148,
            y: 235,
          }),
        ],
      },
    },
  },
})
