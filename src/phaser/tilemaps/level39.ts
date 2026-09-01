import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" },
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 2
          [
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 3
          [
            // 8 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 8 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 4
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 5
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
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
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 6
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 3 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 3,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
          ],
          // Row 7 - 10 columns of empty tiles
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 8 - 10 columns of empty tiles
          [...layers.tile.data.fillRow({ cols: 10 })],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.barn.red.right({
            col: 1,
            row: 5,
          }),
          layers.objectGroup.objects.endpoints.house.common.straw.right({
            col: 8,
            row: 0,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.animal.cow.right({
            col: 8,
            row: 1,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.right({
            col: 4,
            row: 3,
          }),
          layers.objectGroup.objects.obstacles.animal.cow.right({
            col: 8,
            row: 3,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.crops({
            x: 365,
            y: 259,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 365,
            y: 187,
          }),
          layers.objectGroup.objects.scenery.nature.crops({
            x: 365,
            y: 119,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 188,
            y: 256,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 455,
            y: 383,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 574,
            y: 61,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 73,
            y: 246,
          }),
        ],
      },
    },
  },
})
