import { flattenNumberValues } from "codeforlife/utils/object"

import * as scenery from "../scenery"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Scenery.Building
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: scenery.MakeKwArgs<GID>) =>
  scenery.make(import.meta.url, kwArgs)

export const hospital = make({
  image: "./hospital.svg",
  firstgid: _IDs.HOSPITAL,
  imagescale: 0.125,
})

export const house = make({
  image: "./house.svg",
  firstgid: _IDs.HOUSE,
  imagescale: 0.1,
})

export const logCabin = make({
  image: "./log_cabin.svg",
  firstgid: _IDs.LOG_CABIN,
  imagescale: 0.15,
})

export const school = make({
  image: "./school.svg",
  firstgid: _IDs.SCHOOL,
  imagescale: 0.2,
})

export const shop = make({
  image: "./shop.svg",
  firstgid: _IDs.SHOP,
  imagescale: 0.25,
})
