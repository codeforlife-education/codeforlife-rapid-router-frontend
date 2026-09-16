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
            ...layers.tile.data.fillRow({ cols: 6 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 4 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 6 }),
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
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 7,
            row: 1,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.pond({
            x: 284,
            y: 78,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 264,
            y: 33,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 330,
            y: 31,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 444,
            y: 230,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 414,
            y: 261,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 399,
            y: 216,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 410,
            y: 170,
          }),
        ],
      },
    },
  },
})
