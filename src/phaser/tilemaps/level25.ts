import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 1 }),
          // Row 2
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 4
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
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
          // Row 5
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
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
            col: 0,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 8,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 189,
            y: 71,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 258,
            y: 135,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 132,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 69,
            y: 124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 381,
            y: 198,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 257,
            y: 255,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 318,
            y: 317,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 448,
            y: 260,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 4,
            y: 378,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 3,
            y: 444,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 0,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 566,
            y: 8,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 417,
            y: 7,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 491,
            y: 4,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 566,
            y: 80,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 568,
            y: 152,
          }),
        ],
      },
    },
  },
})
