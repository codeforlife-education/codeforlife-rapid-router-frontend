import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "PAVEMENT", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 5,
            }),
            layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 8,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.blue.top({
            col: 8,
            row: 6,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.building.shop({
            x: 421,
            y: 302,
          }),
          layers.objectGroup.objects.scenery.building.hospital({
            x: 132,
            y: 312,
          }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 197, y: 100 }),
          layers.objectGroup.objects.scenery.building.school({
            x: 259,
            y: 134,
          }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 47, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 47, y: 302 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 47, y: 260 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 212, y: 340 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 212, y: 302 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 212, y: 260 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 418, y: 15 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 465, y: 15 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 175, y: 235 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 132, y: 235 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 87, y: 235 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 562, y: 111 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 514, y: 111 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 468, y: 111 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 562, y: 15 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 514, y: 15 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 562, y: 62 }),
        ],
      },
    },
  },
})
