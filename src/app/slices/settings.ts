import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "codeforlife/slices"

import { DEFAULT_LANGUAGE, type Language } from "../../blockly/messages"
import { getSettingsCookie } from "../utils"

// undefined represents the "auto" layout option.
export const TWO_PANEL_LAYOUTS = [undefined, "vertical", "horizontal"] as const
export const THREE_PANEL_LAYOUTS = [
  undefined,
  "vertical",
  "horizontal",
] as const
export type TwoPanelLayout = (typeof TWO_PANEL_LAYOUTS)[number]
export type ThreePanelLayout = (typeof THREE_PANEL_LAYOUTS)[number]
// The two- and three-panel layouts currently happen to be the same options,
// but are kept as a union so this stays correct if they diverge again.
// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export type PanelLayout = TwoPanelLayout | ThreePanelLayout

export const PLAY_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const
export type PlaySpeed = (typeof PLAY_SPEEDS)[number]

export interface SettingsState {
  twoPanelLayout: TwoPanelLayout
  threePanelLayout: ThreePanelLayout
  playSpeed: PlaySpeed
  language: Language
  muted: boolean
}

const DEFAULT_SETTINGS: SettingsState = Object.freeze({
  twoPanelLayout: undefined, // "auto"
  threePanelLayout: undefined, // "auto"
  playSpeed: 1,
  language: DEFAULT_LANGUAGE,
  muted: false,
})

/**
 * Loads the settings saved in the cookie, filling in any settings added since
 * it was saved.
 */
export function getSavedSettings(): SettingsState {
  return { ...DEFAULT_SETTINGS, ...getSettingsCookie() }
}

export const settingsSlice = createSlice({
  name: "settings",
  // Always start from the defaults, as the cookie can't be read on the server,
  // so the client's first render matches the server-rendered HTML. The saved
  // settings are then loaded once hydrated (see `loadSavedSettings` in App).
  initialState: DEFAULT_SETTINGS,
  reducers: create => ({
    // NOTE: Deliberately not one of the settings middleware's write actions,
    // as there's no need to write the cookie's own settings back to it.
    loadSavedSettings: create.reducer(
      (_state, action: PayloadAction<SettingsState>) => action.payload,
    ),
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
  loadSavedSettings,
  setTwoPanelLayout,
  setThreePanelLayout,
  setPlaySpeed,
  setLanguage,
  setMuted,
} = settingsSlice.actions
export const { selectSettings } = settingsSlice.selectors
