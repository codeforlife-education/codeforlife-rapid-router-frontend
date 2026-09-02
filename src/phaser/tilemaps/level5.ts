import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 2
          [
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
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
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
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 4
          [
            // 1 column1 of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 5 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 4 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 4,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 12,
            y: 90,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 86,
            y: 23,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 154,
            y: -42,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 33,
            y: 266,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 133,
            y: 198,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 216,
            y: 122,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 318,
            y: 52,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 299,
            y: -65,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 575,
            y: 367,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 483,
            y: 370,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 577,
            y: 276,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 576,
            y: 178,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 388,
            y: 370,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 572,
            y: -24,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 575,
            y: 77,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 285,
            y: 369,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 188,
            y: 369,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 81,
            y: 369,
          }),
        ],
      },
    },
  },
})
