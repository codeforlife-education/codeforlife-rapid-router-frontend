import {
  Casino as CasinoIcon,
  Description as DescriptionIcon,
  DriveFolderUpload as DriveFolderUploadIcon,
  EditRoad as EditRoadIcon,
  ExitToApp as ExitToAppIcon,
  Extension as ExtensionIcon,
  Home as HomeIcon,
  Lightbulb as LightbulbIcon,
  Park as ParkIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  QuestionMark as QuestionMarkIcon,
  SaveOutlined as SaveOutlinedIcon,
  Traffic as TrafficIcon,
} from "@mui/icons-material"
import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as endpoints from "./endpoints"
import * as miniDrawers from "../../components/miniDrawers"
import * as obstacles from "./obstacles"
import * as road from "./road"
import * as scenery from "./scenery"
import * as tilesets from "../../phaser/tilesets"
import { ZoomControls } from "../../phaser"
import { usePhaserGameContext } from "../../app/hooks"

export interface ControlsProps {}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const {
    ref: { current: phaserGame },
    activeSceneKeys,
  } = usePhaserGameContext()

  // States for each box's tool - persist the last selected tool for each box.
  const [roadTool, setRoadTool] =
    useState<Phaser.Types.Scenes.Create.Toolbox.Road["tool"]>("add")
  const [endpointsTool, setEndpointsTool] = useState<
    Phaser.Types.Scenes.Create.Toolbox.Endpoints["tool"]
  >(tilesets.IDs.Endpoints.CFC.Warehouse.DEFAULT)
  const [sceneryTool, setSceneryTool] = useState<
    Phaser.Types.Scenes.Create.Toolbox.Scenery["tool"]
  >(tilesets.IDs.Scenery.Nature.BUSH)
  const [obstaclesTool, setObstaclesTool] = useState<
    Phaser.Types.Scenes.Create.Toolbox.Obstacles["tool"]
  >(tilesets.IDs.Obstacles.Animal.COW)
  // The currently selected box and tool.
  const [toolbox, setToolbox] =
    useState<Phaser.Types.Scenes.Create.Toolbox.Any>({
      box: "road",
      tool: roadTool,
    })

  // A helper function to set the tool for a specific box.
  const setTool = <Box extends (typeof toolbox)["box"]>(box: Box) => {
    return (tool: Phaser.Types.Scenes.Create.Toolbox.Any["tool"]) =>
      // @ts-expect-error tool will be in box
      setToolbox({ box, tool })
  }

  // If the toolbox changes, mirror that change in the individual tool states.
  useEffect(() => {
    if (toolbox.box === "road") setRoadTool(toolbox.tool)
    else if (toolbox.box === "endpoints") setEndpointsTool(toolbox.tool)
    else if (toolbox.box === "scenery") setSceneryTool(toolbox.tool)
    else if (toolbox.box === "obstacles") setObstaclesTool(toolbox.tool)
  }, [toolbox])

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

  const makeSelectableButtonItemProps = (
    tb: typeof toolbox,
  ): Pick<
    miniDrawers.ButtonItemProps,
    "id" | "isDrawerOpen" | "selected" | "onClick"
  > => ({
    id: tb.box,
    isDrawerOpen,
    selected: toolbox.box === tb.box,
    onClick: () => setToolbox(tb),
  })

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && (
        <>
          <ZoomControls />
          {toolbox.box === "road" && (
            <road.ToggleButtonGroup tool={roadTool} setTool={setTool("road")} />
          )}
          {toolbox.box === "endpoints" && (
            <endpoints.ImageSelect
              tool={endpointsTool}
              setTool={setTool("endpoints")}
            />
          )}
          {toolbox.box === "scenery" && (
            <>
              <scenery.Counter />
              <scenery.ImageSelect
                tool={sceneryTool}
                setTool={setTool("scenery")}
              />
            </>
          )}
          {toolbox.box === "obstacles" && (
            <obstacles.ImageSelect
              tool={obstaclesTool}
              setTool={setTool("obstacles")}
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
          {...makeSelectableButtonItemProps({ box: "road", tool: roadTool })}
          text="Road"
          icon={<EditRoadIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps({
            box: "endpoints",
            tool: endpointsTool,
          })}
          text="Start & End Points"
          icon={<HomeIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps({
            box: "obstacles",
            tool: obstaclesTool,
          })}
          text="Obstacles"
          icon={<TrafficIcon />}
        />
        <miniDrawers.ButtonItem
          {...makeSelectableButtonItemProps({
            box: "scenery",
            tool: sceneryTool,
          })}
          text="Scenery"
          icon={<ParkIcon />}
        />
        <Divider />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Character"
          icon={<PersonIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Code"
          icon={<ExtensionIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Random"
          icon={<CasinoIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Description"
          icon={<DescriptionIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
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
