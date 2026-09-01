import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "PAVEMENT" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
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
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          // Row 3
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
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
            // 1 column of crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 6
          [
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
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
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 7
          [
            // 1 column of a top-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 9 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 9 }),
          ],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 3,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.blue.top({
            col: 9,
            row: 1,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.top({
            col: 3,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.bottom({
            col: 3,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.left({
            col: 3,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.right({
            col: 3,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 7,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.bottom({
            col: 7,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 7,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.building.school({
            x: 321,
            y: 136,
          }),
          layers.objectGroup.objects.scenery.building.hospital({
            x: 316,
            y: 264,
          }),
          layers.objectGroup.objects.scenery.building.shop({
            x: 100,
            y: 241,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 26,
            y: 151,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 24,
            y: 191,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 22,
            y: 236,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 20,
            y: 278,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 67,
            y: 151,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 108,
            y: 150,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 152,
            y: 149,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 291,
            y: 339,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 240,
            y: 278,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 392,
            y: 280,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 393,
            y: 240,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 243,
            y: 238,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 340,
            y: 339,
          }),
          layers.objectGroup.objects.scenery.building.shop({
            x: 481,
            y: 109,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 488,
            y: 174,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 489,
            y: 221,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 488,
            y: 267,
          }),
        ],
      },
    },
  },
})
