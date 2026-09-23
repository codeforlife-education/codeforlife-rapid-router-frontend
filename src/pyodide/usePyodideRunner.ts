import { useCallback, useEffect, useRef, useState } from "react"

import type { RunRequest, WorkerResponse } from "./pyodide.worker"
import type { GameCommand } from "../app/slices"

/** Called for each command as it's derived (streamed), so the caller can
 * play back a script live instead of waiting for it to finish entirely -
 * there's no cap on how long a script may run for; the game's fuel meter
 * is what eventually stops a non-terminating one, during real playback. */
export type OnCommand = (
  command: GameCommand,
  line: number,
  block: string | null,
  synthetic: boolean,
) => void

export type PyodideRunResult =
  | { ok: true }
  | { ok: false; message: string; blockId: string | null }

type Pending = {
  resolve: (result: PyodideRunResult) => void
  onCommand: OnCommand
}

/**
 * Owns a single Pyodide Web Worker for the lifetime of the calling
 * component, and exposes a promise-based `run(code, levelId, onCommand)` to
 * execute a student's Python script. `onCommand` fires for each command as
 * it's derived; the returned promise resolves once the script actually
 * finishes (or errors).
 */
export function usePyodideRunner() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef(new Map<number, Pending>())
  const nextRequestIdRef = useRef(0)
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
      if (data.type === "command") {
        pending.onCommand(
          data.command,
          data.commandLine,
          data.commandBlock,
          data.synthetic,
        )
        return
      }
      pendingRef.current.delete(data.id)
      pending.resolve(
        data.type === "result"
          ? { ok: true }
          : { ok: false, message: data.message, blockId: data.blockId },
      )
    }
    workerRef.current = worker
    return worker
  }, [])

  useEffect(() => {
    const worker = spawnWorker()
    return () => worker.terminate()
  }, [spawnWorker])

  const run = useCallback(
    async (
      code: string,
      levelId: number,
      onCommand: OnCommand,
    ): Promise<PyodideRunResult> => {
      await readyRef.current?.promise
      const worker = workerRef.current
      if (!worker) {
        return {
          ok: false,
          message: "Python runtime is not ready yet.",
          blockId: null,
        }
      }

      return new Promise(resolve => {
        const id = ++nextRequestIdRef.current
        pendingRef.current.set(id, { resolve, onCommand })

        const request: RunRequest = { type: "run", id, code, levelId }
        worker.postMessage(request)
      })
    },
    [],
  )

  return { run, ready }
}
