import {
  Casino as CasinoIcon,
  Description as DescriptionIcon,
  DriveFolderUpload as DriveFolderUploadIcon,
  EditRoad as EditRoadIcon,
  ExitToApp as ExitToAppIcon,
  Extension as ExtensionIcon,
  Lightbulb as LightbulbIcon,
  Park as ParkIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  QuestionMark as QuestionMarkIcon,
  SaveOutlined as SaveOutlinedIcon,
} from "@mui/icons-material"
import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as miniDrawers from "../../components/miniDrawers"
import * as tilesets from "../../phaser/tilesets"
import MapSpeedDial from "./MapSpeedDial"
import SceneryImageSelect from "./SceneryImageSelect"
import { ZoomControls } from "../../phaser"
import { usePhaserGameContext } from "../../app/hooks"

type SelectableButtonId =
  | "map"
  | "scenery"
  | "character"
  | "code"
  | "random"
  | "description"
  | "hint"

export interface ControlsProps {}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<SelectableButtonId>("map")
  const mapOpenState = useState(false)
  const mapSelectedState =
    useState<Phaser.Types.Scenes.Create.Toolbox.Map["tool"]>("add-road")
  const sceneryOpenState = useState(false)
  const scenerySelectedState = useState<tilesets.scenery.ID>(
    tilesets.IDs.Scenery.Common.BUSH,
  )
  const {
    ref: { current: phaserGame },
    activeSceneKeys,
  } = usePhaserGameContext()

  // Update the Phaser game tool whenever the selected tool changes.
  useEffect(() => {
    if (!phaserGame || (selected !== "map" && selected !== "scenery")) return
    phaserGame.setVariable(
      "toolbox",
      selected === "map"
        ? ({
            box: selected,
            tool: mapSelectedState[0],
          } as Phaser.Types.Scenes.Create.Toolbox.Map)
        : ({
            box: selected,
            tool: scenerySelectedState[0],
          } as Phaser.Types.Scenes.Create.Toolbox.Scenery),
    )
  }, [phaserGame, selected, mapSelectedState, scenerySelectedState])

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
          {selected === "map" && (
            <MapSpeedDial
              openState={mapOpenState}
              selectedState={mapSelectedState}
            />
          )}
          {selected === "scenery" && (
            <SceneryImageSelect
              openState={sceneryOpenState}
              selectedState={scenerySelectedState}
            />
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
          {...makeSelectableButtonItemProps("map")}
          text="Map"
          icon={<EditRoadIcon />}
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
