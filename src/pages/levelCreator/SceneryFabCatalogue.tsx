import { type FC, useEffect, useState } from "react"
import { Portal } from "@mui/material"

import * as tilesets from "../../phaser/tilesets"
import { useBreakpoint, usePhaserGameContext } from "../../app/hooks"
import SpeedImageSelect from "../../components/SpeedImageSelect"

const categories = [
  {
    key: "common",
    subheader: "Common",
    images: [
      {
        key: tilesets.IDs.Scenery.Common.BUSH,
        title: "Bush",
        src: tilesets.scenery.common.bush.image,
      },
      {
        key: tilesets.IDs.Scenery.Common.HAY,
        title: "Hay",
        src: tilesets.scenery.common.hay.image,
      },
      {
        key: tilesets.IDs.Scenery.Common.POND,
        title: "Pond",
        src: tilesets.scenery.common.pond.image,
      },
      {
        key: tilesets.IDs.Scenery.Common.TREE1,
        title: "Tree",
        src: tilesets.scenery.common.tree1.image,
      },
      {
        key: tilesets.IDs.Scenery.Common.TREE2,
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
        key: tilesets.IDs.Scenery.Snow.BUSH,
        title: "Bush",
        src: tilesets.scenery.snow.bush.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.POND,
        title: "Pond",
        src: tilesets.scenery.snow.pond.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.TREE1,
        title: "Tree",
        src: tilesets.scenery.snow.tree1.image,
      },
      {
        key: tilesets.IDs.Scenery.Snow.TREE2,
        title: "Pine Tree",
        src: tilesets.scenery.snow.tree2.image,
      },
    ],
  },
] as const satisfies {
  key: string
  subheader: string
  images: { key: tilesets.scenery.ID; title: string; src: string }[]
}[]

export interface SceneryFabCatalogueProps {}

const SceneryFabCatalogue: FC<SceneryFabCatalogueProps> = () => {
  const [open, setOpen] = useState(false)
  const [tool, setTool] = useState<tilesets.scenery.ID>(
    tilesets.IDs.Scenery.Common.BUSH,
  )
  const breakpoint = useBreakpoint()
  const phaserGameContext = usePhaserGameContext()

  // Update the Phaser game tool whenever the selected tool changes.
  useEffect(() => {
    if (!phaserGameContext?.isInitialized) return
    phaserGameContext.ref.current?.setCreateToolbox({ box: "scenery", tool })
  }, [phaserGameContext?.isInitialized, phaserGameContext?.ref, tool])

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
        selected={tool}
        onChange={setTool}
        fab={{ size: 56, margin: 2 }}
        image={{ size: 64 }}
      />
    </Portal>
  )
}

export default SceneryFabCatalogue
