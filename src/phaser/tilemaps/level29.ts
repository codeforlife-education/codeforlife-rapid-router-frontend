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
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 5 }),
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
            col: 4,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 61,
            y: -63,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 128,
            y: -63,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 192,
            y: -64,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 164,
            y: -9,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 95,
            y: -8,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 134,
            y: 44,
          }),
        ],
      },
    },
  },
})
