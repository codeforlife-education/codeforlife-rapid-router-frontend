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
  exportLevel: () => void
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

/** The lifecycle of a play-mode run - tracked here, rather than alongside
 * `gameCommandIndex` in the `game` slice, since it's fundamentally about
 * playback pacing, which is Phaser's concern. */
export type GamePhase = "idle" | "playing" | "paused" | "finished" | "crashed"

export type PhaserGameContextValue = {
  ref: RefObject<PhaserGameRef | null>
  activeSceneKeys: SceneKey[]
  setActiveSceneKeys: Dispatch<SetStateAction<SceneKey[]>>
  phase: GamePhase
  setPhase: Dispatch<SetStateAction<GamePhase>>
  maxFuel?: number
}

const PhaserGameContext = createContext<PhaserGameContextValue>({
  ref: { current: null },
  activeSceneKeys: [],
  setActiveSceneKeys: () => {},
  phase: "idle",
  setPhase: () => {},
})

export default PhaserGameContext
