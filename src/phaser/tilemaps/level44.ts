import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 4 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 4 }),
          // Row 5
          [
            // 1 column of a right-facing dead end road tile (CFC)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 5 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 5,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 3 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 0,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 4,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 4,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 302,
            y: 9,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 340,
            y: 49,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 294,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 392,
            y: 4,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 89,
            y: 2,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 134,
            y: 56,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 29,
            y: 59,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 43,
            y: 125,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 99,
            y: 109,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 170,
            y: 435,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 111,
            y: 438,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 41,
            y: 413,
          }),
        ],
      },
    },
  },
})
