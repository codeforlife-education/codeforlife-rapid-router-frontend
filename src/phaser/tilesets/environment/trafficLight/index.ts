import { flattenNumberValues } from "codeforlife/utils/object"

import * as environment from "../environment"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Environment.TrafficLight
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const red = make({
  image: "./red.svg",
  firstgid: _IDs.RED,
})

export const green = make({
  image: "./green.svg",
  firstgid: _IDs.GREEN,
  properties: { canDriveThrough: true },
})

export default [red, green]
