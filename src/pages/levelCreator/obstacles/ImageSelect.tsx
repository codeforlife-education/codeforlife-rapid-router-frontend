import { type FC, useState } from "react"
import type Phaser from "phaser"

import * as tilesets from "../../../phaser/tilesets"
import SpeedImageSelect from "../../../components/SpeedImageSelect"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Obstacles["tool"]

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
          key: "obstacles",
          subheader: "Obstacles",
          images: [
            {
              key: tilesets.IDs.Obstacles.Animal.COW,
              title: "Cow",
              src: tilesets.obstacles.animal.cow.image,
            },
            {
              key: tilesets.IDs.Obstacles.Animal.PIGEON,
              title: "Pigeon",
              src: tilesets.obstacles.animal.pigeon.image,
            },
            {
              key: tilesets.IDs.Obstacles.TrafficLight.RED,
              title: "Traffic Light",
              src: tilesets.obstacles.trafficLight.red.image,
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
