import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 2
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 3
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 4
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 5
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a top-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of a top-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 6
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 7
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.bottom({
            col: 1,
            row: 0,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.right({
            col: 5,
            row: 4,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.top({
            col: 5,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.top({
            col: 3,
            row: 2,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.bottom({
            col: 4,
            row: 1,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 5,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 3,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 150,
            y: 95,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 149,
            y: 134,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 149,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 149,
            y: 220,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 497,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 264,
            y: -55,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 550,
            y: 243,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 409,
            y: -64,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 447,
            y: 193,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 576,
            y: 142,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 471,
            y: -64,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 576,
            y: -61,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 466,
            y: -18,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 566,
            y: 15,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 534,
            y: -35,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 576,
            y: 63,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 421,
            y: 48,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 508,
            y: 129,
          }),
        ],
      },
    },
  },
})
