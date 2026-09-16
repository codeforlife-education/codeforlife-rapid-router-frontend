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
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 2 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 6 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.top({
            col: 6,
            row: 6,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.right({
            col: 4,
            row: 4,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.animal.cow.top({
            col: 4,
            row: 1,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.right({
            col: 2,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.right({
            col: 6,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({ x: 40, y: 127 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 40, y: 192 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 40, y: 259 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 461, y: 28 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 461, y: 92 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 461, y: 157 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 461, y: 228 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 461, y: 307 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 258,
            y: 206,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 282,
            y: 147,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 84, y: 33 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 397, y: 7 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 320,
            y: 353,
          }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 335,
            y: 139,
          }),
        ],
      },
    },
  },
})
