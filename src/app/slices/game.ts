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

export interface GameState {
  gameCommands: {
    command: GameCommand
    /** The originating Blockly block IDs. */
    blockIds?: string[]
    /** The source line (1-indexed). */
    lineNo?: number
  }[]
  /** The index of the current game command being executed. */
  gameCommandIndex: number
  /** Bumped on every (re)start, so Phaser can detect a fresh run regardless
   * of where `gameCommandIndex` happens to land. */
  runId: number
}

const initialState: GameState = Object.freeze({
  gameCommands: [],
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
    selectGameCommandIndex: state => state.gameCommandIndex,
    selectGameRunId: state => state.runId,
    selectGameIsDefined: gameIsDefined,
    selectGameOnLastStep: gameOnLastStep,
  },
})

export const {
  setGameCommands,
  nextGameCommand,
  restartGame,
  finishGameEarly,
} = gameSlice.actions
export const {
  selectGameCommands,
  selectGameCommandIndex,
  selectGameRunId,
  selectGameIsDefined,
  selectGameOnLastStep,
} = gameSlice.selectors
