import { useCallback, useEffect, useRef } from "react"

import {
  useAppDispatch,
  useGameIsDefined,
  useGameOnLastStep,
  usePhaserGameContext,
  useSettings,
} from "../app/hooks"
import { RUN_START_DELAY_MS } from "./globals"
import { nextGameCommand } from "../app/slices"

/**
 * Owns the timer that auto-advances `gameCommandIndex` during play, pacing
 * each tick to the player's chosen speed, and keeps `PhaserGameContext`'s
 * `GamePhase` in sync with it.
 */
export function usePlayInterval() {
  const dispatch = useAppDispatch()
  const { playSpeed } = useSettings()
  const gameIsDefined = useGameIsDefined()
  const gameOnLastStep = useGameOnLastStep()
  const { phase, setPhase } = usePhaserGameContext()
  const intervalRef = useRef<null | ReturnType<typeof setInterval>>(null)
  const startTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null)

  const clearPlayInterval = useCallback(() => {
    if (!intervalRef.current && !startTimeoutRef.current) return false
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current)
    intervalRef.current = null
    startTimeoutRef.current = null
    return true
  }, [])

  /** Starts auto-advancing. Pass `isRunStart` when the run's first command is
   * about to be shown, so the first tick also waits for the character to
   * start up (see `RUN_START_DELAY_MS`) before moving on. */
  const setPlayInterval = useCallback(
    ({ isRunStart = false }: { isRunStart?: boolean } = {}) => {
      clearPlayInterval()
      setPhase("playing")
      const startInterval = () => {
        startTimeoutRef.current = null
        intervalRef.current = setInterval(() => {
          dispatch(nextGameCommand())
        }, 1000 / playSpeed)
      }
      if (isRunStart)
        startTimeoutRef.current = setTimeout(startInterval, RUN_START_DELAY_MS)
      else startInterval()
    },
    [clearPlayInterval, dispatch, playSpeed, setPhase],
  )

  // Stop once playback reaches the last command - covers both auto-play
  // reaching the end and the player manually stepping to it.
  useEffect(() => {
    if ((phase === "playing" || phase === "paused") && gameOnLastStep) {
      clearPlayInterval()
      setPhase("finished")
    }
  }, [phase, gameOnLastStep, clearPlayInterval, setPhase])

  // Stop whenever playback is interrupted externally (paused/stopped/crashed).
  useEffect(() => {
    if (phase !== "playing") clearPlayInterval()
  }, [phase, clearPlayInterval])

  // Reset to idle whenever the game commands are invalidated (e.g. the
  // underlying blocks changed) or cleared.
  useEffect(() => {
    if (!gameIsDefined) {
      clearPlayInterval()
      setPhase("idle")
    }
  }, [gameIsDefined, clearPlayInterval, setPhase])

  // Stop on unmount.
  useEffect(() => () => void clearPlayInterval(), [clearPlayInterval])

  // Keep pacing in sync if the player changes speed mid-play.
  useEffect(() => {
    if (clearPlayInterval()) setPlayInterval()
  }, [clearPlayInterval, setPlayInterval])

  return [setPlayInterval, clearPlayInterval] as const
}
