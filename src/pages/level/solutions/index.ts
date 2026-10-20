import { PYTHON_DEN_SOLUTIONS } from "./pythonDen"
import { RAPID_ROUTER_SOLUTIONS } from "./rapidRouter"
import type { TilemapGroup } from "../../../phaser/tilemaps"

const SOLUTIONS_BY_TILEMAP_GROUP: Record<
  TilemapGroup,
  Record<number, string>
> = {
  rapidRouter: RAPID_ROUTER_SOLUTIONS,
  pythonDen: PYTHON_DEN_SOLUTIONS,
}

/**
 * The model solution for a predefined level, if one exists - either a
 * Blockly XML workspace string or plain Python source, depending on the
 * level's mode (see `RAPID_ROUTER_SOLUTIONS`/`PYTHON_DEN_SOLUTIONS`).
 */
export function getSolution(
  tilemapGroup: TilemapGroup,
  levelId: number,
): string | undefined {
  return SOLUTIONS_BY_TILEMAP_GROUP[tilemapGroup][levelId]
}
