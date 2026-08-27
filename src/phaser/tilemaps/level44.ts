import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
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
        objects: [],
      },
    },
  },
})
