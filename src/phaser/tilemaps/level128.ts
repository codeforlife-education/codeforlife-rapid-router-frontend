import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
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
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 2,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 7,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 255,
            y: 64,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 401,
            y: 44,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 561,
            y: 2,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 512,
            y: 115,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 257,
            y: 166,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 252,
            y: 271,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 138,
            y: 61,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 250,
            y: 386,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 364,
            y: 387,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 484,
            y: 385,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 576,
            y: 322,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 576,
            y: 212,
          }),
        ],
      },
    },
  },
})
