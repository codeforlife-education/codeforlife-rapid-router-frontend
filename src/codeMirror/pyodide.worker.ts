/**
 * Web Worker that runs a student's Python script through Pyodide. Runs off
 * the main thread so the UI stays responsive while Pyodide loads (several MB
 * of wasm) and so a runaway script (e.g. an infinite loop) can be killed via
 * `worker.terminate()` from the main thread without freezing the page.
 */
import { type PyodideInterface, loadPyodide } from "pyodide"
import type { PyProxy } from "pyodide/ffi"

import type { GameCommand } from "../app/slices"
import LevelSimulator from "./LevelSimulator"
import type { OrthogonalTilemap } from "../phaser/tilemaps"

// Defines the `van` module's `Van` class (see PYTHON_STARTER_CODE) in terms
// of the underscore-prefixed JS functions set on `globals` for this run, so
// student code can do `from van import Van; my_van = Van()`. A `sys.settrace`
// tracer (`_LineTracer`) watches the student's own top-level frame: whenever
// a source line finishes without a command being issued (e.g. a loop/`if`
// header, or a plain sensing check), it synthesises a "wait" for that line,
// so the editor's highlight visits every executed line, not just the ones
// that call a Van method. Each Van command method still passes the CALLER's
// line number (`f_back.f_lineno`) through, so its own JS call is tagged with
// the exact line that issued it. `_current_block_id` tracks the Blockly
// block currently executing, set via `_highlight_block` calls injected by
// `pythonGenerator.STATEMENT_PREFIX` (see `blockly/utils.ts`) - `None` for
// hand-typed Python, which never calls `_highlight_block`.
import VAN_MODULE_PREAMBLE from "./van.py?raw"

export type RunRequest = {
  type: "run"
  id: number
  code: string
  levelId: number
}

export type WorkerResponse =
  | { type: "ready" }
  | {
      type: "result"
      id: number
      commands: GameCommand[]
      commandLines: number[]
      commandBlocks: (string | null)[]
    }
  | { type: "error"; id: number; message: string; blockId: string | null }

let pyodidePromise: Promise<PyodideInterface> | null = null
function getPyodide() {
  // Self-hosted assets (see vite.config.ts) - never fetched from a CDN.
  pyodidePromise ??= loadPyodide({ indexURL: "/pyodide/" })
  return pyodidePromise
}

// Start loading Pyodide immediately so the main thread can show a loading
// state until it's ready, instead of waiting for the first run request.
void getPyodide().then(() => {
  const response: WorkerResponse = { type: "ready" }
  self.postMessage(response)
})

const tilemapCache = new Map<number, Promise<OrthogonalTilemap>>()
function getTilemap(levelId: number) {
  let tilemap = tilemapCache.get(levelId)
  if (!tilemap) {
    // Same dynamic-import pattern `Preloader.lazyLoadTilemap` uses - plain
    // tile/object data, no Phaser instance needed.
    tilemap = import(`../phaser/tilemaps/level${levelId}.ts`).then(
      module => (module as { default: OrthogonalTilemap }).default,
    )
    tilemapCache.set(levelId, tilemap)
  }
  return tilemap
}

self.onmessage = async ({ data }: MessageEvent<RunRequest>) => {
  const { id, code, levelId } = data
  let globals: PyProxy | undefined
  try {
    const [pyodide, tilemap] = await Promise.all([
      getPyodide(),
      getTilemap(levelId),
    ])
    const simulator = new LevelSimulator(tilemap)

    // A fresh globals dict per run - keeps runs isolated from each other.
    globals = pyodide.toPy({
      _move_forwards: simulator.moveForwards,
      _turn_left: simulator.turnLeft,
      _turn_right: simulator.turnRight,
      _turn_around: simulator.turnAround,
      _wait: simulator.wait,
      _deliver: simulator.deliver,
      _sound_horn: simulator.soundHorn,
      _is_road: simulator.isRoad,
      _is_road_forward: simulator.isRoadForward,
      _is_road_left: simulator.isRoadLeft,
      _is_road_right: simulator.isRoadRight,
      _at_dead_end: simulator.atDeadEnd,
      _at_destination: simulator.atDestination,
      _at_traffic_light: simulator.atTrafficLight,
      _at_red_traffic_light: simulator.atRedTrafficLight,
      _at_green_traffic_light: simulator.atGreenTrafficLight,
      _is_animal_crossing: simulator.isAnimalCrossing,
      _student_code: code,
    }) as PyProxy
    pyodide.runPython(VAN_MODULE_PREAMBLE, { globals })
    pyodide.runPython("_run_traced(_student_code)", { globals })

    const response: WorkerResponse = {
      type: "result",
      id,
      commands: simulator.commands,
      commandLines: simulator.commandLines,
      commandBlocks: simulator.commandBlocks,
    }
    self.postMessage(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    // The block whose generated code was executing when the error was
    // thrown, if the script was compiled from Blockly - lets the workspace
    // highlight the offending block in red.
    const globalsGet = globals as { get?: (key: string) => unknown } | undefined
    const blockId =
      (globalsGet?.get?.("_current_block_id") as string | null | undefined) ??
      null
    const response: WorkerResponse = { type: "error", id, message, blockId }
    self.postMessage(response)
  }
}
