import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 2 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
          // Row 3
          [
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 4
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a top-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
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
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 2,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 0,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 64,
            y: 66,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 129,
            y: 66,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 192,
            y: 61,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 257,
            y: 58,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 319,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 385,
            y: 62,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 451,
            y: 63,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 515,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 578,
            y: 63,
          }),
        ],
      },
    },
  },
})
