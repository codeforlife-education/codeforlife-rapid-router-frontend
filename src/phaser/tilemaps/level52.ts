import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          layers.tile.data.fillRow(),
          // Row 2
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 5
          [
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            layers.tile.data.IDs.EMPTY,
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 1 column of horizontal straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 7
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 8
          layers.tile.data.fillRow(),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 0,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 7,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 19,
            y: 113,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 124,
            y: 50,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 333,
            y: 62,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 417,
            y: 136,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 47,
            y: 384,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 170,
            y: 447,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 341,
            y: 442,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 449,
            y: 378,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 156,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 207,
            y: 217,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 253,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 300,
            y: 217,
          }),
          layers.objectGroup.objects.scenery.nature.snow.pond({
            x: 271,
            y: 319,
          }),
        ],
      },
    },
  },
})
