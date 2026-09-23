import * as Blockly from "blockly/core"
import * as en_default from "blockly/msg/en"
import { debounce } from "@mui/material"

import * as en_custom from "./messages/en"
import {
  COMMAND_BLOCK_TYPES,
  CUSTOM_BLOCKS,
  type CommandBlockType,
  START_BLOCK_TYPES,
  type StartBlockType,
  defaults,
} from "./blocks"
import { type BlockToolboxEntry } from "../blockly/blocks"
import { type BlockType } from "./blocks"
import type { GameCommand } from "../app/slices"

export type BlockDefinition<T extends string> = {
  type: T
  tooltip?: string
  colour?: number
  /** A named block style (e.g. Blockly's built-in `"loop_blocks"`), as an
   * alternative to a raw `colour`. */
  style?: string
  message0: string
  args0: Array<
    | {
        type: "field_label"
        text: string
      }
    | {
        type: "field_image"
        src: string
        width: number
        height: number
        alt: string
        flipRtl: "FALSE" | "TRUE"
      }
    | {
        type: "input_dummy"
        name: string
      }
    | {
        type: "field_dropdown"
        name: string
        options: Array<[string, string]>
      }
    | {
        type: "input_value"
        name: string
        check?: string
      }
  >
  message1?: string
  args1?: Array<{ type: "input_statement"; name: string }>
  output?: string
  previousStatement?: string | null
  nextStatement?: string | null
}

export function defineBlock<T extends string>(
  blockDefinition: BlockDefinition<T>,
): BlockDefinition<T> {
  return blockDefinition
}

function initializeStartBlock(
  workspace: Blockly.WorkspaceSvg,
  startBlockType: StartBlockType,
) {
  let startBlock: Blockly.BlockSvg | undefined
  for (const block of workspace.getAllBlocks()) {
    const blockType = block.type as StartBlockType
    if (START_BLOCK_TYPES.includes(blockType)) {
      if (blockType === startBlockType && !startBlock) startBlock = block
      else block.dispose(false, false)
    }
  }

  if (!startBlock) {
    startBlock = workspace.newBlock(startBlockType)
    startBlock.initSvg()
    startBlock.render()
    startBlock.moveBy(10, 10)
  }
  if (startBlock.isDeletable()) startBlock.setDeletable(false)

  return startBlock
}

/** Gap between a flyout block and its instance-count label. */
const INSTANCE_COUNT_LABEL_GAP = 4

/**
 * Get or create the label used to show a flyout block's remaining instance
 * count. It's rendered in a foreignObject, positioned via flexbox so it's
 * vertically centred against the block without manual offset math, and
 * appended directly to the block's own SVG group so it moves and scales
 * together with the block.
 */
