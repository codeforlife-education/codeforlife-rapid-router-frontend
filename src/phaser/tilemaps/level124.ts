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
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 6,
            }),
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 6,
            }),
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 6,
            }),
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 6,
            }),
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [
            ...layers.tile.data.fillRow({ cols: 1 }),
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
            layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.bottom({
            col: 1,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.right({
            col: 7,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 0,
            y: 445,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 189,
            y: 3,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 65,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 0,
            y: 65,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 0,
            y: 195,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 0,
            y: 321,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 576,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 448,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 322,
            y: 0,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 576,
            y: 385,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 514,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 384,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 255,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 127,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 576,
            y: 129,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 574,
            y: 256,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 440,
            y: 178,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 438,
            y: 232,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 439,
            y: 279,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 438,
            y: 330,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 438,
            y: 376,
          }),
        ],
      },
    },
  },
})
