import { flattenNumberValues } from "codeforlife/utils/object"

import * as endpoints from "../endpoints"
import * as tilesets from "../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../globals"

const _IDs = tilesets.IDs.Endpoints.House
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(
  kwArgs: Omit<endpoints.MakeKwArgs<GID>, "imagewidth" | "imageheight">,
) =>
  endpoints.make(import.meta.url, {
    imagewidth: TILE_WIDTH * 0.5,
    imageheight: TILE_HEIGHT * 0.5,
    ...kwArgs,
  })

export const common = {
  blue: make({
    image: "./common/blue.svg",
    firstgid: _IDs.Common.BLUE,
  }),
  orange: make({
    image: "./common/orange.svg",
    firstgid: _IDs.Common.ORANGE,
  }),
  straw: make({
    image: "./common/straw.svg",
    firstgid: _IDs.Common.STRAW,
  }),
  wood: make({
    image: "./common/wood.svg",
    firstgid: _IDs.Common.WOOD,
  }),
} as const

export const snow = {
  blue: make({
    image: "./snow/blue.svg",
    firstgid: _IDs.Snow.BLUE,
  }),
  orange: make({
    image: "./snow/orange.svg",
    firstgid: _IDs.Snow.ORANGE,
  }),
  straw: make({
    image: "./snow/straw.svg",
    firstgid: _IDs.Snow.STRAW,
  }),
} as const
