import * as Blockly from "blockly/core"

import type { BlockType } from "./blocks"
import type { LevelSimulator } from "../phaser"
import { PROCEDURES_DEFINE_BLOCK_TYPE } from "./blocks/defaults"

/**
 * Thrown for any runtime error in the student's program (missing input,
 * unset variable, runaway loop, unknown block, etc.) - carries the ids of
 * the innermost statement block (plus everything connected to it) that was
 * executing when the error occurred, attached as the error propagates up
 * through `runStatement`'s try/catch, for highlighting in red.
 */
class InterpreterError extends Error {
  blockIds: string[] = []
}

/** Hard cap on loop iterations/procedure calls. This interpreter runs
 * synchronously on the main thread so a runaway loop/recursive procedure call
 * must surface as a clear error instead of freezing the tab.
 */
const MAX_STEPS = 1000

/** The context object passed around during interpretation, holding the
 * simulator instance, variable and procedure maps, the current step count,
 * and the block->coe-line map used to report each command's `lineNo`.
 */
type InterpreterContext = {
  simulator: LevelSimulator
  vars: Map<string, number>
  procedures: Map<string, Blockly.Block | null>
  steps: number
  lineByBlockId?: Map<string, number>
}

/** Increments the step counter and throws an error if the program has exceeded
 * the maximum allowed steps.
 */
function tick(ctx: InterpreterContext) {
  if (++ctx.steps > MAX_STEPS)
    throw new Error(
      "Program is taking too long to run - check for an infinite loop.",
    )
}

/** Collects `block`'s own id plus the ids of every block connected to one of
 * its *value* inputs (recursively) - e.g. a condition's comparison/variable/
 * number blocks, or a variable-setter's value expression - so the whole
 * connected group highlights together as a single unit. Statement inputs
 * (e.g. a loop/if's `DO`/`ELSE` body) are deliberately not followed, since
 * those are separate statement chains that get their own highlighting per
 * statement already. */
function collectConnectedBlockIds(block: Blockly.Block | null): string[] {
  if (!block) return []
  const ids = [block.id]
  for (const input of block.inputList) {
    if (input.type !== Blockly.inputs.inputTypes.VALUE) continue
    ids.push(
      ...collectConnectedBlockIds(input.connection?.targetBlock() ?? null),
    )
  }
  return ids
}

/** Builds the `{ blockId, lineNo }` pair passed to a `LevelSimulator` command
 * for `block` - `blockId` is `block` plus everything connected to it (see
 * `collectConnectedBlockIds`), and `lineNo` is looked up by `key` (`block.id`
 * unless the caller needs a more specific key, e.g. one `controls_if` branch
 * among several sharing the same block). */
function describeBlock(
  ctx: InterpreterContext,
  block: Blockly.Block,
  key: string = block.id,
): { blockIds: string[]; lineNo?: number } {
  return {
    blockIds: collectConnectedBlockIds(block),
    lineNo: ctx.lineByBlockId?.get(key),
  }
}

/** Evaluates a value (expression) block down to a boolean or number. */
function evalValue(
  block: Blockly.Block | null,
  ctx: InterpreterContext,
): boolean | number {
  if (!block) throw new Error("A value input is missing a block.")
  const { simulator } = ctx
  switch (block.type as BlockType) {
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
    ctx.simulator.wait(describeBlock(ctx, block))
    if (!continues) return
    runStatements(block.getInputTargetBlock("DO"), ctx)
  }
}

function runStatement(block: Blockly.Block, ctx: InterpreterContext) {
  try {
    const { simulator } = ctx
    switch (block.type as BlockType) {
      case "move_forwards":
        return simulator.moveForwards(describeBlock(ctx, block))
      case "turn_left":
        return simulator.turnLeft(describeBlock(ctx, block))
      case "turn_right":
        return simulator.turnRight(describeBlock(ctx, block))
      case "turn_around":
        return simulator.turnAround(describeBlock(ctx, block))
      case "wait":
        return simulator.wait(describeBlock(ctx, block))
      case "deliver":
        return simulator.deliver(describeBlock(ctx, block))
      case "sound_horn":
        return simulator.soundHorn(describeBlock(ctx, block))

      case "controls_if": {
        let branch: Blockly.Block | null = null
        for (let i = 0; block.getInput(`IF${i}`); i++) {
          const conditionBlock = block.getInputTargetBlock(`IF${i}`)
          // Each branch's condition check is its own wait, highlighting the
          // if-block together with that condition's whole connected value-block
          // tree, and mapped to that branch's own generated code line - there's
          // no wait for falling through to `else`, since nothing is evaluated
          // there.
          simulator.wait({
            blockIds: [block.id, ...collectConnectedBlockIds(conditionBlock)],
            lineNo: ctx.lineByBlockId?.get(`${block.id}:${i}`),
          })
          if (evalBoolean(conditionBlock, ctx)) {
            branch = block.getInputTargetBlock(`DO${i}`)
            break
          }
        }
        if (!branch && block.getInput("ELSE"))
          branch = block.getInputTargetBlock("ELSE")
        return runStatements(branch, ctx)
      }

      case "controls_repeat": {
        const times = Number(block.getFieldValue("TIMES"))
        for (let i = 0; i < times; i++) {
          tick(ctx)
          simulator.wait(describeBlock(ctx, block))
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
        return simulator.wait(describeBlock(ctx, block))
      }
      case "math_change": {
        const id = block.getFieldValue("VAR") as string
        const delta = evalValue(
          block.getInputTargetBlock("DELTA"),
          ctx,
        ) as number
        ctx.vars.set(id, (ctx.vars.get(id) ?? 0) + delta)
        return simulator.wait(describeBlock(ctx, block))
      }

      case "procedures_callnoreturn": {
        const name = block.getFieldValue("NAME") as string
        if (!ctx.procedures.has(name))
          throw new Error(`Unknown procedure: ${name}`)
        // The game doesn't support procedure parameters, so there's no
        // argument binding/call-stack here - just a shared global scope.
        tick(ctx)
        simulator.wait(describeBlock(ctx, block))
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
      if (error.blockIds.length === 0)
        error.blockIds = collectConnectedBlockIds(block)
      throw error
    }
    const wrapped = new InterpreterError(
      error instanceof Error ? error.message : String(error),
    )
    wrapped.blockIds = collectConnectedBlockIds(block)
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
  | { ok: false; message: string; blockIds: string[] }

/**
 * Runs the blocks connected to `startBlock` directly against `simulator`.
 * Procedure definitions are registered upfront and never executed inline.
 * @param lineByBlockId Maps each block ID (or, for a `controls_if` branch,
 * `` `${blockId}:${branchIndex}` ``) to its generated code line; otherwise
 * commands are reported with no `lineNo`.
 */
export function runBlockly(
  startBlock: Blockly.Block,
  simulator: LevelSimulator,
  lineByBlockId?: Map<string, number>,
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
    lineByBlockId,
  }

  try {
    runStatements(startBlock.getNextBlock(), ctx)
    return { ok: true }
  } catch (error) {
    if (error instanceof InterpreterError)
      return { ok: false, message: error.message, blockIds: error.blockIds }
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      blockIds: [],
    }
  }
}
