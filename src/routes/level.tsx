import { Route } from "react-router"

import Level, { type LevelProps } from "../pages/level/Level"
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
  {
    id: 43,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 44,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 45,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 46,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 47,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 48,
    mode: "blockly",
    blockly_toolbox_block_types: [
      "move_forwards",
      "turn_right",
      "turn_left",
      "deliver",
    ],
  },
  {
    id: 49,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 50,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 51,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 52,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 53,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 54,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 55,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 56,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 57,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 58,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 59,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 60,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 61,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 62,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 63,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 64,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 65,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 66,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 67,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 68,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 69,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 70,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 71,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 72,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 73,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 74,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 75,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 76,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 77,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 78,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_right", "turn_left"],
  },
  {
    id: 79,
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
