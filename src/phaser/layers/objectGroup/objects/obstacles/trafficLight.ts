import type { TiledProperty } from "tiled-types"
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

/**
 * How a traffic light cycles between red and green, counted in the van's
 * actions (every move/turn/wait/deliver/horn advances it by one; sensing
 * checks and loop/if headers don't). Mirrors the legacy game's
 * `traffic_lights` level data.
 */
export type Timing = {
  /** How many actions the light stays red for. */
  redDuration: number
  /** How many actions the light stays green for. */
  greenDuration: number
  /** How far into its starting colour the light already is when the level starts. */
  startTime: number
}

/** The timing a traffic light uses if its level doesn't specify one -
 * matching the legacy level editor's defaults. */
export const DEFAULT_TIMING: Timing = Object.freeze({
  redDuration: 3,
  greenDuration: 3,
  startTime: 0,
})

/**
 * Creates the Tiled properties that set a traffic light's timing, e.g.:
 * `trafficLight.red.left({ col, row, properties: timing({ ... }) })`.
 * The light's starting colour is whichever factory (`red`/`green`) is used.
 */
export const timing = ({
  redDuration,
  greenDuration,
  startTime = DEFAULT_TIMING.startTime,
}: Omit<Timing, "startTime"> & Partial<Pick<Timing, "startTime">>) =>
  [
    { name: "redDuration", type: "int", value: redDuration },
    { name: "greenDuration", type: "int", value: greenDuration },
    { name: "startTime", type: "int", value: startTime },
  ] as TiledProperty[]
