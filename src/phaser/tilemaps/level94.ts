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
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
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
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.top({
            col: 5,
            row: 7,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.right({
            col: 3,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({ x: 269, y: 63 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 370, y: 64 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 331, y: 126 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 148, y: 44 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 148, y: 68 }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 260,
            y: 120,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 316,
            y: 198,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 311,
            y: 244,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 183,
            y: 239,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 161,
            y: 284,
          }),
        ],
      },
    },
  },
})
