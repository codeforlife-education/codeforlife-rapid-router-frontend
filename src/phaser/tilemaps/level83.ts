import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
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
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 6 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 6 }),
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
          layers.objectGroup.objects.endpoints.cfc.barn.red.bottom({
            col: 4,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.right({
            col: 3,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 244,
            y: 182,
          }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 146, y: 194 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 106, y: 194 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 67, y: 194 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 126, y: 169 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 84, y: 169 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 106, y: 143 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 130, y: 67 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 130, y: 3 }),
        ],
      },
    },
  },
})
