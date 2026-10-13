// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { type Breakpoint, useMediaQuery, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useContext } from "react"

import type { AppDispatch, RootState } from "./store"
import {
  selectGameCommandIndex,
  selectGameCommands,
  selectGameIsDefined,
  selectGameOnLastStep,
  selectGameRunId,
  selectSettings,
} from "./slices"
import { BlocklyWorkspaceContext } from "../blockly"
import { ConsoleLogContext } from "../codeMirror"
import { PhaserGameContext } from "../phaser"
import { PythonEditorContext } from "../codeMirror/python"

export type ScreenOrientation = "portrait" | "landscape"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useScreenOrientation = () =>
  typeof window !== "undefined"
    ? (window.screen.orientation.type.split("-")[0] as ScreenOrientation)
    : "landscape"

export function useBreakpoint() {
  let result
  const theme = useTheme()
  for (const key of theme.breakpoints.keys) {
    // eslint-disable-next-line
    const matches = useMediaQuery(theme.breakpoints.only(key))
    if (matches) result = key
  }
  return result as Breakpoint
}

// Slice selectors
export const useSettings = () => useSelector(selectSettings)
export const useGameCommands = () => useSelector(selectGameCommands)
export const useGameCommandIndex = () => useSelector(selectGameCommandIndex)
export const useGameRunId = () => useSelector(selectGameRunId)
export const useGameIsDefined = () => useSelector(selectGameIsDefined)
export const useGameOnLastStep = () => useSelector(selectGameOnLastStep)

// Contexts
export const useBlocklyWorkspaceContext = () =>
  useContext(BlocklyWorkspaceContext)
export const usePhaserGameContext = () => useContext(PhaserGameContext)
export const usePythonEditorContext = () => useContext(PythonEditorContext)
export const useConsoleLogContext = () => useContext(ConsoleLogContext)
