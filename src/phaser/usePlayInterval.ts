import { useCallback, useEffect, useRef } from "react"

import {
  useAppDispatch,
  useGameIsDefined,
  useGameOnLastStep,
  usePhaserGameContext,
  useSettings,
} from "../app/hooks"
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

  const clearPlayInterval = useCallback(() => {
    if (!intervalRef.current) return false
    clearInterval(intervalRef.current)
    intervalRef.current = null
    return true
  }, [])

  const setPlayInterval = useCallback(() => {
    clearPlayInterval()
    setPhase("playing")
    intervalRef.current = setInterval(() => {
      dispatch(nextGameCommand())
    }, 1000 / playSpeed)
  }, [clearPlayInterval, dispatch, playSpeed, setPhase])

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
