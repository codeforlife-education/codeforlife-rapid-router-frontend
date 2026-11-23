import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { DEFAULT_LANGUAGE, type Language } from "../../blockly/messages"
import { getSettingsCookie } from "../utils"

// undefined represents the "auto" layout option.
export const TWO_PANEL_LAYOUTS = [undefined, "vertical", "horizontal"] as const
export const THREE_PANEL_LAYOUTS = [
  undefined,
  "verticalWithLeftHorizontal",
  "vertical",
  "horizontal",
] as const
export type TwoPanelLayout = (typeof TWO_PANEL_LAYOUTS)[number]
export type ThreePanelLayout = (typeof THREE_PANEL_LAYOUTS)[number]
export type PanelLayout = TwoPanelLayout | ThreePanelLayout

export const PLAY_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const
export type PlaySpeed = (typeof PLAY_SPEEDS)[number]

export interface SettingsState {
  twoPanelLayout: TwoPanelLayout
  threePanelLayout: ThreePanelLayout
  playSpeed: PlaySpeed
  language: Language
  /** Whether the game's (and Blockly's) sounds are muted. */
  muted: boolean
}

const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: undefined, // "auto"
  threePanelLayout: undefined, // "auto"
  playSpeed: 1,
  language: DEFAULT_LANGUAGE,
  muted: false,
})

export const settingsSlice = createSlice({
  name: "settings",
  // Fill in any settings added since the cookie was saved.
  initialState: { ...DEFAULT_SETTINGS, ...getSettingsCookie() },
  reducers: create => ({
    setTwoPanelLayout: create.reducer(
      (state, action: PayloadAction<TwoPanelLayout>) => {
        state.twoPanelLayout = action.payload
      },
    ),
    setThreePanelLayout: create.reducer(
      (state, action: PayloadAction<ThreePanelLayout>) => {
        state.threePanelLayout = action.payload
      },
    ),
    setPlaySpeed: create.reducer((state, action: PayloadAction<PlaySpeed>) => {
      state.playSpeed = action.payload
    }),
    setLanguage: create.reducer((state, action: PayloadAction<Language>) => {
      state.language = action.payload
    }),
    setMuted: create.reducer((state, action: PayloadAction<boolean>) => {
      state.muted = action.payload
    }),
  }),
  selectors: { selectSettings: settings => settings },
})

export const {
  setTwoPanelLayout,
  setThreePanelLayout,
  setPlaySpeed,
  setLanguage,
  setMuted,
} = settingsSlice.actions
export const { selectSettings } = settingsSlice.selectors
