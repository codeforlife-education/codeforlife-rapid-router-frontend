import { CloudDownload as CloudDownloadIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import { usePhaserGameContext } from "../../../app/hooks"

const exampleExportedLevel = {
  properties: [
    {
      name: "background",
      type: "string",
      value: "GRASS",
    },
  ],
  layers: [
    {
      data: [
        1610612738, -1610612735, -1610612731, 1610612741, 1610612739,
        -1610612731, 1610612738, -1610612731, 1610612738, -1610612731,
        -1073741822, -1610612735, 2, 0, 1, 0, -1073741821, -1610612731,
        -1073741821, -1610612731, 1610612741, -1610612735, -1610612734, 0,
        -1073741819, 0, -1073741822, -1610612731, -1073741819, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1610612738, -1610612731, 5,
        0, 1610612738, -1610612735, 2, 1610612738, -1610612735, 2, -1073741821,
        -1610612731, 1, 0, 1, 0, 1, -1073741821, 1610612739, -1610612734,
        -1073741819, 0, -1073741822, -1610612731, -1073741822, -1610612735,
        -1610612734, -1073741819, -1073741822, -1610612731,
      ],
    },
    {
      objects: [],
    },
    {
      objects: [
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "top",
            },
            {
              name: "tileRow",
              type: "int",
              value: 0,
            },
            {
              name: "tileCol",
              type: "int",
              value: 1,
            },
          ],
        },
        {
          gid: 18,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "left",
            },
            {
              name: "tileRow",
              type: "int",
              value: 0,
            },
            {
              name: "tileCol",
              type: "int",
              value: 2,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 0,
            },
            {
              name: "tileCol",
              type: "int",
              value: 4,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 0,
            },
            {
              name: "tileCol",
              type: "int",
              value: 6,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 0,
            },
            {
              name: "tileCol",
              type: "int",
              value: 8,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "outTopRight",
            },
            {
              name: "tileRow",
              type: "int",
              value: 1,
            },
            {
              name: "tileCol",
              type: "int",
              value: 0,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 1,
            },
            {
              name: "tileCol",
              type: "int",
              value: 8,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "top",
            },
            {
              name: "tileRow",
              type: "int",
              value: 2,
            },
            {
              name: "tileCol",
              type: "int",
              value: 0,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "outTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 2,
            },
            {
              name: "tileCol",
              type: "int",
              value: 2,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "left",
            },
            {
              name: "tileRow",
              type: "int",
              value: 2,
            },
            {
              name: "tileCol",
              type: "int",
              value: 4,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inBottomLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 2,
            },
            {
              name: "tileCol",
              type: "int",
              value: 6,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "top",
            },
            {
              name: "tileRow",
              type: "int",
              value: 2,
            },
            {
              name: "tileCol",
              type: "int",
              value: 8,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 5,
            },
            {
              name: "tileCol",
              type: "int",
              value: 0,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "bottom",
            },
            {
              name: "tileRow",
              type: "int",
              value: 5,
            },
            {
              name: "tileCol",
              type: "int",
              value: 5,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "top",
            },
            {
              name: "tileRow",
              type: "int",
              value: 5,
            },
            {
              name: "tileCol",
              type: "int",
              value: 8,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "inTopLeft",
            },
            {
              name: "tileRow",
              type: "int",
              value: 6,
            },
            {
              name: "tileCol",
              type: "int",
              value: 7,
            },
          ],
        },
        {
          gid: 24,
          properties: [
            {
              name: "variant",
              type: "string",
              value: "outTopRight",
            },
            {
              name: "tileRow",
              type: "int",
              value: 7,
            },
            {
              name: "tileCol",
              type: "int",
              value: 2,
            },
          ],
        },
      ],
    },
    {
      objects: [
        {
          gid: 29,
          x: 424.88888888888886,
          y: 301.33333333333337,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 45,
          x: 320,
          y: 448.44444444444446,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 371.5555555555555,
          y: -5.333333333333357,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 37,
          x: 524.4444444444445,
          y: 297.33333333333326,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 249.33333333333331,
          y: 590.2222222222223,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 363.1111111111111,
          y: 588.888888888889,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 471.1111111111112,
          y: 591.1111111111111,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 131.99999999999997,
          y: 583.1111111111111,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 6.666666666666643,
          y: 579.1111111111109,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: -1.7777777777777786,
          y: -2.2222222222222214,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 652.3333333333333,
          y: 89.16666666666666,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 571,
          y: -4.5,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 180,
          y: -4.666666666666657,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: -84,
          y: 70,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 658.6666666666666,
          y: 210,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 657.3333333333333,
          y: 340.6666666666667,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: 657.3333333333333,
          y: 472.6666666666667,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: -78.66666666666666,
          y: 467.3333333333333,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: -82.66666666666666,
          y: 342.00000000000006,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 39,
          x: -85.33333333333334,
          y: 226,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 35,
          x: 581.3333333333333,
          y: 591.3333333333335,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 318.2222222222222,
          y: 144.4444444444444,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 220.44444444444446,
          y: 316.8888888888889,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 264,
          y: 253.77777777777774,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 198.22222222222217,
          y: 425.3333333333332,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 188.44444444444443,
          y: 168.44444444444443,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 26,
          x: 140.44444444444446,
          y: 292,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 27,
          x: 0.8888888888888857,
          y: 291.1111111111111,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 27,
          x: 118.28313038827082,
          y: 253.92622291443703,
          width: 64,
          height: 64,
          rotation: 177.00295741971627,
        },
        {
          gid: 34,
          x: 320.88888888888886,
          y: 285.7777777777777,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 576.8888888888888,
          y: 233.33333333333334,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 587.5555555555555,
          y: 340,
          width: 64,
          height: 64,
          rotation: 0,
        },
        {
          gid: 34,
          x: 56.888888888888886,
          y: 524.8888888888888,
          width: 64,
          height: 64,
          rotation: 0,
        },
      ],
    },
  ],
}

export interface LoadButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const LoadButton: FC<LoadButtonProps> = ({ isDrawerOpen }) => {
  const {
    ref: { current: phaserGame },
  } = usePhaserGameContext()

  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Load"
      icon={<CloudDownloadIcon />}
      // TODO: Fetch the level's Tiled JSON from the API instead of using the
      //  hardcoded example.
      onClick={() =>
        phaserGame?.setVariable("exportedLevel", exampleExportedLevel)
      }
    />
  )
}

export default LoadButton
