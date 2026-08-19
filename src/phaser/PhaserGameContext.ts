import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type { SceneKey, Variable } from "./globals"

export type PhaserGameRef = {
  zoomIn: () => void
  zoomOut: () => void
  getVariable: {
    <T>(key: Variable, set: Dispatch<SetStateAction<T | undefined>>): () => void
    <T>(
      key: Variable,
      set: Dispatch<SetStateAction<T>>,
      defaultValue: T,
    ): () => void
  }
  setVariable: (key: Variable, value?: any) => void
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
