import { type FC, useEffect, useState } from "react"
import { Divider } from "@mui/material"
import type Phaser from "phaser"

import * as items from "./items"
import CharacterModal, { type Character } from "./CharacterModal"
import CodeModal, { type Code } from "./CodeModal"
import DescriptionModal, { type Description } from "./DescriptionModal"
import { DELETABLE_CUSTOM_BLOCKS } from "../../blockly/blocks"
import { MiniDrawer } from "../../components/miniDrawers"
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
        <items.CharacterButton
          isDrawerOpen={isDrawerOpen}
          onClick={() => setActiveModal("character")}
        />
        <items.CodeButton
          isDrawerOpen={isDrawerOpen}
          onClick={() => setActiveModal("code")}
        />
        <items.DescriptionButton
          isDrawerOpen={isDrawerOpen}
          onClick={() => setActiveModal("description")}
        />
        <Divider />
        <items.LoadButton isDrawerOpen={isDrawerOpen} />
        <items.SaveButton isDrawerOpen={isDrawerOpen} />
        <items.ShareButton isDrawerOpen={isDrawerOpen} />
        <Divider />
        <items.HelpButton isDrawerOpen={isDrawerOpen} />
        <items.QuitButton isDrawerOpen={isDrawerOpen} />
      </MiniDrawer>
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
