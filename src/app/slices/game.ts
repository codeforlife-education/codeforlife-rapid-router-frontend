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
  gameCommands: GameCommand[]
  gameCommandIndex: number
  gameOver: boolean
}

const startGameCommandIndex = -1 // indicates start before the first command
const initialState: GameState = Object.freeze({
  gameCommands: [],
  gameCommandIndex: startGameCommandIndex,
  gameOver: false,
})

// Helper functions to determine game state.
function gameIsDefined(state: GameState): boolean {
  return state.gameCommands.length > 0
}
function gameHasStarted(state: GameState): boolean {
  return state.gameCommandIndex > startGameCommandIndex
}
function gameHasFinished(state: GameState): boolean {
  return state.gameCommandIndex === state.gameCommands.length
}
function gameHasFinishedEarly(state: GameState): boolean {
  return state.gameOver && gameHasStarted(state) && !gameHasFinished(state)
}
function gameInPlay(state: GameState): boolean {
  return !state.gameOver && gameHasStarted(state) && !gameHasFinished(state)
}
function _restartGame(state: GameState): void {
  state.gameCommandIndex = startGameCommandIndex
  state.gameOver = false
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: create => ({
    setGameCommands: create.reducer(
      (state, action: PayloadAction<GameCommand[]>) => {
        state.gameCommands = action.payload
        _restartGame(state)
      },
    ),
    nextGameCommand: create.reducer(state => {
      if (!gameIsDefined(state)) return
      if (state.gameOver) _restartGame(state)
      state.gameCommandIndex = state.gameCommandIndex + 1
      if (gameHasFinished(state)) state.gameOver = true
    }),
    restartGame: create.reducer(_restartGame),
    finishGameEarly: create.reducer((state, action: PayloadAction<number>) => {
      if (
        gameIsDefined(state) &&
        action.payload >= 0 &&
        action.payload < state.gameCommands.length
      ) {
        state.gameCommandIndex = action.payload
        state.gameOver = true
      } else _restartGame(state)
    }),
  }),
  selectors: {
    selectGameCommands: state => state.gameCommands,
    selectGameCommandIndex: state => state.gameCommandIndex,
    selectGameOver: state => state.gameOver,
    selectCurrentGameCommand: state =>
      gameInPlay(state)
        ? state.gameCommands[state.gameCommandIndex]
        : undefined,
    selectGameIsDefined: gameIsDefined,
    selectGameHasStarted: gameHasStarted,
    selectGameHasFinished: gameHasFinished,
    selectGameHasFinishedEarly: gameHasFinishedEarly,
    selectGameInPlay: gameInPlay,
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
  selectGameOver,
  selectCurrentGameCommand,
  selectGameIsDefined,
  selectGameHasStarted,
  selectGameHasFinished,
  selectGameHasFinishedEarly,
  selectGameInPlay,
} = gameSlice.selectors
