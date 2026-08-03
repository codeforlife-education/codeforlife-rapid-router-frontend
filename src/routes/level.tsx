import { Route } from "react-router"

import Level, { type LevelProps } from "../pages/level/Level"
import LevelCreator from "../pages/levelCreator/LevelCreator"
import paths from "./paths"

const levels = [
  {
    id: 1,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards"],
  },
  {
    id: 2,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards"],
  },
  {
    id: 3,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right"],
  },
  {
    id: 4,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right"],
  },
  {
    id: 5,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 6,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 7,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 8,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 9,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 10,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 11,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 12,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 13,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 14,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 15,
    mode: "blockly",
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_right",
      "turn_left",
      "deliver",
    ],
  },
  {
    id: 16,
    mode: "blockly",
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_right",
      "turn_left",
      "deliver",
    ],
  },
  {
    id: 17,
    mode: "blockly",
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_right",
      "turn_left",
      "deliver",
    ],
  },
  {
    id: 18,
    mode: "blockly",
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_right",
      "turn_left",
      "deliver",
    ],
  },
  {
    id: 19,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 20,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 21,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 22,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 23,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 24,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 25,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 26,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 27,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 28,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 29,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 30,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 31,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 32,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 33,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 34,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 35,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 36,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 37,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 38,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 39,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 40,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 41,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 42,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
] as const satisfies LevelProps[]

export default (
  <>
    <Route path={paths.level.creator._} element={<LevelCreator />} />
    {levels.map(({ id, ...levelProps }) => (
      <Route
        key={`level-${id}`}
        path={paths.level.id[id]._}
        element={<Level id={id} {...levelProps} />}
      />
    ))}
    <Route path={paths.level.id._} element={<Level />} />
  </>
)