function getOrCreateInstanceCountLabel(svgRoot: SVGGElement) {
  const existingForeignObject = svgRoot.querySelector<SVGForeignObjectElement>(
    "foreignObject.blockly-instance-count",
  )
  const existingLabel = existingForeignObject?.querySelector("div")
  if (existingForeignObject && existingLabel)
    return { foreignObject: existingForeignObject, label: existingLabel }

  const foreignObject = Blockly.utils.dom.createSvgElement(
    Blockly.utils.Svg.FOREIGNOBJECT,
    { class: "blockly-instance-count", width: 1 },
    svgRoot,
  )
  // The foreignObject's own width is just a layout anchor; let its content
  // overflow to whatever width the label actually needs.
  foreignObject.style.overflow = "visible"
  foreignObject.style.pointerEvents = "none"

  const label = document.createElementNS(
    "http://www.w3.org/1999/xhtml",
    "div",
  ) as HTMLDivElement
  Object.assign(label.style, {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "max-content",
    fontSize: "16px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  })
  foreignObject.appendChild(label)

  return { foreignObject, label }
}

/**
 * Measure the width a label would render at, unaffected by any scale
 * transform applied by an ancestor SVG (e.g. the flyout's workspace scale).
 */
function measureLabelWidth(label: HTMLDivElement) {
  const clone = label.cloneNode(true) as HTMLDivElement
  Object.assign(clone.style, { position: "absolute", visibility: "hidden" })
  document.body.appendChild(clone)
  const width = clone.getBoundingClientRect().width
  clone.remove()
  return width
}

/** Each flyout block's width before it's widened to fit its label. */
const naturalBlockWidths = new WeakMap<Blockly.BlockSvg, number>()

/**
 * Show a label on each flyout block that has a max instance limit,
 * showing how many more of that block can still be placed in the workspace.
 */
function updateFlyoutInstanceLabels(
  workspace: Blockly.WorkspaceSvg,
  maxInstances: Record<string, number>,
) {
  const flyout = workspace.getFlyout()
  const flyoutWorkspace = flyout?.getWorkspace()
  if (!flyout || !flyoutWorkspace) return

  let needsReflow = false

  for (const block of flyoutWorkspace.getTopBlocks(false)) {
    const max = maxInstances[block.type]
    if (max === undefined) continue

    const { foreignObject, label } = getOrCreateInstanceCountLabel(
      block.getSvgRoot(),
    )

    const remaining = Math.max(
      max - workspace.getBlocksByType(block.type, false).length,
      0,
    )
    label.textContent = `x${remaining}`
    label.style.color = block.getColour()

    let naturalWidth = naturalBlockWidths.get(block)
    if (naturalWidth === undefined) {
      naturalWidth = block.getHeightWidth().width
      naturalBlockWidths.set(block, naturalWidth)
    }

    const { height } = block.getHeightWidth()
    foreignObject.setAttribute(
      "x",
      String(naturalWidth + INSTANCE_COUNT_LABEL_GAP),
    )
    foreignObject.setAttribute("height", String(height))

    // Widen the block (used by the flyout to size itself) if the label
    // would otherwise overflow past the flyout's right edge.
    const requiredWidth =
      naturalWidth + INSTANCE_COUNT_LABEL_GAP + measureLabelWidth(label)
    if (requiredWidth > block.width) {
      block.width = requiredWidth
      needsReflow = true
    }
  }

  if (needsReflow) flyout.reflow()
}

function initializeWorkspace(
  div: HTMLDivElement,
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
  maxInstances: Record<string, number>,
) {
  const workspace = Blockly.inject(div, {
    toolbox: { kind: "flyoutToolbox", contents: toolboxContents },
    trashcan: true,
    zoom: {
      controls: true,
      wheel: true,
      pinch: true,
      startScale: 1.0,
      maxScale: 2,
      minScale: 0.5,
      scaleSpeed: 1.5,
    },
    maxInstances,
  })

  const hasMaxInstances = Object.keys(maxInstances).length > 0
  const updateInstanceLabels = () =>
    updateFlyoutInstanceLabels(workspace, maxInstances)

  // Only levels that let the player define a procedure need the toolbox's
  // call blocks kept in sync with it; other levels never show either block.
  const hasProceduresDefineBlock = toolboxContents.some(
    item =>
      "type" in item && item.type === defaults.PROCEDURES_DEFINE_BLOCK_TYPE,
  )

  if (hasProceduresDefineBlock) {
    const update = () => {
      updateProcedureCallBlocks(workspace, toolboxContents)

      // `updateToolbox()` above recreates the flyout's blocks (rendered
      // asynchronously), wiping any instance-count labels, so they must be
      // reapplied afterwards rather than left to the separate listener
      // below, or they'd flicker: shown, then wiped once this update fires.
      if (hasMaxInstances) setTimeout(updateInstanceLabels, 0)
    }

    setTimeout(update, 0)

    const debouncedUpdate = debounce(update, 100)
    workspace.addChangeListener(event => {
      if (
        event instanceof Blockly.Events.BlockCreate ||
        event instanceof Blockly.Events.BlockDelete ||
        event instanceof Blockly.Events.BlockChange
      )
        debouncedUpdate()
    })
  } else if (hasMaxInstances) {
    // Flyout blocks are rendered asynchronously after injection.
    setTimeout(updateInstanceLabels, 0)

    workspace.addChangeListener(event => {
      if (
        event instanceof Blockly.Events.BlockCreate ||
        event instanceof Blockly.Events.BlockDelete
      )
        updateInstanceLabels()
    })
  }

  return workspace
}

/**
 * Refresh the toolbox's procedure call blocks to match the procedures
 * currently defined on the workspace: one correctly-named call block per
 * defined procedure, instead of Blockly's default of a single, permanently
 * blank call block. This replicates `Blockly.Procedures.flyoutCategory()`
 * (Blockly's own recommended mechanism, normally used for a dynamic toolbox
 * category) for our flat, non-categorised toolbox.
 */
function updateProcedureCallBlocks(
  workspace: Blockly.WorkspaceSvg,
  staticToolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
) {
  const [proceduresNoReturn] = Blockly.Procedures.allProcedures(workspace)

  const callBlocks = proceduresNoReturn.map(([name, params]) => ({
    kind: "block",
    type: defaults.PROCEDURES_CALL_BLOCK_TYPE,
    extraState: { name, params },
  }))

  workspace.updateToolbox({
    kind: "flyoutToolbox",
    contents: [...staticToolboxContents, ...callBlocks],
  })
}

let DEFINED_CUSTOM_BLOCKS = false

/**
 * Set up locale and custom block definitions, and disable block selection
 * visuals. Safe to call multiple times. No-ops during SSR, since Blockly
 * only works in a browser environment.
 */
function ensureBlocklyInitialized() {
  if (typeof window === "undefined") return

  // @ts-expect-error Locale type isn't inferred correctly after export
  Blockly.setLocale({ ...en_default, ...en_custom })

  // Define custom blocks.
  if (!DEFINED_CUSTOM_BLOCKS) {
    Blockly.common.defineBlocks(
      Blockly.common.createBlockDefinitionsFromJsonArray(CUSTOM_BLOCKS),
    )
    DEFINED_CUSTOM_BLOCKS = true
  }

  // Override block selection visuals to disable them.
  Blockly.BlockSvg.prototype.addSelect = () => {}
  Blockly.BlockSvg.prototype.removeSelect = () => {}
}

export function initializeBlockly(
  div: HTMLDivElement,
  startBlockType: StartBlockType,
  toolboxContents: Blockly.utils.toolbox.ToolboxItemInfo[],
  maxInstances: Record<string, number>,
) {
  ensureBlocklyInitialized()

  const workspace = initializeWorkspace(div, toolboxContents, maxInstances)

  const startBlock = initializeStartBlock(workspace, startBlockType)

  return { workspace, startBlock }
}

function isBlockToolboxTuple(
  entry: BlockToolboxEntry,
): entry is readonly [BlockType, number] {
  return Array.isArray(entry)
}

export function getToolboxContents(
  entries: BlockToolboxEntry[],
): Blockly.utils.toolbox.ToolboxItemInfo[] {
  // Ensures the locale is set (so `Blockly.Msg` below is populated) even if
  // this runs before `initializeBlockly()`, e.g. while building context that
  // will later be passed down to a `BlocklyWorkspace`.
  ensureBlocklyInitialized()

  return entries
    .map(entry => (isBlockToolboxTuple(entry) ? entry[0] : entry))
    .filter(
      // The call block is never shown statically: it's dynamically
      // populated with one correctly-named entry per defined procedure by
      // `updateProcedureCallBlocks()`, since Blockly otherwise renders it
      // with a permanently blank name field.
      type => type !== defaults.PROCEDURES_CALL_BLOCK_TYPE,
    )
    .map(type =>
      type === defaults.PROCEDURES_DEFINE_BLOCK_TYPE
        ? {
            kind: "block",
            type,
            // Blockly renders this block with a blank name field unless a
            // default is supplied explicitly, matching what Blockly's own
            // dynamic procedure category does (see
            // `Blockly.Procedures.flyoutCategory()`). Falls back to
            // Blockly's own English default during SSR, where the locale
            // isn't set up (see `ensureBlocklyInitialized()`).
            fields: {
              NAME:
                Blockly.Msg?.["PROCEDURES_DEFNORETURN_PROCEDURE"] ??
                "do something",
            },
          }
        : { kind: "block", type },
    )
}

export function getMaxInstances(
  entries: BlockToolboxEntry[],
): Record<string, number> {
  return Object.fromEntries(entries.filter(isBlockToolboxTuple))
}

/**
 * Render a single, static (non-draggable) block for use as a preview, e.g.
 * in a list of selectable blocks. The div is resized to exactly fit the
 * rendered block, so nothing is cropped or surrounded by excess empty space.
 * @param div The div to render the block's workspace into.
 * @param blockType The type of block to render.
 * @returns The read-only workspace containing the rendered block, plus the
 * block's rendered size, so callers can lay out differently sized previews
 * consistently, e.g. to align other elements that follow them in a list.
 */
export function initializeBlockPreview(
  div: HTMLDivElement,
  blockType: BlockType,
) {
  ensureBlocklyInitialized()

  const workspace = Blockly.inject(div, {
    readOnly: true,
    trashcan: false,
    sounds: false,
    scrollbars: false,
    zoom: { controls: false, wheel: false },
  })

  // Remove the default grey workspace background/border so only the block
  // shows. The class's CSS sets both `fill` and `stroke`, so both must be
  // overridden via inline style to take precedence.
  const background = div.querySelector<SVGRectElement>(".blocklyMainBackground")
  if (background) {
    background.style.fill = "transparent"
    background.style.stroke = "transparent"
  }

  const block = workspace.newBlock(blockType)

  // Blockly defaults a freshly created procedure block's name to
  // `Blockly.Msg["UNNAMED_KEY"]` ("unnamed"), rather than the friendlier
  // default it uses for its own toolbox entries (see `getToolboxContents()`).
  if (blockType === defaults.PROCEDURES_DEFINE_BLOCK_TYPE)
    block.setFieldValue(Blockly.Msg["PROCEDURES_DEFNORETURN_PROCEDURE"], "NAME")

  block.initSvg()
  block.render()

  // Resize the div to exactly fit the rendered block, instead of relying on a
  // fixed size that may crop taller blocks (e.g. ones with dropdown fields) or
  // leave excess space around shorter ones.
  const { height, width } = block.getHeightWidth()
  const size = { width: width, height: height }
  div.style.width = `${size.width}px`
  div.style.height = `${size.height}px`

  Blockly.svgResize(workspace)

  return { workspace, size }
}

export function resizeWorkspace(
  workspace: Blockly.WorkspaceSvg,
  debounceMs = 10,
) {
  return debounce(() => {
    Blockly.svgResize(workspace)
  }, debounceMs)
}

/**
 * Convert the blocks connected to the given start block into game commands.
 * Non-command blocks are converted to "wait" commands.
 * @param startBlock The starting block to convert from.
 * @returns An array of game commands.
 */
export function getGameCommandsFromStartBlock(
  startBlock: Blockly.BlockSvg,
): GameCommand[] {
  if (!START_BLOCK_TYPES.includes(startBlock.type as StartBlockType))
    throw Error("Block is not one of the accepted start types.")

  return getNextBlocks(startBlock).map(block => {
    const blockType = block.type as CommandBlockType
    return COMMAND_BLOCK_TYPES.includes(blockType) ? blockType : "wait"
  })
}

export function getNextBlocks(block: Blockly.BlockSvg) {
  const blocks: Blockly.BlockSvg[] = []

  let currentBlock = block.getNextBlock()
  while (currentBlock) {
    blocks.push(currentBlock)
    currentBlock = currentBlock.getNextBlock()
  }

  return blocks
}

export function clearWorkspace(
  workspace: Blockly.WorkspaceSvg,
  startBlock: Blockly.BlockSvg,
) {
  const disposeBlock = (block: Blockly.BlockSvg) => block.dispose(false, false)

  // Dispose all blocks connected to the start block first.
  let block = startBlock.getNextBlock()
  if (block) disposeBlock(block)

  // Dispose any remaining blocks (e.g., unconnected blocks).
  for (block of workspace.getAllBlocks()) {
    if (block.id !== startBlock.id) disposeBlock(block)
  }
}
