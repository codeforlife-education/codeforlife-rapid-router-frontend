import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 9 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 9 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 8,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 2,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 9,
            row: 6,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.pond({ x: 409, y: 106 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 330, y: 49 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 520, y: 0 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 483,
            y: 152,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 507, y: 71 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 110 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 160 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 210 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 255 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 45, y: 300 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 340, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 245, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 195, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 100, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 150, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 295, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 385, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 435, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 480, y: 340 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 576,
            y: 29,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 294, y: 0 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 576,
            y: 110,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 434, y: 0 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 565,
            y: 241,
          }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 95, y: 110 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 145, y: 110 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 49, y: 0 }),
        ],
      },
    },
  },
})
