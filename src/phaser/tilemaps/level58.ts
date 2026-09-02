import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "SNOW" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 2
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 5 columns of horizontal straight road tiles (incl. CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 5,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 3
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 6
          [
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.left({
            col: 6,
            row: 1,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 5,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 509,
            y: 13,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 510,
            y: 111,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 511,
            y: 214,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 512,
            y: 328,
          }),
          layers.objectGroup.objects.scenery.nature.snow.pond({
            x: 199,
            y: 401,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 93,
            y: 15,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 157,
            y: 15,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 220,
            y: 17,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 279,
            y: 17,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 337,
            y: 17,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 36,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 97,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 221,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 160,
            y: 301,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 272,
            y: 303,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 511,
            y: 428,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 31,
            y: 17,
          }),
        ],
      },
    },
  },
})
