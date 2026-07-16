import { type FC, useState } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../phaser/tilesets"
import SpeedImageList from "./SpeedImageList"

// /** Fired on `window` whenever the active scenery type changes. */
// export type SceneryToolSelectedEvent = CustomEvent<SceneryItemKey>

// /** Event name dispatched on `window` when the user selects a scenery type. */
// export const SCENERY_TOOL_SELECTED = "scenery-tool-selected"

const items = [
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
] as const
type ItemKey = (typeof items)[number]["key"]

export interface SceneryFabCatalogueProps {}

const SceneryFabCatalogue: FC<SceneryFabCatalogueProps> = () => {
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState<ItemKey>("bush")

  return (
    <Portal>
      <SpeedImageList
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        items={items}
        selectedKey={selectedKey}
        onChange={key => {
          setSelectedKey(key)
          // window.dispatchEvent(
          //   new CustomEvent(SCENERY_TOOL_SELECTED, { detail: key }),
          // )
        }}
        fab={{ size: 56, margin: 2 }}
        title={{ text: "Scenery Objects" }}
        image={{ size: 64 }}
      />
    </Portal>
  )
}

export default SceneryFabCatalogue
