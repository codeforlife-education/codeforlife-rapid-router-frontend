import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.bottom({
            col: 4,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 8,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 113,
            y: 115,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 113,
            y: 192,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 115,
            y: 265,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 320,
            y: 47,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 319,
            y: 123,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 320,
            y: 200,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 442,
            y: 318,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 499,
            y: 396,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 554,
            y: 180,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 560,
            y: 333,
          }),
        ],
      },
    },
  },
})
