import { type FC, useState } from "react"
import { Box } from "@mui/material"

import CodeModal from "./CodeModal"
import Controls from "./Controls"
import DescriptionModal from "./DescriptionModal"
import { PhaserGame } from "../../phaser"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  return (
    <Box sx={{ display: "flex" }}>
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
    </Box>
  )
}

export default LevelCreator
