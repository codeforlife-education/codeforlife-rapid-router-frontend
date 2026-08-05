import {
  Casino as CasinoIcon,
  Description as DescriptionIcon,
  DriveFolderUpload as DriveFolderUploadIcon,
  ExitToApp as ExitToAppIcon,
  Extension as ExtensionIcon,
  Lightbulb as LightbulbIcon,
  Park as ParkIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  QuestionMark as QuestionMarkIcon,
  Route as RouteIcon,
  SaveOutlined as SaveOutlinedIcon,
  Traffic as TrafficIcon,
} from "@mui/icons-material"
import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as miniDrawers from "../../components/miniDrawers"
import * as route from "./route"
import * as scenery from "./scenery"
import * as tilesets from "../../phaser/tilesets"
import { ZoomControls } from "../../phaser"
import { usePhaserGameContext } from "../../app/hooks"

type SelectableButtonId =
  | "route"
  | "obstacles"
  | "scenery"
  | "character"
  | "code"
  | "random"
  | "description"
  | "hint"

export interface ControlsProps {}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<SelectableButtonId>("route")
  const {
    ref: { current: phaserGame },
    activeSceneKeys,
  } = usePhaserGameContext()

  const routeSpeedDialProps = {
    openState: useState(false),
    selectedState: useState("add-road"),
  } as route.SpeedDialProps
  const sceneryImageSelectProps = {
    openState: useState(false),
    selectedState: useState(tilesets.IDs.Scenery.Nature.BUSH),
  } as scenery.ImageSelectProps

  // Update the Phaser game tool whenever the selected tool changes.
  useEffect(() => {
    if (!phaserGame || (selected !== "route" && selected !== "scenery")) return
    phaserGame.setVariable(
      "toolbox",
      selected === "route"
        ? ({
            box: selected,
            tool: routeSpeedDialProps.selectedState[0],
          } as Phaser.Types.Scenes.Create.Toolbox.Route)
        : ({
            box: selected,
            tool: sceneryImageSelectProps.selectedState[0],
          } as Phaser.Types.Scenes.Create.Toolbox.Scenery),
    )
  }, [
    phaserGame,
    selected,
    routeSpeedDialProps.selectedState,
    sceneryImageSelectProps.selectedState,
  ])

  const makeSelectableButtonItemProps = (
    id: SelectableButtonId,
  ): Pick<
    miniDrawers.ButtonItemProps,
    "id" | "isDrawerOpen" | "selected" | "onClick"
  > => ({
    id,
    isDrawerOpen,
    selected: selected === id,
    onClick: () => setSelected(id),
  })

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && (
        <>
          <ZoomControls />
          {selected === "route" && <route.SpeedDial {...routeSpeedDialProps} />}
          {selected === "scenery" && (
            <>
              <scenery.Counter />
              <scenery.ImageSelect {...sceneryImageSelectProps} />
            </>
          )}
        </>
      )}
      <miniDrawers.MiniDrawer
        open={isDrawerOpen}
        onToggle={() => {
          setIsDrawerOpen(!isDrawerOpen)
        }}
      >
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("route")}
          text="Route"
          icon={<RouteIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("obstacles")}
          text="Obstacles"
          icon={<TrafficIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("scenery")}
          text="Scenery"
          icon={<ParkIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("character")}
          text="Character"
          icon={<PersonIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("code")}
          text="Code"
          icon={<ExtensionIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("random")}
          text="Random"
          icon={<CasinoIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("description")}
          text="Description"
          icon={<DescriptionIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps("hint")}
          text="Hint"
          icon={<LightbulbIcon />}
        />
        <Divider />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Load"
          icon={<DriveFolderUploadIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Save"
          icon={<SaveOutlinedIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Share"
          icon={<PeopleIcon />}
        />
        <Divider />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Help"
          icon={<QuestionMarkIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Quit"
          icon={<ExitToAppIcon />}
        />
      </miniDrawers.MiniDrawer>
    </>
  )
}

export default Controls
