import { CloudDownload as CloudDownloadIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import { usePhaserGameContext } from "../../../app/hooks"

const exampleLevelTiledJson = {
  orientation: "orthogonal",
  renderorder: "right-down",
  version: 1,
  nextobjectid: 0,
  width: 10,
  height: 8,
  tilewidth: 128,
  tileheight: 128,
  properties: [
    {
      name: "background",
      type: "string",
      value: "SNOW",
    },
  ],
  tilesets: [
    {
      imagewidth: 128,
      imageheight: 128,
      tilewidth: 128,
      tileheight: 128,
      firstgid: 5,
      image:
        "http://localhost:5173/src/phaser/tilesets/road/asphalt/dead_end.svg",
      name: "http://localhost:5173/src/phaser/tilesets/road/asphalt/dead_end.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
      properties: [
        {
          name: "canDriveForwards",
          value: false,
          type: "bool",
        },
        {
          name: "canDriveBackwards",
          value: true,
          type: "bool",
        },
        {
          name: "canTurnLeft",
          value: false,
          type: "bool",
        },
        {
          name: "canTurnRight",
          value: false,
          type: "bool",
        },
      ],
    },
    {
      imagewidth: 128,
      imageheight: 128,
      tilewidth: 128,
      tileheight: 128,
      firstgid: 1,
      image:
        "http://localhost:5173/src/phaser/tilesets/road/asphalt/straight.svg",
      name: "http://localhost:5173/src/phaser/tilesets/road/asphalt/straight.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
      properties: [
        {
          name: "canDriveForwards",
          value: true,
          type: "bool",
        },
        {
          name: "canDriveBackwards",
          value: true,
          type: "bool",
        },
        {
          name: "canTurnLeft",
          value: false,
          type: "bool",
        },
        {
          name: "canTurnRight",
          value: false,
          type: "bool",
        },
      ],
    },
    {
      imagewidth: 128,
      imageheight: 128,
      tilewidth: 128,
      tileheight: 128,
      firstgid: 2,
      image: "http://localhost:5173/src/phaser/tilesets/road/asphalt/turn.svg",
      name: "http://localhost:5173/src/phaser/tilesets/road/asphalt/turn.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
      properties: [
        {
          name: "canDriveForwards",
          value: false,
          type: "bool",
        },
        {
          name: "canDriveBackwards",
          value: false,
          type: "bool",
        },
        {
          name: "canTurnLeft",
          value: true,
          type: "bool",
        },
        {
          name: "canTurnRight",
          value: true,
          type: "bool",
        },
      ],
    },
    {
      imagewidth: 128,
      imageheight: 128,
      tilewidth: 128,
      tileheight: 128,
      firstgid: 18,
      image:
        "http://localhost:5173/src/phaser/tilesets/endpoints/cfc/warehouse/default.svg",
      name: "http://localhost:5173/src/phaser/tilesets/endpoints/cfc/warehouse/default.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
    },
    {
      imagewidth: 64,
      imageheight: 64,
      tilewidth: 64,
      tileheight: 64,
      firstgid: 24,
      image:
        "http://localhost:5173/src/phaser/tilesets/endpoints/house/common/orange.svg",
      name: "http://localhost:5173/src/phaser/tilesets/endpoints/house/common/orange.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
    },
    {
      imagewidth: 128,
      imageheight: 128,
      tilewidth: 128,
      tileheight: 128,
      firstgid: 34,
      image:
        "http://localhost:5173/src/phaser/tilesets/scenery/nature/bush.svg",
      name: "http://localhost:5173/src/phaser/tilesets/scenery/nature/bush.svg",
      tilecount: 1,
      columns: 1,
      spacing: 0,
      margin: 0,
      imagescale: 1,
    },
  ],
  layers: [
    {
      x: 0,
      y: 0,
      width: 10,
      height: 8,
      opacity: 1,
      visible: true,
      name: "Tile.ROAD",
      type: "tilelayer",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1610612741, -1610612735, -1610612735, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1073741822,
        -1610612735, -1610612735, -1610612731, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    {
      x: 0,
      y: 0,
      width: 10,
      height: 8,
      opacity: 1,
      visible: true,
      name: "ObjectGroup.OBSTACLES",
      type: "objectgroup",
      draworder: "topdown",
      objects: [],
    },
    {
      x: 0,
      y: 0,
      width: 10,
      height: 8,
      opacity: 1,
      visible: true,
      name: "ObjectGroup.ENDPOINTS",
      type: "objectgroup",
      draworder: "topdown",
      objects: [
        {
          id: 1,
          width: 128,
          height: 128,
          gid: 18,
          type: "Endpoints.CFC.Warehouse.DEFAULT",
          name: "Endpoints.CFC.Warehouse.DEFAULT",
          x: 115.2,
          y: 252,
          properties: [],
          visible: true,
          rotation: 90,
        },
        {
          id: 2,
          width: 64,
          height: 64,
          gid: 24,
          type: "Endpoints.House.Common.ORANGE",
          name: "Endpoints.House.Common.ORANGE",
          x: 988.8,
          y: 732.8,
          properties: [],
          visible: true,
          rotation: 0,
        },
      ],
    },
    {
      x: 0,
      y: 0,
      width: 10,
      height: 8,
      opacity: 1,
      visible: true,
      name: "ObjectGroup.SCENERY",
      type: "objectgroup",
      draworder: "topdown",
      objects: [
        {
          id: 3,
          width: 128,
          height: 128,
          gid: 34,
          type: "Scenery.Nature.BUSH",
          name: "Scenery.Nature.BUSH",
          x: 132.69441413199468,
          y: 730.907899593946,
          properties: [],
          visible: true,
          rotation: 0,
        },
        {
          id: 4,
          width: 128,
          height: 128,
          gid: 34,
          type: "Scenery.Nature.BUSH",
          name: "Scenery.Nature.BUSH",
          x: 290.1786968512529,
          y: 633.0769656699888,
          properties: [],
          visible: true,
          rotation: 0,
        },
        {
          id: 5,
          width: 128,
          height: 128,
          gid: 34,
          type: "Scenery.Nature.BUSH",
          name: "Scenery.Nature.BUSH",
          x: 495.3854894854378,
          y: 288.2825765965301,
          properties: [],
          visible: true,
          rotation: 0,
        },
        {
          id: 6,
          width: 128,
          height: 128,
          gid: 34,
          type: "Scenery.Nature.BUSH",
          name: "Scenery.Nature.BUSH",
          x: 958.293835660227,
          y: 530.4737910668143,
          properties: [],
          visible: true,
          rotation: 0,
        },
        {
          id: 7,
          width: 128,
          height: 128,
          gid: 34,
          type: "Scenery.Nature.BUSH",
          name: "Scenery.Nature.BUSH",
          x: 779.3344234792518,
          y: 691.5369139904024,
          properties: [],
          visible: true,
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
        phaserGame?.setVariable("levelTiledJson", exampleLevelTiledJson)
      }
    />
  )
}

export default LoadButton
