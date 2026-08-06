import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import * as obstacles from "./obstacles"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Obstacles.Animal
const _Names = objects.Names.Obstacles.Animal
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.obstacles.animal.ID>(
  kwArgs: obstacles.FactoryKwArgs<N, GID>,
  variants: obstacles.FactoryVariants,
) => obstacles.factory(kwArgs, variants)

export const cow = factory(
  { gid: _IDs.COW, name: _Names.COW },
  {
    tileOffset: { col: 0.25, row: 0.125 },
    top: { rotation: 0 },
    right: { rotation: 90 },
    bottom: { rotation: 180 },
    left: { rotation: 270 },
  },
)

export const pigeon = factory(
  { gid: _IDs.PIGEON, name: _Names.PIGEON },
  {
    tileOffset: { col: 0.5, row: 0.75 },
    right: { rotation: 0 },
    bottom: { rotation: 90 },
    left: { rotation: 180 },
    top: { rotation: 270 },
  },
)
