import { flattenNumberValues } from "codeforlife/utils/object"

import * as obstacles from "../obstacles"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Obstacles.TrafficLight
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <
  GID extends ID,
  Props extends obstacles.PropertyValues = obstacles.PropertyValues<false>,
>(
  kwArgs: Omit<obstacles.MakeKwArgs<GID, Props>, "tilescale">,
) => obstacles.make(import.meta.url, { tilescale: 0.625, ...kwArgs })

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
