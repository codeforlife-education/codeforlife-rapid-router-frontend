import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a bottom-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 4
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 5
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.bottom({
            col: 6,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 2,
            row: 1,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.right({
            col: 4,
            row: 4,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 494,
            y: 19,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 576,
            y: 84,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 494,
            y: 127,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 419,
            y: 44,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 519,
            y: 79,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 551,
            y: 4,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 452,
            y: -26,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 14,
            y: 403,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 64,
            y: 352,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 97,
            y: 419,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 460,
            y: 305,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 419,
            y: 382,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 483,
            y: 366,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 2,
            y: 49,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 38,
            y: 2,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 17,
            y: 88,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 71,
            y: 13,
          }),
        ],
      },
    },
  },
})
