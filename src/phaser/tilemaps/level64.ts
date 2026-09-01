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
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 4
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.VERTICAL,
              cols: 1,
            }),
          ],
          // Row 6
          [
            // 1 column of a right-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Dirt.DeadEnd.RIGHT,
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
          ],
          // Row 7
          [
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of left-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Dirt.Turn.TOP_LEFT,
              cols: 1,
            }),
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
          ],
          // Row 8
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.right({
            col: 1,
            row: 3,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.top({
            col: 0,
            row: 5,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({
            x: 202,
            y: 259,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 305,
            y: 259,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 403,
            y: 379,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 321,
            y: 129,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 61,
            y: 128,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 449,
            y: 187,
          }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 200,
            y: 182,
          }),
          layers.objectGroup.objects.scenery.building.logCabin({
            x: 521,
            y: 255,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 573,
            y: 132,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 97,
            y: 380,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 257,
            y: 312,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 276,
            y: 334,
          }),
          layers.objectGroup.objects.scenery.nature.hay({
            x: 237,
            y: 333,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 26,
            y: 55,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 140,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 340,
            y: 60,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 234,
            y: 29,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 576,
            y: 28,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 429,
            y: 20,
          }),
        ],
      },
    },
  },
})
