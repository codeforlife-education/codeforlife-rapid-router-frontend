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
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
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
            col: 0,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 6,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 391,
            y: 84,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 381, y: 33 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 457,
            y: 157,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 417,
            y: 238,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 384,
            y: 162,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 417,
            y: 129,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 234,
            y: 265,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 182,
            y: 284,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 132,
            y: 267,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 52, y: 202 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 29, y: 241 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 149,
            y: 221,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 408,
            y: 192,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 56,
            y: 283,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 186,
            y: 243,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 105,
            y: 200,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 83, y: 234 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 82, y: 68 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 150,
            y: 10,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 66, y: 8 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 116, y: 42 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 45, y: 48 }),
        ],
      },
    },
  },
})
