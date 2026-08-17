import { type FC, useEffect, useState } from "react"
import { Park as ParkIcon } from "@mui/icons-material"
import type Phaser from "phaser"
import { Typography } from "@mui/material"

import * as tilesets from "../../../phaser/tilesets"
import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import SpeedImageSelect from "../../../components/SpeedImageSelect"
import { usePhaserGameContext } from "../../../app/hooks"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Scenery["tool"]

export interface SceneryButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {
  tool?: Tool
  setTool: (tool: Tool) => void
}

const SceneryButton: FC<SceneryButtonProps> = ({
  isDrawerOpen,
  tool,
  setTool,
}) => {
  const [open, setOpen] = useState(false)
  const [_tool, _setTool] = useState<Tool>(tilesets.IDs.Scenery.Nature.BUSH)
  const {
    activeSceneKeys,
    ref: { current: phaserGame },
  } = usePhaserGameContext()
  const [objectCount, setObjectCount] = useState<number>()
  const [maxObjectCount, setMaxObjectCount] = useState<number>()

  useEffect(() => {
    if (tool && tool !== _tool) setTool(_tool)
  }, [_tool, tool, setTool])

  useEffect(() => {
    if (!phaserGame) return

    const objectCountCleanup = phaserGame.getVariable(
      "sceneryObjectCount",
      setObjectCount,
    )
    const maxObjectCountCleanup = phaserGame.getVariable(
      "maxSceneryObjectCount",
      setMaxObjectCount,
    )

    return () => {
      objectCountCleanup()
      maxObjectCountCleanup()
    }
  }, [phaserGame])

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && tool && (
        <>
          {objectCount !== undefined && maxObjectCount !== undefined && (
            <Typography
              color={objectCount >= maxObjectCount ? "error" : "white"}
              variant="h6"
              sx={{
                position: "fixed",
                top: 16,
                left: { xs: "16px", sm: "50%" },
                transform: { xs: "translateX(0)", sm: "translateX(-50%)" },
                userSelect: "none",
                zIndex: 1,
              }}
            >
              {objectCount} / {maxObjectCount}
            </Typography>
          )}
          <SpeedImageSelect
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            categories={[
              {
                key: "nature",
                subheader: "Nature",
                images: [
                  {
                    key: tilesets.IDs.Scenery.Nature.BUSH,
                    title: "Bush",
                    src: tilesets.scenery.nature.bush.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Snow.BUSH,
                    title: "Snowy Bush",
                    src: tilesets.scenery.nature.snow.bush.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.CROPS,
                    title: "Crops",
                    src: tilesets.scenery.nature.crops.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Snow.CROPS,
                    title: "Snowy Crops",
                    src: tilesets.scenery.nature.snow.crops.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.HAY,
                    title: "Hay",
                    src: tilesets.scenery.nature.hay.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.POND,
                    title: "Pond",
                    src: tilesets.scenery.nature.pond.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Snow.POND,
                    title: "Frozen Pond",
                    src: tilesets.scenery.nature.snow.pond.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Tree.OAK,
                    title: "Oak Tree",
                    src: tilesets.scenery.nature.tree.oak.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Snow.Tree.OAK,
                    title: "Snowy Oak Tree",
                    src: tilesets.scenery.nature.snow.tree.oak.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Tree.PINE,
                    title: "Pine Tree",
                    src: tilesets.scenery.nature.tree.pine.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Nature.Snow.Tree.PINE,
                    title: "Snowy Pine Tree",
                    src: tilesets.scenery.nature.snow.tree.pine.image,
                  },
                ],
              },
              {
                key: "building",
                subheader: "Building",
                images: [
                  {
                    key: tilesets.IDs.Scenery.Building.HOSPITAL,
                    title: "Hospital",
                    src: tilesets.scenery.building.hospital.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.Snow.HOSPITAL,
                    title: "Snowy Hospital",
                    src: tilesets.scenery.building.snow.hospital.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.HOUSE,
                    title: "House",
                    src: tilesets.scenery.building.house.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.LOG_CABIN,
                    title: "Log Cabin",
                    src: tilesets.scenery.building.logCabin.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.SCHOOL,
                    title: "School",
                    src: tilesets.scenery.building.school.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.Snow.SCHOOL,
                    title: "Snowy School",
                    src: tilesets.scenery.building.snow.school.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.SHOP,
                    title: "Shop",
                    src: tilesets.scenery.building.shop.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Building.Snow.SHOP,
                    title: "Snowy Shop",
                    src: tilesets.scenery.building.snow.shop.image,
                  },
                ],
              },
              {
                key: "other",
                subheader: "Other",
                images: [
                  {
                    key: tilesets.IDs.Scenery.Other.SOLAR_PANEL,
                    title: "Solar Panel",
                    src: tilesets.scenery.other.solarPanel.image,
                  },
                  {
                    key: tilesets.IDs.Scenery.Other.Snow.SOLAR_PANEL,
                    title: "Snowy Solar Panel",
                    src: tilesets.scenery.other.snow.solarPanel.image,
                  },
                ],
              },
            ]}
            selected={tool}
            onChange={_setTool}
          />
        </>
      )}
      <ButtonItem
        id="scenery"
        isDrawerOpen={isDrawerOpen}
        selected={tool !== undefined}
        text="Scenery"
        icon={<ParkIcon />}
        onClick={() => setTool(_tool)}
      />
    </>
  )
}

export default SceneryButton
