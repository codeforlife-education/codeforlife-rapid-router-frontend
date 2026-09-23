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

export type RunRequest = {
  type: "run"
  id: number
  code: string
  levelId: number
}

export type WorkerResponse =
  | { type: "ready" }
  | {
      type: "command"
      id: number
      command: GameCommand
      commandLine: number
      commandBlock: string | null
      /** True for the line tracer's filler waits (editor highlighting only) -
       * these must not cost fuel. See `LevelSimulator.commandSynthetic`. */
      synthetic: boolean
    }
  | { type: "result"; id: number }
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
const VAN_MODULE_PREAMBLE = `
import sys as _sys
import types as _types

_current_block_id = None

def _highlight_block(block_id):
    global _current_block_id
    _current_block_id = block_id
    # Not real student code - don't let the tracer treat this line as one
    # that "issued nothing" and synthesise a spurious "wait" for it.
    _tracer.mark_issued()

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
                _synthetic_wait(self.last_line, _current_block_id)
            self.last_line = frame.f_lineno
            self.issued_on_line = False
        return self.trace

    def finish(self):
        if self.last_line != -1 and not self.issued_on_line:
            _synthetic_wait(self.last_line, _current_block_id)

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
        _move_forwards(_sys._getframe().f_back.f_lineno, _current_block_id)
    def turn_left(self):
        _tracer.mark_issued()
        _turn_left(_sys._getframe().f_back.f_lineno, _current_block_id)
    def turn_right(self):
        _tracer.mark_issued()
        _turn_right(_sys._getframe().f_back.f_lineno, _current_block_id)
    def turn_around(self):
        _tracer.mark_issued()
        _turn_around(_sys._getframe().f_back.f_lineno, _current_block_id)
    def wait(self):
        _tracer.mark_issued()
        _wait(_sys._getframe().f_back.f_lineno, _current_block_id)
    def deliver(self):
        _tracer.mark_issued()
        _deliver(_sys._getframe().f_back.f_lineno, _current_block_id)
    def sound_horn(self):
        _tracer.mark_issued()
        _sound_horn(_sys._getframe().f_back.f_lineno, _current_block_id)
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
  let globals: PyProxy | undefined
  try {
    const [pyodide, tilemap] = await Promise.all([
      getPyodide(),
      getTilemap(levelId),
    ])
    const simulator = new LevelSimulator(tilemap)

    // Caps how fast commands can be derived, so a script that never
    // terminates (e.g. `repeat until at_destination()` on a level it can
    // never reach) can't flood the main thread with an unbounded burst of
    // `postMessage`s - it just derives commands at a bounded pace forever,
    // same as any other command. This blocks only the WORKER's own thread
    // (a plain busy-wait - no SharedArrayBuffer/special headers needed),
    // never the main thread, so the page stays fully responsive.
    const PACE_MS = 5
    function paceCommand() {
      const start = Date.now()
      while (Date.now() - start < PACE_MS) {
        /* busy-wait */
      }
    }

    // Wraps a command-producing `LevelSimulator` method so each command is
    // streamed to the main thread as soon as it's derived, instead of
    // waiting for the whole script to finish before any are available.
    const streamed = <F extends (line?: number, blockId?: string) => void>(
      fn: F,
    ): F =>
      ((line?: number, blockId?: string) => {
        fn(line, blockId)
        const i = simulator.commands.length - 1
        const response: WorkerResponse = {
          type: "command",
          id,
          command: simulator.commands[i],
          commandLine: simulator.commandLines[i],
          commandBlock: simulator.commandBlocks[i],
          synthetic: simulator.commandSynthetic[i],
        }
        self.postMessage(response)
        paceCommand()
      }) as F

    // A fresh globals dict per run - keeps runs isolated from each other.
    globals = pyodide.toPy({
      _move_forwards: streamed(simulator.moveForwards),
      _turn_left: streamed(simulator.turnLeft),
      _turn_right: streamed(simulator.turnRight),
      _turn_around: streamed(simulator.turnAround),
      _wait: streamed(simulator.wait),
      _synthetic_wait: streamed(simulator.syntheticWait),
      _deliver: streamed(simulator.deliver),
      _sound_horn: streamed(simulator.soundHorn),
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

    const response: WorkerResponse = { type: "result", id }
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
