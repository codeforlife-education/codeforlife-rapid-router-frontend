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
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 6,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 8 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 2,
            }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.left({
            col: 8,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.top({
            col: 3,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({ x: 150, y: 127 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 150, y: 191 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 152, y: 257 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 254, y: 128 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 255, y: 191 }),
          layers.objectGroup.objects.scenery.nature.crops({ x: 255, y: 257 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 1, y: 133 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 260,
            y: 446,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 49, y: 430 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 9, y: 291 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 352,
            y: 335,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 17, y: 22 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 317, y: 8 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 151, y: 0 }),
          layers.objectGroup.objects.scenery.nature.tree.oak({ x: 458, y: 0 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 286 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 252 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 214 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 179 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 140 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 103 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 321 }),
          layers.objectGroup.objects.scenery.nature.hay({ x: 430, y: 360 }),
        ],
      },
    },
  },
})
