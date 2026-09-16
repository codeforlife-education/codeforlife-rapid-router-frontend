/**
 * Web Worker that runs a student's Python script through Pyodide. Runs off
 * the main thread so the UI stays responsive while Pyodide loads (several MB
 * of wasm) and so a runaway script (e.g. an infinite loop) can be killed via
 * `worker.terminate()` from the main thread without freezing the page.
 */
import { type PyodideInterface, loadPyodide } from "pyodide"
import type { PyProxy } from "pyodide/ffi"

import LevelSimulator, { TooManyGameCommandsError } from "./LevelSimulator"
import type { GameCommand } from "../app/slices"
import type { OrthogonalTilemap } from "../phaser/tilemaps"

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
    }
  | { type: "error"; id: number; message: string }

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

// Defines the `van` module's `Van` class (see PYTHON_STARTER_CODE) in terms
// of the underscore-prefixed JS functions set on `globals` for this run, so
// student code can do `from van import Van; my_van = Van()`. A `sys.settrace`
// tracer (`_LineTracer`) watches the student's own top-level frame: whenever
// a source line finishes without a command being issued (e.g. a loop/`if`
// header, or a plain sensing check), it synthesises a "wait" for that line,
// so the editor's highlight visits every executed line, not just the ones
// that call a Van method. Each Van command method still passes the CALLER's
// line number (`f_back.f_lineno`) through, so its own JS call is tagged with
// the exact line that issued it.
const VAN_MODULE_PREAMBLE = `
import sys as _sys
import types as _types

class _LineTracer:
    def __init__(self):
        self.top_frame = None
        self.last_line = -1
        self.issued_on_line = False

    def mark_issued(self):
        self.issued_on_line = True

    def trace(self, frame, event, arg):
        if self.top_frame is None:
            self.top_frame = frame
        # Only trace the student's own top-level frame - calls into Van's
        # methods (or any function the student defines) run in their own
        # frame and are intentionally left untraced.
        if frame is not self.top_frame:
            return None
        if event == "line":
            if self.last_line != -1 and not self.issued_on_line:
                _wait(self.last_line)
            self.last_line = frame.f_lineno
            self.issued_on_line = False
        return self.trace

    def finish(self):
        if self.last_line != -1 and not self.issued_on_line:
            _wait(self.last_line)

_tracer = None

def _run_traced(source):
    global _tracer
    _tracer = _LineTracer()
    _sys.settrace(_tracer.trace)
    try:
        exec(compile(source, "<student_code>", "exec"), _run_traced.__globals__)
    finally:
        _sys.settrace(None)
        _tracer.finish()

class Van:
    def move_forwards(self):
        _tracer.mark_issued()
        _move_forwards(_sys._getframe().f_back.f_lineno)
    def turn_left(self):
        _tracer.mark_issued()
        _turn_left(_sys._getframe().f_back.f_lineno)
    def turn_right(self):
        _tracer.mark_issued()
        _turn_right(_sys._getframe().f_back.f_lineno)
    def turn_around(self):
        _tracer.mark_issued()
        _turn_around(_sys._getframe().f_back.f_lineno)
    def wait(self):
        _tracer.mark_issued()
        _wait(_sys._getframe().f_back.f_lineno)
    def deliver(self):
        _tracer.mark_issued()
        _deliver(_sys._getframe().f_back.f_lineno)
    def sound_horn(self):
        _tracer.mark_issued()
        _sound_horn(_sys._getframe().f_back.f_lineno)
    def is_road(self, direction):
        return _is_road(direction)
    def is_road_forward(self):
        return _is_road_forward()
    def is_road_left(self):
        return _is_road_left()
    def is_road_right(self):
        return _is_road_right()
    def at_dead_end(self):
        return _at_dead_end()
    def at_destination(self):
        return _at_destination()
    def at_traffic_light(self, colour):
        return _at_traffic_light(colour)
    def at_red_traffic_light(self):
        return _at_red_traffic_light()
    def at_green_traffic_light(self):
        return _at_green_traffic_light()
    def is_animal_crossing(self):
        return _is_animal_crossing()

_van_module = _types.ModuleType("van")
_van_module.Van = Van
_sys.modules["van"] = _van_module
`

self.onmessage = async ({ data }: MessageEvent<RunRequest>) => {
  const { id, code, levelId } = data
  try {
    const [pyodide, tilemap] = await Promise.all([
      getPyodide(),
      getTilemap(levelId),
    ])
    const simulator = new LevelSimulator(tilemap)

    // A fresh globals dict per run - keeps runs isolated from each other.
    const globals = pyodide.toPy({
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
    }
    self.postMessage(response)
  } catch (error) {
    const message =
      error instanceof TooManyGameCommandsError
        ? error.message
        : error instanceof Error
          ? error.message
          : String(error)
    const response: WorkerResponse = { type: "error", id, message }
    self.postMessage(response)
  }
}
