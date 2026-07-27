import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type { SceneKey } from "./globals"
import type { Toolbox } from "./scenes/create"

export type PhaserGameRef = {
  zoom: { in: () => void; out: () => void }
  setCreateToolbox: (toolbox: Toolbox) => void
}

export type PhaserGameContextValue = {
  ref: RefObject<PhaserGameRef | null>
  activeSceneKeys: SceneKey[]
  setActiveSceneKeys: Dispatch<SetStateAction<SceneKey[]>>
}

const PhaserGameContext = createContext<PhaserGameContextValue>({
  ref: { current: null },
  activeSceneKeys: [],
  setActiveSceneKeys: () => {},
})

export default PhaserGameContext
