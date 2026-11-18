import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  createContext,
} from "react"

import type { SceneKey, Variable } from "./globals"
import type { LevelOutcome } from "./LevelSimulator"

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

/** What to tell the player once a run's over (or couldn't start): the
 * level's outcome, or a problem with the program itself. */
export type LevelResult =
  | LevelOutcome
  /** Blocks exist, but none are connected to the start block. */
  | { success: false; reason: "start_disconnected" }
  /** The program couldn't be run (e.g. calling an unknown procedure). */
  | { success: false; reason: "program_error"; message: string }

export type LevelResultFailure = Exclude<LevelResult, { success: true }>

export type PhaserGameContextValue = {
  ref: RefObject<PhaserGameRef | null>
  activeSceneKeys: SceneKey[]
  setActiveSceneKeys: Dispatch<SetStateAction<SceneKey[]>>
  phase: GamePhase
  setPhase: Dispatch<SetStateAction<GamePhase>>
  maxFuel?: number
  /** The result to show the player, if any - only tracked in play mode. */
  levelResult?: LevelResult
  setLevelResult?: Dispatch<SetStateAction<LevelResult | undefined>>
}

const PhaserGameContext = createContext<PhaserGameContextValue>({
  ref: { current: null },
  activeSceneKeys: [],
  setActiveSceneKeys: () => {},
  phase: "idle",
  setPhase: () => {},
})

export default PhaserGameContext
