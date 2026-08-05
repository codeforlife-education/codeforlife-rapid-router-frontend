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
  {
    left,
    top,
    right,
    bottom,
    ...diagonal
  }: objects.BaseStraightRotationVariants &
    objects.BaseDiagonalRotationVariants,
) => {
  const diagonalRotationVariants = objects.makeDiagonalRotationVariants({
    tileOffset: { col: 0, row: 0 },
    ...diagonal,
  })

  return obstacles.factory(kwArgs, {
    tileOffset: { col: 0, row: 0 },
    left,
    top,
    right,
    bottom,
    ...diagonalRotationVariants,
  })
}

export const cow = factory(
  { gid: _IDs.COW, name: _Names.COW },
  {
    top: { rotation: 0 },
    topRight: { rotation: 45 },
    right: { rotation: 90 },
    bottomRight: { rotation: 135 },
    bottom: { rotation: 180 },
    bottomLeft: { rotation: 225 },
    left: { rotation: 270 },
    topLeft: { rotation: 315 },
  },
)

export const pigeon = factory(
  { gid: _IDs.PIGEON, name: _Names.PIGEON },
  {
    right: { rotation: 0 },
    bottomRight: { rotation: 45 },
    bottom: { rotation: 90 },
    bottomLeft: { rotation: 135 },
    left: { rotation: 180 },
    topLeft: { rotation: 225 },
    top: { rotation: 270 },
    topRight: { rotation: 315 },
  },
)
