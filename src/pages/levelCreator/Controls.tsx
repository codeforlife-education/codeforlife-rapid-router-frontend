import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as items from "./items"
import { MiniDrawer } from "../../components/miniDrawers"
import { ZoomControls } from "../../phaser"
import { usePhaserGameContext } from "../../app/hooks"

export interface ControlsProps {}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const {
    ref: { current: phaserGame },
    activeSceneKeys,
  } = usePhaserGameContext()

  // The currently selected box and tool.
  const [toolbox, setToolbox] =
    useState<Phaser.Types.Scenes.Create.Toolbox.Any>({
      box: "road",
      tool: "add",
    })

  // If react changes the toolbox, mirror that change into Phaser so that the
  // Phaser scene can react to it.
  useEffect(() => {
    if (phaserGame) phaserGame.setVariable("toolbox", toolbox)
  }, [phaserGame, toolbox])

  // If Phaser changes the toolbox, mirror that change into React so that the
  // React component can react to it.
  useEffect(() => {
    if (phaserGame)
      return phaserGame.getVariable<typeof toolbox>("toolbox", setToolbox, {
        box: "road",
        tool: "add",
      })
  }, [phaserGame])

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && <ZoomControls />}
      <MiniDrawer
        open={isDrawerOpen}
        onToggle={() => {
          setIsDrawerOpen(!isDrawerOpen)
        }}
      >
        <items.RoadButton
          isDrawerOpen={isDrawerOpen}
          tool={toolbox.box === "road" ? toolbox.tool : undefined}
          setTool={tool => setToolbox({ box: "road", tool })}
        />
        <items.EndpointsButton
          isDrawerOpen={isDrawerOpen}
          tool={toolbox.box === "endpoints" ? toolbox.tool : undefined}
          setTool={tool => setToolbox({ box: "endpoints", tool })}
        />
        <items.ObstaclesButton
          isDrawerOpen={isDrawerOpen}
          tool={toolbox.box === "obstacles" ? toolbox.tool : undefined}
          setTool={tool => setToolbox({ box: "obstacles", tool })}
        />
        <items.SceneryButton
          isDrawerOpen={isDrawerOpen}
          tool={toolbox.box === "scenery" ? toolbox.tool : undefined}
          setTool={tool => setToolbox({ box: "scenery", tool })}
        />
        <items.BackgroundButton
          isDrawerOpen={isDrawerOpen}
          tool={toolbox.box === "background" ? toolbox.tool : undefined}
          setTool={tool => setToolbox({ box: "background", tool })}
        />
        <Divider />
        <items.CharacterButton isDrawerOpen={isDrawerOpen} />
        <items.CodeButton isDrawerOpen={isDrawerOpen} />
        <items.DescriptionButton isDrawerOpen={isDrawerOpen} />
        <Divider />
        <items.LoadButton isDrawerOpen={isDrawerOpen} />
        <items.SaveButton isDrawerOpen={isDrawerOpen} />
        <items.ShareButton isDrawerOpen={isDrawerOpen} />
        <Divider />
        <items.HelpButton isDrawerOpen={isDrawerOpen} />
        <items.QuitButton isDrawerOpen={isDrawerOpen} />
      </MiniDrawer>
    </>
  )
}

export default Controls
