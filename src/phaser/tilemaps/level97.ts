import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 2,
            }),
            ...layers.tile.data.fillRow({ cols: 2 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 2,
            }),
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 2,
            }),
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.top({
            col: 7,
            row: 6,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 5,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 193,
            y: 68,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 269,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 339,
            y: 64,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 77,
            y: 182,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 60,
            y: 256,
          }),
        ],
      },
    },
  },
})
