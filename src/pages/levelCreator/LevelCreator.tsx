import { type FC, useRef, useState } from "react"
import { Box } from "@mui/material"

import {
  PhaserGame,
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import CodeModal from "./CodeModal"
import Controls from "./Controls"
import DescriptionModal from "./DescriptionModal"
import { PhaserGame } from "../../phaser"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const phaserGameRef = useRef<PhaserGameRef>(null)
  const [activeSceneKeys, setActiveSceneKeys] = useState<SceneKey[]>([])
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  return (
    <Box sx={{ display: "flex" }}>
      <PhaserGameContext.Provider
        value={{ ref: phaserGameRef, activeSceneKeys, setActiveSceneKeys }}
      >
        <Controls
          onSelectCodeClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
          onSelectDescriptionClick={() =>
            setIsDescriptionModalOpen(!isDescriptionModalOpen)
          }
        />
        <CodeModal
          open={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
        />
        <DescriptionModal
          open={isDescriptionModalOpen}
          onClose={() => setIsDescriptionModalOpen(false)}
        />
        <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
          <PhaserGame mode="create" />
        </Box>
      </PhaserGameContext.Provider>
    </Box>
  )
}

export default LevelCreator
