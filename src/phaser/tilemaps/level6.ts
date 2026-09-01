import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  layers: {
    tile: {
      road: {
        data: [
          ...layers.tile.data.fillManyRows({ rows: 1 }),
          // Row 2
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
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 3
          [
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tile
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 4
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 5
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 6
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
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
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 143,
            y: -35,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 56,
            y: -36,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 40,
            y: 6,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 104,
            y: 24,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 64,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 98,
            y: -15,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 389,
            y: 77,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 374,
            y: 150,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 378,
            y: 243,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 433,
            y: 221,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 441,
            y: 159,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 431,
            y: 58,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 356,
            y: 17,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 67,
            y: 256,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 193,
            y: 257,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 129,
            y: 255,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 65,
            y: 319,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 129,
            y: 319,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 193,
            y: 318,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 94,
            y: 258,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 154,
            y: 303,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 99,
            y: 307,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 168,
            y: 246,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 210,
            y: 285,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 94,
            y: -74,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 42,
            y: 292,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 50,
            y: 243,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 168,
            y: 339,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 237,
            y: 330,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 41,
            y: 344,
          }),
        ],
      },
    },
  },
})
