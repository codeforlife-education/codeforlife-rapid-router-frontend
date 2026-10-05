import type * as Blockly from "blockly/core"

import type LevelSimulator from "../phaser/LevelSimulator"
import { PROCEDURES_DEFINE_BLOCK_TYPE } from "./blocks/defaults"

/**
 * Thrown for any runtime error in the student's program (missing input,
 * unset variable, runaway loop, unknown block, etc.) - carries the id of
 * the innermost statement block that was executing when the error
 * occurred, attached as the error propagates up through `runStatement`'s
 * try/catch, for highlighting in red (mirrors `_current_block_id` in
 * `codeMirror/van.py`, tracked there via `_highlight_block` calls instead).
 */
class InterpreterError extends Error {
  blockId: string | null = null
}

/** Hard cap on loop iterations/procedure calls. This interpreter runs
 * synchronously on the main thread - unlike Pyodide's Worker, there's no
 * `.terminate()` to fall back on - so a runaway loop/recursive procedure
 * call must surface as a clear error instead of freezing the tab. */
const MAX_STEPS = 1000

type InterpreterContext = {
  simulator: LevelSimulator
  vars: Map<string, number>
  procedures: Map<string, Blockly.Block | null>
  steps: number
}

function tick(ctx: InterpreterContext) {
  if (++ctx.steps > MAX_STEPS)
    throw new Error(
      "Program is taking too long to run - check for an infinite loop.",
    )
}

/** Evaluates a value (expression) block down to a boolean or number. */
function evalValue(
  block: Blockly.Block | null,
  ctx: InterpreterContext,
): boolean | number {
  if (!block) throw new Error("A value input is missing a block.")
  const { simulator } = ctx
  switch (block.type) {
    case "road_exists":
      return simulator.isRoad(
        block.getFieldValue("CHOICE") as "FORWARD" | "LEFT" | "RIGHT",
      )
    case "traffic_light":
      return simulator.atTrafficLight(
        block.getFieldValue("CHOICE") as "RED" | "GREEN",
      )
    case "dead_end":
      return simulator.atDeadEnd()
    case "at_destination":
      return simulator.atDestination()
    // The Python API only exposes a single generic "is animal crossing"
    // check (no separate cow/pigeon methods), so both blocks map to it -
    // see `registerPythonGenerators` in `blockly/utils.ts`.
    case "cow_crossing":
    case "pigeon_crossing":
      return simulator.isAnimalCrossing()
    case "logic_negate":
      return !evalBoolean(block.getInputTargetBlock("BOOL"), ctx)
    case "logic_compare": {
      const a = evalValue(block.getInputTargetBlock("A"), ctx)
      const b = evalValue(block.getInputTargetBlock("B"), ctx)
      switch (block.getFieldValue("OP")) {
        case "EQ":
          return a === b
        case "NEQ":
          return a !== b
        case "LT":
          return (a as number) < (b as number)
        case "LTE":
          return (a as number) <= (b as number)
        case "GT":
          return (a as number) > (b as number)
        case "GTE":
          return (a as number) >= (b as number)
        default:
          throw new Error(
            `Unsupported comparison operator: ${String(block.getFieldValue("OP"))}`,
          )
      }
    }
    case "variables_get": {
      const value = ctx.vars.get(block.getFieldValue("VAR") as string)
      if (value === undefined)
        throw new Error("Variable read before it was ever set.")
      return value
    }
    case "math_number":
      return Number(block.getFieldValue("NUM"))
    default:
      throw new Error(`Unsupported value block: ${block.type}`)
  }
}

function evalBoolean(
  block: Blockly.Block | null,
  ctx: InterpreterContext,
): boolean {
  return Boolean(evalValue(block, ctx))
}

/** Runs a `controls_whileUntil`/`repeat_while`/`repeat_until` loop - pass
 * `invert: true` for the "until" variants, which loop while the condition
 * is false instead of true. */
function runLoop(
  block: Blockly.Block,
  invert: boolean,
  ctx: InterpreterContext,
) {
  for (;;) {
    tick(ctx)
    const continues =
      evalBoolean(block.getInputTargetBlock("BOOL"), ctx) !== invert
    // The condition check itself is never a van instruction - record a
    // "wait" for every pass, including the final one that breaks the loop.
    ctx.simulator.wait(undefined, block.id)
    if (!continues) return
    runStatements(block.getInputTargetBlock("DO"), ctx)
  }
}

