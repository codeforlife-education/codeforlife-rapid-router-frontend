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
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 433,
            y: 185,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 448,
            y: 291,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 337,
            y: 262,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 531,
            y: 83,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 500,
            y: 264,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 416,
            y: 86,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 398,
            y: 234,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 485,
            y: 180,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 548,
            y: 212,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 532,
            y: 137,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 98,
            y: -44,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 3,
            y: 33,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 55,
            y: 22,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 41,
            y: -42,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 252,
            y: 314,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 271,
            y: 159,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 381,
            y: 329,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 483,
            y: 124,
          }),
        ],
      },
    },
  },
})
