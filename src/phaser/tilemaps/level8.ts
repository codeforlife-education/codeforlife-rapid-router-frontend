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
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 2
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 3
          [
            // 1 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
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
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          // Row 5
          [
            // 1 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 2 column of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 6
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of a top-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 7 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 3,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 4,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 310,
            y: 104,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 422,
            y: 122,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 71,
            y: 7,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 25,
            y: 70,
          }),
          layers.objectGroup.objects.scenery.nature.pond({
            x: 364,
            y: 213,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 246,
            y: 188,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 310,
            y: 104,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 422,
            y: 122,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 71,
            y: 7,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 25,
            y: 70,
          }),
          layers.objectGroup.objects.scenery.nature.pond({
            x: 364,
            y: 213,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 246,
            y: 188,
          }),
        ],
      },
    },
  },
})
