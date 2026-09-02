import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 4
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 5
          [
            // 7 columns of horizontal straight road tiles (incl. CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 6,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 7
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
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
