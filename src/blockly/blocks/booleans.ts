import { Order } from "blockly/python"

import {
  type BlockDefinition,
  type DefineBlockKwArgs,
  defineBlock,
  pythonChoiceArg,
} from "../utils"
import cowIcon from "../../images/blocks/cow_crossing.svg"
import emptyIcon from "../../images/blocks/empty.svg"
import pigeonIcon from "../../images/blocks/pigeon_crossing.svg"

function defineBooleanBlock<T extends string>(
  blockDefinition: Omit<BlockDefinition<T>, "output" | "colour">,
  kwArgs: DefineBlockKwArgs,
) {
  return defineBlock(
    { colour: 210, output: "Boolean", ...blockDefinition },
    kwArgs,
  )
}

export const ROAD_EXISTS_BLOCK = defineBooleanBlock(
  {
    type: "road_exists",
    message0: "%1 %2",
    args0: [
      {
        type: "field_dropdown",
        name: "CHOICE",
        options: [
          ["%{BKY_ROAD_EXISTS_FORWARD_TITLE}", "FORWARD"],
          ["%{BKY_ROAD_EXISTS_LEFT_TITLE}", "LEFT"],
          ["%{BKY_ROAD_EXISTS_RIGHT_TITLE}", "RIGHT"],
        ],
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  {
    toPython: block => [
      `my_van.is_road(${pythonChoiceArg(block)})`,
      Order.FUNCTION_CALL,
    ],
  },
)
export const TRAFFIC_LIGHT_BLOCK = defineBooleanBlock(
  {
    type: "traffic_light",
    message0: "%1 %2",
    args0: [
      {
        type: "field_dropdown",
        name: "CHOICE",
        options: [
          ["%{BKY_TRAFFIC_LIGHT_RED_TITLE}", "RED"],
          ["%{BKY_TRAFFIC_LIGHT_GREEN_TITLE}", "GREEN"],
        ],
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  {
    toPython: block => [
      `my_van.at_traffic_light(${pythonChoiceArg(block)})`,
      Order.FUNCTION_CALL,
    ],
  },
)
export const DEAD_END_BLOCK = defineBooleanBlock(
  {
    type: "dead_end",
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_DEAD_END_TITLE}",
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  { toPython: () => ["my_van.at_dead_end()", Order.FUNCTION_CALL] },
)
export const AT_DESTINATION_BLOCK = defineBooleanBlock(
  {
    type: "at_destination",
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_AT_DESTINATION_TITLE}",
      },
      {
        type: "field_image",
        src: emptyIcon,
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  { toPython: () => ["my_van.at_destination()", Order.FUNCTION_CALL] },
)
// The Python API only exposes a single generic "is animal crossing" check
// (no separate cow/pigeon methods), so both blocks map to it.
export const COW_CROSSING_BLOCK = defineBooleanBlock(
  {
    type: "cow_crossing",
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_COW_CROSSING_TITLE}",
      },
      {
        type: "field_image",
        src: cowIcon,
        width: 30,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  { toPython: () => ["my_van.is_animal_crossing()", Order.FUNCTION_CALL] },
)
export const PIGEON_CROSSING_BLOCK = defineBooleanBlock(
  {
    type: "pigeon_crossing",
    message0: "%1 %2",
    args0: [
      {
        type: "field_label",
        text: "%{BKY_PIGEON_CROSSING_TITLE}",
      },
      {
        type: "field_image",
        src: pigeonIcon,
        width: 30,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
    ],
  },
  { toPython: () => ["my_van.is_animal_crossing()", Order.FUNCTION_CALL] },
)

export const BOOLEAN_BLOCK_TYPES = [
  ROAD_EXISTS_BLOCK.type,
  TRAFFIC_LIGHT_BLOCK.type,
  DEAD_END_BLOCK.type,
  AT_DESTINATION_BLOCK.type,
  COW_CROSSING_BLOCK.type,
  PIGEON_CROSSING_BLOCK.type,
] as const
export type BooleanBlockType = (typeof BOOLEAN_BLOCK_TYPES)[number]
