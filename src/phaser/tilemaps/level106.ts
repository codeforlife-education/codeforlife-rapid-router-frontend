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
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 7,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
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
            col: 0,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 8,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.pond({ x: 94, y: 311 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 263, y: 300 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 298, y: 300 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 191,
            y: 328,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 101,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 141,
            y: 186,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 351,
            y: 185,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 395,
            y: 188,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 428,
            y: 321,
          }),
        ],
      },
    },
  },
})
