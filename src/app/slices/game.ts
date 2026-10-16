import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

export const GAME_COMMANDS = [
  "move_forwards",
  "turn_left",
  "turn_right",
  "turn_around",
  "wait",
  "deliver",
  "sound_horn",
] as const
export type GameCommand = (typeof GAME_COMMANDS)[number]

/** The amount of fuel each command costs to execute. */
export const FUEL_COST: Record<GameCommand, number> = {
  move_forwards: 1,
  turn_left: 1,
  turn_right: 1,
  turn_around: 1,
  wait: 1,
  deliver: 1,
  sound_horn: 1,
}

export interface GameState {
  /** The interpreted command sequence. */
  gameCommands: GameCommand[]
  /** True for `gameCommands` entries synthesised purely for editor
   * highlighting (e.g. a loop/if header line) - not a real command the
   * player issued, so it must not cost fuel (see `FUEL_COST`). */
  gameCommandSynthetic: boolean[]
  /** The index of the current game command being executed. */
  gameCommandIndex: number
  /** Bumped on every (re)start, so Phaser can detect a fresh run regardless
   * of where `gameCommandIndex` happens to land. */
  runId: number
}

const initialState: GameState = Object.freeze({
  gameCommands: [],
  gameCommandSynthetic: [],
  gameCommandIndex: 0,
  runId: 0,
})

// Helper functions to determine game state.
function gameIsDefined(state: GameState): boolean {
  return state.gameCommands.length > 0
}
function gameOnLastStep(state: GameState): boolean {
  return (
    gameIsDefined(state) &&
    state.gameCommandIndex === state.gameCommands.length - 1
  )
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: create => ({
    setGameCommands: create.reducer(
      (state, action: PayloadAction<GameState["gameCommands"]>) => {
        state.gameCommands = action.payload
        state.gameCommandIndex = 0
        state.runId += 1
      },
    ),
    /** Sets which of the current `gameCommands` are synthetic (editor-
     * highlight-only) - dispatched separately from `setGameCommands` since
     * only the Python run pipeline knows this (Blockly-derived commands are
     * never synthetic). */
    setGameCommandSynthetic: create.reducer(
      (state, action: PayloadAction<boolean[]>) => {
        state.gameCommandSynthetic = action.payload
      },
    ),
    nextGameCommand: create.reducer(state => {
      if (!gameIsDefined(state) || gameOnLastStep(state)) return
      state.gameCommandIndex += 1
    }),
    restartGame: create.reducer(state => {
      state.gameCommandIndex = 0
      state.runId += 1
    }),
    finishGameEarly: create.reducer((state, action: PayloadAction<number>) => {
      if (
        gameIsDefined(state) &&
        action.payload >= 0 &&
        action.payload < state.gameCommands.length
      )
        state.gameCommandIndex = action.payload
    }),
  }),
  selectors: {
    selectGameCommands: state => state.gameCommands,
    selectGameCommandSynthetic: state => state.gameCommandSynthetic,
    selectGameCommandIndex: state => state.gameCommandIndex,
    selectGameRunId: state => state.runId,
    selectGameIsDefined: gameIsDefined,
    selectGameOnLastStep: gameOnLastStep,
  },
})

export const {
  setGameCommands,
  setGameCommandSynthetic,
  nextGameCommand,
  restartGame,
  finishGameEarly,
} = gameSlice.actions
export const {
  selectGameCommands,
  selectGameCommandSynthetic,
  selectGameCommandIndex,
  selectGameRunId,
  selectGameIsDefined,
  selectGameOnLastStep,
} = gameSlice.selectors