function runStatement(block: Blockly.Block, ctx: InterpreterContext) {
  try {
    const { simulator } = ctx
    switch (block.type) {
      case "move_forwards":
        return simulator.moveForwards(undefined, block.id)
      case "turn_left":
        return simulator.turnLeft(undefined, block.id)
      case "turn_right":
        return simulator.turnRight(undefined, block.id)
      case "turn_around":
        return simulator.turnAround(undefined, block.id)
      case "wait":
        return simulator.wait(undefined, block.id)
      case "deliver":
        return simulator.deliver(undefined, block.id)
      case "sound_horn":
        return simulator.soundHorn(undefined, block.id)

      case "controls_if": {
        let branch: Blockly.Block | null = null
        for (let i = 0; block.getInput(`IF${i}`); i++) {
          if (evalBoolean(block.getInputTargetBlock(`IF${i}`), ctx)) {
            branch = block.getInputTargetBlock(`DO${i}`)
            break
          }
        }
        if (!branch && block.getInput("ELSE"))
          branch = block.getInputTargetBlock("ELSE")
        // Checking the condition(s) is never a van instruction itself.
        simulator.wait(undefined, block.id)
        return runStatements(branch, ctx)
      }

      case "controls_repeat": {
        const times = Number(block.getFieldValue("TIMES"))
        for (let i = 0; i < times; i++) {
          tick(ctx)
          simulator.wait(undefined, block.id)
          runStatements(block.getInputTargetBlock("DO"), ctx)
        }
        return
      }

      case "controls_whileUntil":
        return runLoop(block, block.getFieldValue("MODE") === "UNTIL", ctx)
      case "repeat_while":
        return runLoop(block, false, ctx)
      case "repeat_until":
        return runLoop(block, true, ctx)

      case "variables_set": {
        const value = evalValue(block.getInputTargetBlock("VALUE"), ctx)
        ctx.vars.set(block.getFieldValue("VAR") as string, value as number)
        return simulator.wait(undefined, block.id)
      }
      case "math_change": {
        const id = block.getFieldValue("VAR") as string
        const delta = evalValue(
          block.getInputTargetBlock("DELTA"),
          ctx,
        ) as number
        ctx.vars.set(id, (ctx.vars.get(id) ?? 0) + delta)
        return simulator.wait(undefined, block.id)
      }

      case "procedures_callnoreturn": {
        const name = block.getFieldValue("NAME") as string
        if (!ctx.procedures.has(name))
          throw new Error(`Unknown procedure: ${name}`)
        // The game doesn't support procedure parameters, so there's no
        // argument binding/call-stack here - just a shared global scope.
        tick(ctx)
        simulator.wait(undefined, block.id)
        return runStatements(ctx.procedures.get(name) ?? null, ctx)
      }
      // Definitions are registered upfront (see `runBlockly`) and never
      // executed inline, even if somehow reached as a statement.
      case "procedures_defnoreturn":
        return

      default:
        throw new Error(`Unsupported block: ${block.type}`)
    }
  } catch (error) {
    if (error instanceof InterpreterError) {
      error.blockId ??= block.id
      throw error
    }
    const wrapped = new InterpreterError(
      error instanceof Error ? error.message : String(error),
    )
    wrapped.blockId = block.id
    throw wrapped
  }
}

/** Runs the chain of statement blocks starting at `block` (following
 * `getNextBlock()`), e.g. a start block's body or an if/loop branch. */
function runStatements(block: Blockly.Block | null, ctx: InterpreterContext) {
  for (let current = block; current; current = current.getNextBlock())
    runStatement(current, ctx)
}

export type BlocklyRunResult =
  | { ok: true }
  | { ok: false; message: string; blockId: string | null }

/**
 * Runs the blocks connected to `startBlock` directly against `simulator` -
 * no Python generation/execution involved, so pure Blockly levels never
 * need to load Pyodide. Mirrors `getPythonCodeFromStartBlock`'s traversal
 * (the start block's chain, plus top-level procedure definitions), but
 * executes each block immediately instead of emitting source text.
 */
export function runBlockly(
  startBlock: Blockly.Block,
  simulator: LevelSimulator,
): BlocklyRunResult {
  const procedures = new Map<string, Blockly.Block | null>()
  for (const block of startBlock.workspace.getTopBlocks(true))
    if (block.type === PROCEDURES_DEFINE_BLOCK_TYPE)
      procedures.set(
        block.getFieldValue("NAME") as string,
        block.getInputTargetBlock("STACK"),
      )

  const ctx: InterpreterContext = {
    simulator,
    vars: new Map(),
    procedures,
    steps: 0,
  }

  try {
    runStatements(startBlock.getNextBlock(), ctx)
    return { ok: true }
  } catch (error) {
    if (error instanceof InterpreterError)
      return { ok: false, message: error.message, blockId: error.blockId }
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      blockId: null,
    }
  }
}
