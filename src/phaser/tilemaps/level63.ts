import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "PAVEMENT" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 7
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 8
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 0,
            row: 6,
          }),
          layers.objectGroup.objects.endpoints.house.common.blue.top({
            col: 5,
            row: 6,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.building.hospital({
            x: 190,
            y: 250,
          }),
          layers.objectGroup.objects.scenery.building.school({
            x: 452,
            y: 256,
          }),
          layers.objectGroup.objects.scenery.building.shop({
            x: 486,
            y: 134,
          }),
          layers.objectGroup.objects.scenery.building.shop({
            x: 489,
            y: 365,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 368,
            y: 346,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 408,
            y: 331,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 394,
            y: 287,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 349,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 302,
            y: 284,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 167,
            y: 173,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 122,
            y: 174,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 122,
            y: 214,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 212,
            y: 172,
          }),
        ],
      },
    },
  },
})
