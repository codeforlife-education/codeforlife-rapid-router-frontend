import { type FC, useRef, useState } from "react"
import { Box } from "@mui/material"

import {
  PhaserGame,
  PhaserGameContext,
  type PhaserGameRef,
  type SceneKey,
} from "../../phaser"
import Controls from "./Controls"

export interface LevelCreatorProps {}

const LevelCreator: FC<LevelCreatorProps> = () => {
  const phaserGameRef = useRef<PhaserGameRef>(null)
  const [activeSceneKeys, setActiveSceneKeys] = useState<SceneKey[]>([])
  return (
    <Box sx={{ display: "flex" }}>
      <PhaserGameContext.Provider
        value={{ ref: phaserGameRef, activeSceneKeys, setActiveSceneKeys }}
      >
        <Controls />
        <Box component="main" sx={{ flex: 1, minWidth: 0, height: "100vh" }}>
          <PhaserGame mode="create" />
        </Box>
      </PhaserGameContext.Provider>
    </Box>
  )
}

export default LevelCreator
