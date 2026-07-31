import { type Dispatch, type FC, type SetStateAction } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../phaser/tilesets"
import SpeedImageSelect from "../../components/SpeedImageSelect"
import { useBreakpoint } from "../../app/hooks"

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
        key: tilesets.IDs.Scenery.Nature.CROPS,
        title: "Crops",
        src: tilesets.scenery.nature.crops.image,
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
        key: tilesets.IDs.Scenery.Nature.Tree.OAK,
        title: "Oak Tree",
        src: tilesets.scenery.nature.tree.oak.image,
      },
      {
        key: tilesets.IDs.Scenery.Nature.Tree.PINE,
        title: "Pine Tree",
        src: tilesets.scenery.nature.tree.pine.image,
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
        key: tilesets.IDs.Scenery.Building.HOUSE,
        title: "House",
        src: tilesets.scenery.building.house.image,
      },
      {
        key: tilesets.IDs.Scenery.Building.SCHOOL,
        title: "School",
        src: tilesets.scenery.building.school.image,
      },
      {
        key: tilesets.IDs.Scenery.Building.SHOP,
        title: "Shop",
        src: tilesets.scenery.building.shop.image,
      },
    ],
  },
  {
    key: "snow",
    subheader: "Snow",
    images: [
      {
        key: tilesets.IDs.Scenery.Snow.Building.BARN,
        title: "Barn",
        src: tilesets.scenery.snow.building.barn.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Building.HOSPITAL,
        title: "Hospital",
        src: tilesets.scenery.snow.building.hospital.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Building.SCHOOL,
        title: "School",
        src: tilesets.scenery.snow.building.school.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Building.SHOP,
        title: "Shop",
        src: tilesets.scenery.snow.building.shop.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Nature.BUSH,
        title: "Bush",
        src: tilesets.scenery.snow.nature.bush.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Nature.CROPS,
        title: "Crops",
        src: tilesets.scenery.snow.nature.crops.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Nature.POND,
        title: "Pond",
        src: tilesets.scenery.snow.nature.pond.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Nature.Tree.OAK,
        title: "Oak Tree",
        src: tilesets.scenery.snow.nature.tree.oak.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Nature.Tree.PINE,
        title: "Pine Tree",
        src: tilesets.scenery.snow.nature.tree.pine.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.Other.SOLAR_PANEL,
        title: "Solar Panel",
        src: tilesets.scenery.snow.other.solarPanel.image,
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
    ],
  },
] as const satisfies {
  key: string
  subheader: string
  images: { key: tilesets.scenery.ID; title: string; src: string }[]
}[]

export interface SceneryImageSelectProps {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  selectedState: [
    tilesets.scenery.ID,
    Dispatch<SetStateAction<tilesets.scenery.ID>>,
  ]
}

const SceneryImageSelect: FC<SceneryImageSelectProps> = ({
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
        fab={{ size: 56, margin: 2 }}
        image={{ size: 64 }}
      />
    </Portal>
  )
}

export default SceneryImageSelect
