import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 column of a bottom-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 2
          [
            // 4 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 4 }),
            // 1 columns of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 3
          [
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
            // 5 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 5 }),
          ],
          // Row 4 to 8 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 5 }),
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.default.right({
            row: 2,
          }),
          layers.objectGroup.objects.endpoints.house.common.orange.right({
            col: 4,
            row: 0,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 340,
            y: -79,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 283,
            y: -84,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 340,
            y: 1,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 317,
            y: -41,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 374,
            y: -42,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 394,
            y: -83,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 428,
            y: -42,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 397,
            y: 2,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 320,
            y: -124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 192,
            y: -85,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 243,
            y: -131,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 234,
            y: -61,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 184,
            y: -136,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 381,
            y: -137,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 455,
            y: -131,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 520,
            y: -129,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 580,
            y: -128,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 574,
            y: -68,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 516,
            y: -69,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 460,
            y: -87,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 548,
            y: -102,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 490,
            y: -129,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 426,
            y: -124,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 545,
            y: -44,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 490,
            y: -35,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 99,
            y: -115,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 138,
            y: -26,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 339,
            y: 63,
          }),
        ],
      },
    },
  },
})
