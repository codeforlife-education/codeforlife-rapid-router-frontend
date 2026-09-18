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
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
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
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.pond({ x: 141, y: 253 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 345,
            y: 84,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 364,
            y: 118,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 319,
            y: 130,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 116,
            y: 342,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 144,
            y: 302,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 102,
            y: 291,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 200,
            y: 285,
          }),
        ],
      },
    },
  },
})
