import { useCallback, useEffect, useRef, useState } from "react"

import type { RunRequest, WorkerResponse } from "./pyodide.worker"
import type { GameCommand } from "../app/slices"

/** A pure computation cap gives up fast; this catches busy loops that never
 * call an exposed game-command/sensing function at all. */
const RUN_TIMEOUT_MS = 10_000

export type PyodideRunResult =
  | { ok: true; commands: GameCommand[]; commandLines: number[] }
  | { ok: false; message: string }

type Pending = {
  resolve: (result: PyodideRunResult) => void
  timeoutId: ReturnType<typeof setTimeout>
}

/**
 * Owns a single Pyodide Web Worker for the lifetime of the calling
 * component, and exposes a promise-based `run(code, levelId)` to execute a
 * student's Python script. If a run doesn't finish within `RUN_TIMEOUT_MS`
 * (e.g. a script stuck in a tight infinite loop that never calls an exposed
 * function), the worker is forcibly terminated and replaced.
 */
export function usePyodideRunner() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef(new Map<number, Pending>())
  const nextRequestIdRef = useRef(0)
  // Resolves once the current worker's Pyodide has finished loading - `run`
  // awaits this first so the (possibly slow, first-load) time spent loading
  // Pyodide itself is never counted against `RUN_TIMEOUT_MS`.
  const readyRef = useRef<{
    promise: Promise<void>
    resolve: () => void
  } | null>(null)
  const [ready, setReady] = useState(false)

  const spawnWorker = useCallback(() => {
    let resolveReady!: () => void
    const promise = new Promise<void>(resolve => {
      resolveReady = resolve
    })
    readyRef.current = { promise, resolve: resolveReady }

    const worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url), {
      type: "module",
    })
    worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
      if (data.type === "ready") {
        setReady(true)
        readyRef.current?.resolve()
        return
      }
      const pending = pendingRef.current.get(data.id)
      if (!pending) return
      pendingRef.current.delete(data.id)
      clearTimeout(pending.timeoutId)
      pending.resolve(
        data.type === "result"
          ? {
              ok: true,
              commands: data.commands,
              commandLines: data.commandLines,
            }
          : { ok: false, message: data.message },
      )
    }
    workerRef.current = worker
    return worker
  }, [])

  const restartWorker = useCallback(() => {
    workerRef.current?.terminate()
    setReady(false)
    spawnWorker()
  }, [spawnWorker])

  useEffect(() => {
    const worker = spawnWorker()
    return () => worker.terminate()
  }, [spawnWorker])

  const run = useCallback(
    async (code: string, levelId: number): Promise<PyodideRunResult> => {
      await readyRef.current?.promise
      const worker = workerRef.current
      if (!worker) {
        return { ok: false, message: "Python runtime is not ready yet." }
      }

      return new Promise(resolve => {
        const id = ++nextRequestIdRef.current
        const timeoutId = setTimeout(() => {
          pendingRef.current.delete(id)
          restartWorker()
          resolve({
            ok: false,
            message: "Your program took too long to run and was stopped.",
          })
        }, RUN_TIMEOUT_MS)
        pendingRef.current.set(id, { resolve, timeoutId })

        const request: RunRequest = { type: "run", id, code, levelId }
        worker.postMessage(request)
      })
    },
    [restartWorker],
  )

  return { run, ready }
}
