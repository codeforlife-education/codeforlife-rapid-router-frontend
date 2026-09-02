import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
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
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 2
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
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 3 columns of horizontal straight road tiles (incl. CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of crossroads road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
              cols: 1,
            }),
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
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
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a top-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 5
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
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 2 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
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
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 1,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 7,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 1,
            row: 5,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 4,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.right({
            col: 4,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 4,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.bottom({
            col: 4,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 92,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 154,
            y: 210,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 108,
            y: 260,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 52,
            y: 235,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 333,
            y: 61,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 409,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 474,
            y: 90,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 468,
            y: 3,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 8,
            y: 444,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 130,
            y: 444,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 258,
            y: 442,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 386,
            y: 441,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 515,
            y: 442,
          }),
        ],
      },
    },
  },
})
