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
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 2,
            }),
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.left({
            col: 7,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 6,
            row: 7,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.bush({ x: 554, y: 29 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 555, y: 156 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 555, y: 272 }),
          layers.objectGroup.objects.scenery.nature.bush({ x: 553, y: 390 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 428,
            y: 252,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 347,
            y: 255,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 124, y: 3 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 218,
            y: -3,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 56, y: 19 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 120,
            y: 416,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 40,
            y: 393,
          }),
        ],
      },
    },
  },
})
