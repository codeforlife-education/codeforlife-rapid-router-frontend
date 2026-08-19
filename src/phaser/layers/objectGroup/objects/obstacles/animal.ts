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
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    tileOffset,
    ...straight
  }: Omit<objects.MakeStraightRotationVariantsKwArgs, "tileOffset"> &
    Omit<objects.MakeDiagonalRotationVariantsKwArgs, "tileOffset"> & {
      tileOffset?: {
        straight?: objects.MakeStraightRotationVariantsKwArgs["tileOffset"]
        diagonal?: objects.MakeDiagonalRotationVariantsKwArgs["tileOffset"]
      }
    },
) =>
  obstacles.factory(kwArgs, {
    ...straight,
    tileOffset: tileOffset?.straight,
    ...objects.makeDiagonalRotationVariants({
      tileOffset: tileOffset?.diagonal,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    }),
  })

export const cow = factory(
  { gid: _IDs.COW, name: _Names.COW },
  {
    tileOffset: {
      straight: { col: 0.125, row: 0.125 },
      diagonal: { col: 0.375, row: 0.875 },
    },
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
    tileOffset: {
      straight: { col: 0.25, row: 0.75 },
      diagonal: { col: 0.675, row: 0.325 },
    },
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
