import { type FC, useState } from "react"
import { Box } from "@mui/material"

import Controls from "./Controls"
import { PhaserGame } from "../../phaser"
import SubControls from "./SubControls"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const [isSubControlsOpen, setIsSubControlsOpen] = useState(false)
  return (
    <Box sx={{ display: "flex" }}>
      <Controls
        onSelectCodeClick={() => setIsSubControlsOpen(!isSubControlsOpen)}
      />
      <SubControls open={isSubControlsOpen} />
      <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
        <PhaserGame mode="create" />
      </Box>
    </Box>
  )
}

export default LevelCreator
