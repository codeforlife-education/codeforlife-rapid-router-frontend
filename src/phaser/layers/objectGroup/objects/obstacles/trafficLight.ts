import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import * as obstacles from "./obstacles"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Obstacles.TrafficLight
const _Names = objects.Names.Obstacles.TrafficLight
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <
  N extends Name,
  GID extends tilesets.obstacles.trafficLight.ID,
>(
  kwArgs: obstacles.FactoryKwArgs<N, GID>,
  variants: objects.BaseStraightRotationVariants,
) => obstacles.factory(kwArgs, { tileOffset: { col: 0, row: 0 }, ...variants })

export const red = factory(
  { gid: _IDs.RED, name: _Names.RED },
  {
    bottom: { rotation: 0 },
    left: { rotation: 90 },
    top: { rotation: 180 },
    right: { rotation: 270 },
  },
)

export const green = factory(
  { gid: _IDs.GREEN, name: _Names.GREEN },
  {
    bottom: { rotation: 0 },
    left: { rotation: 90 },
    top: { rotation: 180 },
    right: { rotation: 270 },
  },
)
