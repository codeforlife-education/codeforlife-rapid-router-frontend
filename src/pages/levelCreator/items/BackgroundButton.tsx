import { type FC, useEffect, useState } from "react"
import { Grass as GrassIcon } from "@mui/icons-material"
import type Phaser from "phaser"

import * as images from "../../../phaser/images"
import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import SpeedImageSelect from "../../../components/SpeedImageSelect"
import { usePhaserGameContext } from "../../../app/hooks"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Background["tool"]

export interface BackgroundButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {
  tool?: Tool
  setTool: (tool: Tool) => void
}

const BackgroundButton: FC<BackgroundButtonProps> = ({
  isDrawerOpen,
  tool,
  setTool,
}) => {
  const [open, setOpen] = useState(false)
  const [_tool, _setTool] = useState<Tool>("GRASS")
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
              key: "background",
              subheader: "Background",
              images: [
                {
                  key: "GRASS" as const,
                  title: "Grass",
                  src: images.URLs.Background.GRASS,
                },
                {
                  key: "SNOW" as const,
                  title: "Snow",
                  src: images.URLs.Background.SNOW,
                },
                {
                  key: "PAVEMENT" as const,
                  title: "Pavement",
                  src: images.URLs.Background.PAVEMENT,
                },
              ],
            },
          ]}
          closedImageFit="cover"
          selected={tool}
          onChange={_setTool}
        />
      )}
      <ButtonItem
        id="background"
        isDrawerOpen={isDrawerOpen}
        selected={tool !== undefined}
        text="Background"
        icon={<GrassIcon />}
        onClick={() => setTool(_tool)}
      />
    </>
  )
}

export default BackgroundButton
