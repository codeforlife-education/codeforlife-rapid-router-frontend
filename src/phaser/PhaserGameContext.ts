import { type RefObject, createContext } from "react"

import type { Toolbox } from "./scenes/create"

export type PhaserGameRef = {
  setCreateToolbox: (toolbox: Toolbox) => void
}

export type PhaserGameContextValue = {
  ref: RefObject<PhaserGameRef | null>
  isInitialized: boolean
  onInitialized: () => void
}

const PhaserGameContext = createContext<PhaserGameContextValue | null>(null)

export default PhaserGameContext
