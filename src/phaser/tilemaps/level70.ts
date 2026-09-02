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
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a bottom-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.BOTTOM,
            // 7 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 7 }),
          ],
          // Row 3
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (left, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.LEFT_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a left-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 4
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
              cols: 1,
            }),
            // 1 column of a bottom-left turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_LEFT,
              cols: 1,
            }),
            // 1 column of vertical straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.VERTICAL,
              cols: 1,
            }),
            // 1 column of a bottom-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.BOTTOM_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 5
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of horizontal straight road tile (CFC)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a crossroads road tile
            layers.tile.data.IDs.Road.Asphalt.CROSSROADS,
            // 1 column of a left-facing dead end road tile (incl. house)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.LEFT,
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
          ],
          // Row 6
          [
            // 2 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 2 }),
            // 1 column of a t-junction road tile (top, right, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_RIGHT_BOTTOM,
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
            // 1 column of a top-right turn road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Turn.TOP_RIGHT,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 7
          [
            // 1 column of empty tiles
            ...layers.tile.data.fillRow({ cols: 1 }),
            // 1 column of a right-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.RIGHT,
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, right)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_RIGHT,
              cols: 1,
            }),
            // 1 column of horizontal straight road tile
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.Straight.HORIZONTAL,
              cols: 1,
            }),
            // 1 column of a t-junction road tile (top, left, bottom)
            ...layers.tile.data.fillRow({
              id: layers.tile.data.IDs.Road.Asphalt.TJunction.TOP_LEFT_BOTTOM,
              cols: 1,
            }),
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
          // Row 8
          [
            // 6 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 6 }),
            // 1 column of a top-facing dead end road tile (decorative)
            layers.tile.data.IDs.Road.Asphalt.DeadEnd.TOP,
            // 3 columns of empty tiles
            ...layers.tile.data.fillRow({ cols: 3 }),
          ],
        ],
      },
    },
    objectGroup: {
      endpoints: {
        objects: [
          layers.objectGroup.objects.endpoints.cfc.warehouse.snow.right({
            col: 1,
            row: 4,
          }),
          layers.objectGroup.objects.endpoints.house.snow.orange.top({
            col: 7,
            row: 4,
          }),
        ],
      },
      obstacles: {
        objects: [
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 3,
            row: 4,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.red.left({
            col: 5,
            row: 4,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.top({
            col: 4,
            row: 6,
          }),
          layers.objectGroup.objects.obstacles.trafficLight.green.bottom({
            col: 4,
            row: 2,
          }),
        ],
      },
      scenery: {
        objects: [
          layers.objectGroup.objects.scenery.nature.snow.tree.pine({
            x: 72,
            y: 180,
          }),
          layers.objectGroup.objects.scenery.nature.snow.pond({
            x: 203,
            y: 72,
          }),
          layers.objectGroup.objects.scenery.nature.snow.tree.oak({
            x: 446,
            y: 180,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 342,
            y: 426,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 174,
            y: 349,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 221,
            y: 304,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 213,
            y: 344,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 300,
            y: 339,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 58,
            y: 423,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 97,
            y: 425,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 140,
            y: 427,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 180,
            y: 426,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 221,
            y: 424,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 262,
            y: 424,
          }),
          layers.objectGroup.objects.scenery.nature.snow.bush({
            x: 300,
            y: 426,
          }),
        ],
      },
    },
  },
})
