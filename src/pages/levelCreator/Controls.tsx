import {
  // Casino as CasinoIcon,
  CloudDownload as CloudDownloadIcon,
  Description as DescriptionIcon,
  EditRoad as EditRoadIcon,
  ExitToApp as ExitToAppIcon,
  Extension as ExtensionIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Park as ParkIcon,
  People as PeopleIcon,
  Save as SaveIcon,
  Traffic as TrafficIcon,
} from "@mui/icons-material"
import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as miniDrawers from "../../components/miniDrawers"
import * as tilesets from "../../phaser/tilesets"
import CharacterModal, { type Character } from "./CharacterModal"
import CodeModal, { type Code } from "./CodeModal"
import DescriptionModal, { type Description } from "./DescriptionModal"
import { DELETABLE_CUSTOM_BLOCKS } from "../../blockly/blocks"
import EndpointsControls from "./endpoints/Controls"
import ObstaclesControls from "./obstacles/Controls"
import RoadControls from "./road/Controls"
import SceneryControls from "./scenery/Controls"
import { ZoomControls } from "../../phaser"
import { usePhaserGameContext } from "../../app/hooks"

const Controls: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const {
    ref: { current: phaserGame },
    activeSceneKeys,
  } = usePhaserGameContext()

  // States for the modals and their content.
  const [code, setCode] = useState<Code>({
    language: "Blockly",
    maxMoves: 50,
    blocks: DELETABLE_CUSTOM_BLOCKS.reduce(
      (blocks, { type }) => ({
        ...blocks,
        [type]: { count: "infinite", enabled: true },
      }),
      {} as Code["blocks"],
    ),
  })
  const [description, setDescription] = useState<Description>({
    subtitle: "",
    description: "",
    hint: "",
  })
  const [character, setCharacter] = useState<Character>("van")
  // The currently active modal, if any.
  const [activeModal, setActiveModal] = useState<
    "code" | "description" | "character"
  >()

  // A helper function to close any active modal.
  const closeModal = () => setActiveModal(undefined)

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

  const toolboxControls = {
    road: <RoadControls tool={roadTool} setTool={setTool("road")} />,
    endpoints: (
      <EndpointsControls tool={endpointsTool} setTool={setTool("endpoints")} />
    ),
    scenery: (
      <SceneryControls tool={sceneryTool} setTool={setTool("scenery")} />
    ),
    obstacles: (
      <ObstaclesControls tool={obstaclesTool} setTool={setTool("obstacles")} />
    ),
  }[toolbox.box]

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && (
        <>
          <ZoomControls />
          {toolboxControls}
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
          icon={<LocalShippingIcon />}
          onClick={() => setActiveModal("character")}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Code"
          icon={<ExtensionIcon />}
          onClick={() => setActiveModal("code")}
        />
        {/* TODO: Implement random road generator */}
        {/* <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("random")}
        text="Random"
        icon={<CasinoIcon />}
        /> */}
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Description"
          icon={<DescriptionIcon />}
          onClick={() => setActiveModal("description")}
        />
        <Divider />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Load"
          icon={<CloudDownloadIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Save"
          icon={<SaveIcon />}
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
          icon={<HelpIcon />}
        />
        <miniDrawers.ButtonItem
          isDrawerOpen={isDrawerOpen}
          text="Quit"
          icon={<ExitToAppIcon />}
        />
      </miniDrawers.MiniDrawer>
      <CodeModal
        open={activeModal === "code"}
        value={code}
        onClose={closeModal}
        onSubmit={setCode}
      />
      <DescriptionModal
        open={activeModal === "description"}
        value={description}
        onClose={closeModal}
        onSubmit={setDescription}
      />
      <CharacterModal
        open={activeModal === "character"}
        value={character}
        onClose={closeModal}
        onSubmit={setCharacter}
      />
    </>
  )
}

export default Controls
