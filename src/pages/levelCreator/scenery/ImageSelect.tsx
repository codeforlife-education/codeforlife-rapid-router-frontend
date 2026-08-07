import { type Dispatch, type FC, type SetStateAction } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../../phaser/tilesets"
import SpeedImageSelect from "../../../components/SpeedImageSelect"
import { useBreakpoint } from "../../../app/hooks"

const categories = [
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
] as const satisfies {
  key: string
  subheader: string
  images: { key: tilesets.scenery.ID; title: string; src: string }[]
}[]

export interface ImageSelectProps {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  selectedState: [
    tilesets.scenery.ID,
    Dispatch<SetStateAction<tilesets.scenery.ID>>,
  ]
}

const ImageSelect: FC<ImageSelectProps> = ({
  openState: [open, setOpen],
  selectedState: [selected, setSelected],
}) => {
  const breakpoint = useBreakpoint()

  return (
    <Portal>
      <SpeedImageSelect
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        categories={categories}
        cols={
          {
            xs: 3,
            sm: 4,
            md: 5,
            lg: 6,
            xl: 7,
          }[breakpoint]
        }
        selected={selected}
        onChange={setSelected}
      />
    </Portal>
  )
}

export default ImageSelect
