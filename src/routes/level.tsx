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
