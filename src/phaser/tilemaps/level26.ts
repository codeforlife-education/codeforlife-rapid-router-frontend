import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 1 }),
          // Row 2
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of vertical straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 3
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 5
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
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
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
          // Row 6 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 3 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.bottom({
            col: 4,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 8,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 113,
            y: 115,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 113,
            y: 192,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 115,
            y: 265,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 320,
            y: 47,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 319,
            y: 123,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 320,
            y: 200,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 442,
            y: 318,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 499,
            y: 396,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 554,
            y: 180,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 560,
            y: 333,
          }),
        ],
      },
    },
  },
})
