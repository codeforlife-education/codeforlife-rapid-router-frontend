import { type FC, useState } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../phaser/tilesets"
import SpeedImageList, { type Key } from "./SpeedImageList"
import { useBreakpoint } from "../../app/hooks"

// /** Fired on `window` whenever the active scenery type changes. */
// export type SceneryToolSelectedEvent = CustomEvent<SceneryItemKey>

// /** Event name dispatched on `window` when the user selects a scenery type. */
// export const SCENERY_TOOL_SELECTED = "scenery-tool-selected"

const categories = [
  {
    key: "common",
    subheader: "Common",
    images: [
      {
        key: "bush",
        title: "Bush",
        src: tilesets.scenery.common.bush.image,
      },
      {
        key: "hay",
        title: "Hay",
        src: tilesets.scenery.common.hay.image,
      },
      {
        key: "pond",
        title: "Pond",
        src: tilesets.scenery.common.pond.image,
      },
      {
        key: "tree1",
        title: "Tree",
        src: tilesets.scenery.common.tree1.image,
      },
      {
        key: "tree2",
        title: "Pine Tree",
        src: tilesets.scenery.common.tree2.image,
      },
    ],
  },
  {
    key: "snow",
    subheader: "Snow",
    images: [
      // snow
      {
        key: "bush",
        title: "Bush",
        src: tilesets.scenery.snow.bush.image,
      },
      {
        key: "pond",
        title: "Pond",
        src: tilesets.scenery.snow.pond.image,
      },
      {
        key: "tree1",
        title: "Tree",
        src: tilesets.scenery.snow.tree1.image,
      },
      {
        key: "tree2",
        title: "Pine Tree",
        src: tilesets.scenery.snow.tree2.image,
      },
    ],
  },
] as const

export interface SceneryFabCatalogueProps {}

const SceneryFabCatalogue: FC<SceneryFabCatalogueProps> = () => {
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] =
    useState<Key<typeof categories>>("common-bush")
  const breakpoint = useBreakpoint()

  return (
    <Portal>
      <SpeedImageList
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
        selectedKey={selectedKey}
        onChangeKey={key => {
          setSelectedKey(key)
          // window.dispatchEvent(
          //   new CustomEvent(SCENERY_TOOL_SELECTED, { detail: key }),
          // )
        }}
        fab={{ size: 56, margin: 2 }}
        image={{ size: 64 }}
      />
    </Portal>
  )
}

export default SceneryFabCatalogue
