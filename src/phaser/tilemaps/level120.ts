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
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 1,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 3,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 188,
            y: 184,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 128,
            y: 112,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 249,
            y: 118,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 104, y: 8 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 134,
            y: 58,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 189,
            y: 120,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 17,
            y: 436,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 95, y: 445 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 138,
            y: 397,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 452,
            y: 447,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 408,
            y: 390,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 446,
            y: 329,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 281,
            y: 376,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 193,
            y: 436,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 57,
            y: 376,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 330,
            y: 418,
          }),
        ],
      },
    },
  },
})
