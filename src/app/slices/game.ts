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
  "at_dead_end",
  "at_destination",
  "at_red_traffic_light",
  "is_road_forward",
  "is_road_left",
  "is_road_right",
  "is_animal_crossing",
] as const
export type GameCommand = (typeof GAME_COMMANDS)[number]

/** The amount of fuel each command costs to execute. Sensing/boolean
 * commands never cost fuel - only real movement/action commands do. */
export const FUEL_COST: Record<GameCommand, number> = {
  move_forwards: 1,
  turn_left: 1,
  turn_right: 1,
  turn_around: 1,
  wait: 1,
  deliver: 1,
  sound_horn: 1,
  at_dead_end: 0,
  at_destination: 0,
  at_red_traffic_light: 0,
  is_road_forward: 0,
  is_road_left: 0,
  is_road_right: 0,
  is_animal_crossing: 0,
}

export interface GameState {
  gameCommands: GameCommand[]
  /** The Python source line (1-indexed) that produced each `gameCommands` entry. */
  gameCommandLines: number[]
  /** The originating Blockly block ID for each `gameCommands` entry, when
   * the commands came from a compiled Blockly workspace (`null` otherwise). */
  gameCommandBlocks: (string | null)[]
  /** True for `gameCommands` entries synthesised purely for editor
   * highlighting (e.g. a loop/if header line) - not a real command the
   * player issued, so it must not cost fuel (see `FUEL_COST`). */
  gameCommandSynthetic: boolean[]
  gameCommandIndex: number
  gameOver: boolean
}

const startGameCommandIndex = -1 // indicates start before the first command
const initialState: GameState = Object.freeze({
  gameCommands: [],
  gameCommandLines: [],
  gameCommandBlocks: [],
  gameCommandSynthetic: [],
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
      (
        state,
        action: PayloadAction<{
          commands: GameCommand[]
          lines: number[]
          blocks?: (string | null)[]
          synthetic?: boolean[]
        }>,
      ) => {
        state.gameCommands = action.payload.commands
        state.gameCommandLines = action.payload.lines
        state.gameCommandBlocks = action.payload.blocks ?? []
        state.gameCommandSynthetic = action.payload.synthetic ?? []
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
    selectGameCommandLines: state => state.gameCommandLines,
    selectGameCommandBlocks: state => state.gameCommandBlocks,
    selectGameCommandSynthetic: state => state.gameCommandSynthetic,
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
  selectGameCommandLines,
  selectGameCommandBlocks,
  selectGameCommandSynthetic,
  selectGameCommandIndex,
  selectGameOver,
  selectCurrentGameCommand,
  selectGameIsDefined,
  selectGameHasStarted,
  selectGameHasFinished,
  selectGameHasFinishedEarly,
  selectGameInPlay,
} = gameSlice.selectors
