import { type Dispatch, type FC, type SetStateAction } from "react"

import * as tilesets from "../../../phaser/tilesets"
import SpeedImageSelect from "../../../components/SpeedImageSelect"

// Get the IDs of the obstacles that cannot be driven through.
type ID = Extract<
  (typeof tilesets.obstacles.default)[number],
  { properties: tilesets.obstacles.Properties<{ canDriveThrough: false }> }
>["firstgid"]

export interface ImageSelectProps {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  selectedState: [ID, Dispatch<SetStateAction<ID>>]
}

const ImageSelect: FC<ImageSelectProps> = ({
  openState: [open, setOpen],
  selectedState: [selected, setSelected],
}) => (
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
    selected={selected}
    onChange={setSelected}
  />
)

export default ImageSelect
