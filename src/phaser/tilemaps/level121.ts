import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
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
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 5 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 2,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 5,
            row: 7,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 98, y: 143 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 21, y: 216 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 121,
            y: 258,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 517,
            y: 26,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 568,
            y: 68,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 460,
            y: -3,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 444,
            y: 83,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({ x: 377, y: 4 }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 588,
            y: 134,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 578,
            y: 10,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 523,
            y: -31,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 518,
            y: 124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 567,
            y: 218,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 87, y: 214 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 52, y: 175 }),
        ],
      },
    },
  },
})
