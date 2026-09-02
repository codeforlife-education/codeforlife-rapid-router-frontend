import * as layers from "../layers"
import * as tilemaps from "./tilemaps"

export default tilemaps.makeOrthogonal({
  properties: { background: "GRASS" }, // character: "VAN"
  layers: {
    tile: {
      road: {
        data: [
          // Row 1 to 2 - 10 columns of empty tiles
          ...layers.tile.data.fillManyRows({ rows: 2 }),
          // Row 3
          [
            // 4 columns of horizontal straight road tiles
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 4,
            }),
            // 1 column of a left-facing dead end road tile
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
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
          layers.objectGroup.objects.endpoints.house.common.orange.top({
            col: 4,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 252,
            y: -25,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 173,
            y: -72,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 218,
            y: -95,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 49,
            y: -89,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 94,
            y: -79,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 145,
            y: -116,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 146,
            y: -20,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 51,
            y: -12,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 209,
            y: 40,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 398,
            y: 200,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 413,
            y: 291,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 347,
            y: 262,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 452,
            y: 138,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 455,
            y: 298,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 529,
            y: 303,
          }),
          layers.objectGroup.objects.scenery.nature.bush({
            x: 500,
            y: 252,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 479,
            y: 234,
          }),
          layers.objectGroup.objects.scenery.nature.tree.pine({
            x: 543,
            y: 232,
          }),
          layers.objectGroup.objects.scenery.nature.tree.oak({
            x: 214,
            y: 260,
          }),
        ],
      },
    },
  },
})
