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
  kwArgs: Omit<obstacles.FactoryKwArgs<N, GID>, "flipX">,
) =>
  obstacles.factory(
    { ...kwArgs, flipX: true },
    {
      tileOffset: { col: 1.25, row: 0.825 },
      bottom: { rotation: 0 },
      left: { rotation: 90 },
      top: { rotation: 180 },
      right: { rotation: 270 },
    },
  )

export const red = factory({ gid: _IDs.RED, name: _Names.RED })

export const green = factory({ gid: _IDs.GREEN, name: _Names.GREEN })
