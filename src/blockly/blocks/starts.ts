import type * as Blockly from "blockly/core"

import type * as images from "../../phaser/images"
import { defineBlock } from "./blocks"

type Character = keyof typeof images.URLs.Character.Normal

/** The name of the start block's field showing the level's character. */
const CHARACTER_FIELD_NAME = "CHARACTER"

const characterImageUrl = (view: "front_view" | "top_view", name: string) =>
  new URL(`../../images/characters/${view}/${name}.svg`, import.meta.url).href

/**
 * The image of each character shown on the start block: a front view. There's
 * no front view of the sleigh, so it's shown from the top.
 */
const CHARACTER_IMAGE_URLS: Record<Character, string> = {
  DEE: characterImageUrl("front_view", "Dee"),
  ELECTRIC_VAN: characterImageUrl("front_view", "Electric_van"),
  KIRSTY: characterImageUrl("front_view", "Kirsty"),
  NIGEL: characterImageUrl("front_view", "Nigel"),
  PHIL: characterImageUrl("front_view", "Phil"),
  SLEIGH: characterImageUrl("top_view", "Sleigh"),
  VAN: characterImageUrl("front_view", "Van"),
  WES: characterImageUrl("front_view", "Wes"),
}

/**
 * Shows the given character on the start block. Must be reapplied whenever
 * the start block is recreated, as image fields aren't serialized.
 */
export function setStartBlockCharacter(
  startBlock: Blockly.Block,
  character: Character,
) {
  startBlock
    .getField(CHARACTER_FIELD_NAME)
    ?.setValue(CHARACTER_IMAGE_URLS[character])
}

function defineStartBlock<T extends string>(type: T, character: Character) {
  return defineBlock(
    {
      type,
      tooltip: "%{BKY_START_TOOLTIP}",
      colour: 50,
      message0: "%{BKY_START_TITLE} %1 %2",
      args0: [
        {
          type: "field_image",
          name: CHARACTER_FIELD_NAME,
          // The default character, until the level's own is set (see
          // `setStartBlockCharacter`).
          src: CHARACTER_IMAGE_URLS[character],
          width: 30,
          height: 30,
          alt: "*",
          flipRtl: "FALSE",
        },
        {
          type: "input_dummy",
          name: "DUMMY",
        },
      ],
      nextStatement: null,
    },
    {
      // Only contributes its `PYTHON_STARTER_CODE` preamble (added separately
      // in `getPythonCodeFromStartBlock`), not its own line.
      toPython: () => "",
    },
  )
}

export const VAN_BLOCK = defineStartBlock("van", "VAN")

export const START_BLOCK_TYPES = [VAN_BLOCK.type] as const
export type StartBlockType = (typeof START_BLOCK_TYPES)[number]
