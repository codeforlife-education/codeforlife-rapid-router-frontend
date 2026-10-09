import type * as Blockly from "blockly/core"
import { pythonGenerator } from "blockly/python"

import { PROCEDURES_DEFINE_BLOCK_TYPE } from "./blocks/defaults"
import { PYTHON_STARTER_CODE } from "../codeMirror/python"

// Tags every generated statement (including ones nested inside a repeat/if
// body) with its originating block's ID, as an inert Python comment, See
// `mapBlocksToPythonLines`, the only consumer, which statically parses these
// tags back out.
pythonGenerator.STATEMENT_PREFIX = "#__block__:%1\n"

/** Matches a whole `#__block__:...` tag line, including its indentation. */
const BLOCK_TAG_LINE = /^[ \t]*#__block__:(.*)$/

/**
 * Strips the internal `#__block__:...` tags injected for block-highlighting
 * during playback, so code shown to the player only contains the commands
 * they'd actually recognize - while, in the same pass, recording which
 * (1-indexed) display line each surviving block ID's tag immediately preceded.
 */
export function mapBlocksToPythonLines(code: string) {
  const lineByBlockId = new Map<string, number>()
  let pendingBlockId: string | null = null
  const lines: string[] = []
  const rawLines = code.split("\n")
  for (const [i, rawLine] of rawLines.entries()) {
    const match = BLOCK_TAG_LINE.exec(rawLine)
    if (match) {
      pendingBlockId = match[1].replace(/^'|'$/g, "")
      continue
    }
    lines.push(rawLine)
    // Splitting a "\n"-terminated string always yields a synthetic empty
    // final element marking where the string ends, not real generated
    // content - don't let it "consume" a pending tag, e.g. a loop block's
    // own tag, which Blockly's `addLoopTrap` re-appends after the loop
    // body (so real Python execution re-highlights the loop once the body
    // finishes) - otherwise that tag would incorrectly override the loop's
    // own (correct) line with this trailing non-line.
    const isTrailingArtifact = i === rawLines.length - 1 && rawLine === ""
    if (pendingBlockId && !isTrailingArtifact) {
      lineByBlockId.set(pendingBlockId, lines.length)
      pendingBlockId = null
    }
  }
  return { code: lines.join("\n"), lineByBlockId }
}

/** Maps a boolean block's dropdown `CHOICE` field value (e.g. `"FORWARD"`,
 * `"RED"`) to the Python string argument the matching `Van` sensing method
 * expects - the legacy `Van` API takes the same uppercase values Blockly's
 * dropdowns already store, so no case conversion is needed. */
export const pythonChoiceArg = (block: Blockly.Block) =>
  JSON.stringify(String(block.getFieldValue("CHOICE")))

/**
 * Convert the blocks connected to the given start block into their
 * equivalent Python source. Used both for the read-only Python view in
 * "blocklyAndPython" mode, and - by running this same output through
 * Pyodide (see `BlocklyWorkspace.tsx`) - as the actual source of game
 * commands for ALL Blockly-driven modes. Uses Blockly's official
 * `pythonGenerator`, which - via the `forBlock` entries each `defineBlock`
 * call registers for our custom blocks, plus its own built-in support for
 * standard blocks (`controls_if`, `controls_repeat`, etc.) - handles
 * indentation/loops/conditionals automatically.
 * @param startBlock The starting block to convert from.
 * @returns The Python source code equivalent to the given blocks, and the
 * line each block's command maps to (see `mapBlocksToPythonLines`).
 */
export function getPythonCodeFromStartBlock(startBlock: Blockly.BlockSvg) {
  // Only follow the chain of blocks actually connected to the start block -
  // `workspaceToCode` would instead generate code for every top-level block
  // stack in the workspace, including ones the player has merely dragged in
  // but not yet attached to the start block.
  pythonGenerator.init(startBlock.workspace)

  // `init()` declares every variable used anywhere in the workspace as
  // `name = None` (see Blockly's `Variables.allUsedVarModels`), to protect
  // against a `variables_get` reading an unset variable - but a Van program
  // always assigns a variable with `variables_set` before ever reading it,
  // so this preamble is just unwanted noise; drop it.
  const generatorInternals = pythonGenerator as unknown as {
    definitions_: Record<string, string>
  }
  generatorInternals.definitions_.variables = ""

  // Procedure definitions are their own top-level stack by design (they
  // can't be attached below another block), so they're never part of the
  // start block's chain and must be included separately here. `true` stops
  // each one following its own (normally nonexistent) next-block chain.
  const blockToCode = (block: Blockly.Block, thisOnly = false) => {
    const generated = pythonGenerator.blockToCode(block, thisOnly)
    return Array.isArray(generated) ? generated[0] : generated
  }
  const procedureDefs = startBlock.workspace
    .getTopBlocks(true)
    .filter(block => block.type === PROCEDURES_DEFINE_BLOCK_TYPE)
    .map(block => blockToCode(block, true))

  const taggedBody = [...procedureDefs, blockToCode(startBlock)].join("")

  // `finish()` hoists one-time definitions (e.g. `from numbers import
  // Number`, injected by built-ins like `math_change`) as a prefix, never
  // touching `taggedBody` itself - split it off so those imports can join
  // `PYTHON_STARTER_CODE`'s own at the very top, instead of sitting
  // between them and the tagged body below, which would otherwise make
  // the block->line mapping depend on whether any hoisted imports exist.
  const finished = pythonGenerator.finish(taggedBody)
  const hoistedImports = finished
    .slice(0, finished.length - taggedBody.length)
    .trim()

  const { code: body, lineByBlockId } = mapBlocksToPythonLines(
    taggedBody
      .replace(/^\s+\n/, "")
      .replace(/\n\s+$/, "\n")
      .replace(/[ \t]+\n/g, "\n"),
  )

  const preamble = hoistedImports
    ? PYTHON_STARTER_CODE.replace(/\n/, `\n${hoistedImports}\n`)
    : PYTHON_STARTER_CODE
  const preambleLines = preamble.split("\n").length - 1

  return {
    code: preamble + body,
    lineByBlockId: new Map(
      [...lineByBlockId].map(([blockId, line]) => [
        blockId,
        line + preambleLines,
      ]),
    ),
  }
}
