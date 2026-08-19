import { Route } from "react-router"

import Level, { type LevelProps } from "../pages/level/Level"
import LevelCreator from "../pages/levelCreator/LevelCreator"
import paths from "./paths"

const levels = [
  {
    id: 1,
    mode: "blockly",
    blockly_toolbox_block_types: ["move_forwards", "turn_left", "turn_right"],
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
