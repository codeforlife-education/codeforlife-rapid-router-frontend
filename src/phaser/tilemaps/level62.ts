import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 4
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 5
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of a top-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 1,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.right({
            col: 6,
            row: 5,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 3,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.left({
            col: 5,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.left({
            col: 6,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 6,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [],
      },
    },
  },
})
