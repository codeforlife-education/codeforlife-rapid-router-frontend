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
          // Row 3
          [
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
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
            // 1 column of right-turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
          ],
          // Row 4
          [...layers.tile.data.fillRow({ cols: 10 })],
          // Row 5
          [...layers.tile.data.fillRow({ cols: 10 })],
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
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            col: 0,
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 8,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 546,
            y: 403,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 501,
            y: 288,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 295,
            y: 374,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 432,
            y: 432,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 473,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 339,
            y: 405,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 419,
            y: 367,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 277,
            y: 438,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 479,
            y: 388,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 100,
            y: 407,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 561,
            y: 332,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 29,
            y: 368,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 350,
            y: 332,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 206,
            y: 412,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 388,
            y: 448,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 137,
            y: 446,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 38,
            y: 433,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 426,
            y: 291,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 155,
            y: 352,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 47,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 367,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 303,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 238,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 173,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 110,
            y: 175,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 431,
            y: 175,
          }),
        ],
      },
    },
  },
})
