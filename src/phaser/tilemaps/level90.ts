import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 9,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 0,
            row: 6,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.pond({ x: 121, y: 232 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 508,
            y: 212,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 521,
            y: 266,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 556,
            y: 199,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 214,
            y: 184,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 258,
            y: 191,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 123,
            y: 186,
          }),
        ],
      },
    },
  },
})
