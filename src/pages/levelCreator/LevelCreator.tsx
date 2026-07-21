import { type FC, useRef, useState } from "react"
import { Box } from "@mui/material"

import { PhaserGame, PhaserGameContext, type PhaserGameRef } from "../../phaser"
import Controls from "./Controls"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const phaserGameRef = useRef<PhaserGameRef>(null)
  const [phaserIsInitialized, setPhaserIsInitialized] = useState(false)

  return (
    <Box sx={{ display: "flex" }}>
      <PhaserGameContext.Provider
        value={{ ref: phaserGameRef, isInitialized: phaserIsInitialized }}
      >
        <Controls />
        <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
          <PhaserGame
            mode="create"
            onInitialized={() => setPhaserIsInitialized(true)}
          />
        </Box>
      </PhaserGameContext.Provider>
    </Box>
  )
}

export default LevelCreator
