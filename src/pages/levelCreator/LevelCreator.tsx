import { type FC, useState } from "react"
import { Box } from "@mui/material"

import CharacterModal from "./CharacterModal"
import CodeModal from "./CodeModal"
import Controls from "./Controls"
import DescriptionModal from "./DescriptionModal"
import { PhaserGame } from "../../phaser"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  return (
    <Box sx={{ display: "flex" }}>
      <Controls
        onSelectCharacterClick={() =>
          setIsCharacterModalOpen(!isCharacterModalOpen)
        }
        onSelectCodeClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
        onSelectDescriptionClick={() =>
          setIsDescriptionModalOpen(!isDescriptionModalOpen)
        }
      />
      <CharacterModal
        open={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
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
    </Box>
  )
}

export default LevelCreator
