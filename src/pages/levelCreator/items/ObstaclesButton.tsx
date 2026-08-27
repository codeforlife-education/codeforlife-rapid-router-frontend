import { type FC, useEffect, useState } from "react"
import type Phaser from "phaser"
import { Traffic as TrafficIcon } from "@mui/icons-material"

import * as tilesets from "../../../phaser/tilesets"
import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import SpeedImageSelect from "../../../components/SpeedImageSelect"
import { usePhaserGameContext } from "../../../app/hooks"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Obstacles["tool"]

export interface ObstaclesButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {
  tool?: Tool
  setTool: (tool: Tool) => void
}

const ObstaclesButton: FC<ObstaclesButtonProps> = ({
  isDrawerOpen,
  tool,
  setTool,
}) => {
  const [open, setOpen] = useState(false)
  const [_tool, _setTool] = useState<Tool>(tilesets.IDs.Obstacles.Animal.COW)
  const { activeSceneKeys } = usePhaserGameContext()

  useEffect(() => {
    if (tool && tool !== _tool) setTool(_tool)
  }, [_tool, tool, setTool])

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && tool && (
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
          onChange={_setTool}
        />
      )}
      <ButtonItem
        id="obstacles"
        isDrawerOpen={isDrawerOpen}
        selected={tool !== undefined}
        text="Obstacles"
        icon={<TrafficIcon />}
        onClick={() => setTool(_tool)}
      />
    </>
  )
}

export default ObstaclesButton
