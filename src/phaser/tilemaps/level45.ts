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
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 6 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 6,
            }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 7,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 0,
            row: 4,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.right({
            col: 4,
            row: 4,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.right({
            col: 3,
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
