import { type FC, useState } from "react"
import type Phaser from "phaser"

import * as tilesets from "../../../phaser/tilesets"
import SpeedImageSelect from "../../../components/SpeedImageSelect"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Endpoints["tool"]

export interface ImageSelectProps {
  tool: Tool
  setTool: (tool: Tool) => void
}

const ImageSelect: FC<ImageSelectProps> = ({ tool, setTool }) => {
  const [open, setOpen] = useState(false)

  return (
    <SpeedImageSelect
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      categories={[
        {
          key: "start",
          subheader: "Start (Only 1, Only on Dead End)",
          images: [
            {
              key: tilesets.IDs.Endpoints.CFC.Warehouse.DEFAULT,
              title: "Warehouse CFC",
              src: tilesets.endpoints.cfc.warehouse.default.image,
            },
            {
              key: tilesets.IDs.Endpoints.CFC.Warehouse.SNOW,
              title: "Snowy Warehouse CFC",
              src: tilesets.endpoints.cfc.warehouse.snow.image,
            },
            {
              key: tilesets.IDs.Endpoints.CFC.Barn.BLACK,
              title: "Black Barn CFC",
              src: tilesets.endpoints.cfc.barn.black.image,
            },
            {
              key: tilesets.IDs.Endpoints.CFC.Barn.RED,
              title: "Red Barn CFC",
              src: tilesets.endpoints.cfc.barn.red.image,
            },
            {
              key: tilesets.IDs.Endpoints.CFC.Barn.SNOW,
              title: "Snowy Red Barn CFC",
              src: tilesets.endpoints.cfc.barn.snow.image,
            },
          ],
        },
        {
          key: "end",
          subheader: "End (1 per Road, On any Road)",
          images: [
            {
              key: tilesets.IDs.Endpoints.House.Common.BLUE,
              title: "Blue House",
              src: tilesets.endpoints.house.common.blue.image,
            },
            {
              key: tilesets.IDs.Endpoints.House.Snow.BLUE,
              title: "Snowy Blue House",
              src: tilesets.endpoints.house.snow.blue.image,
            },
            {
              key: tilesets.IDs.Endpoints.House.Common.ORANGE,
              title: "Orange House",
              src: tilesets.endpoints.house.common.orange.image,
            },
            {
              key: tilesets.IDs.Endpoints.House.Snow.ORANGE,
              title: "Snowy Orange House",
              src: tilesets.endpoints.house.snow.orange.image,
            },
            {
              key: tilesets.IDs.Endpoints.House.Common.STRAW,
              title: "Straw House",
              src: tilesets.endpoints.house.common.straw.image,
            },
            {
              key: tilesets.IDs.Endpoints.House.Snow.STRAW,
              title: "Snowy Straw House",
              src: tilesets.endpoints.house.snow.straw.image,
            },
          ],
        },
      ]}
      selected={tool}
      onChange={setTool}
    />
  )
}

export default ImageSelect
