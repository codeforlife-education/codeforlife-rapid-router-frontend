import { type Dispatch, type FC, type SetStateAction } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../../phaser/tilesets"
import SpeedImageSelect from "../../../components/SpeedImageSelect"
import { useBreakpoint } from "../../../app/hooks"

const categories = [
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
] as const satisfies {
  key: string
  subheader: string
  images: { key: tilesets.obstacles.ID; title: string; src: string }[]
}[]

/** The obstacle ids selectable from this image select (a subset of all obstacle ids). */
export type ID = (typeof categories)[number]["images"][number]["key"]

export interface ImageSelectProps {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  selectedState: [ID, Dispatch<SetStateAction<ID>>]
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
