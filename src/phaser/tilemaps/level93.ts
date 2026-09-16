import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS", character: "VAN" },
  layers: {
    tile: {
      road: {
        data: [
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 8,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.right({
            col: 0,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.top({
            col: 9,
            row: 3,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.animal.cow.top({
            col: 2,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.top({
            col: 5,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.top({
            col: 7,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({ x: 95, y: 257 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 255, y: 235 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 255, y: 260 }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 199,
            y: 250,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 364,
            y: 118,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 419,
            y: 120,
          }),
        ],
      },
    },
  },
})
