import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
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
            col: 1,
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 7,
            row: 3,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
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
          layers.objectGroup.objects.obstacles.trafficLight.red.right({
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
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 52, y: 235 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 333, y: 61 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 409,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 474, y: 90 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 468, y: 3 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 8, y: 444 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 130, y: 444 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 258, y: 442 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 386, y: 441 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 515, y: 442 }),
        ],
      },
    },
  },
})
