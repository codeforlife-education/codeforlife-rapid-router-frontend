import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 8 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 6,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
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
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 6,
            row: 1,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.bush({ x: 448, y: 254 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 254, y: 257 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 156, y: 259 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 449, y: 154 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 447, y: 63 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 157, y: 386 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 259, y: 383 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 358, y: 385 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 452, y: 384 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 572, y: 383 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 575, y: 257 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 577, y: 153 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 573, y: 62 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 4, y: 5 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 10, y: 67 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 0, y: 120 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 56, y: 28 }),
        ],
      },
    },
  },
})
