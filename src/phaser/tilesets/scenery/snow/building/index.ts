import { flattenNumberValues } from "codeforlife/utils/object"

import * as snow from "../snow"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Snow.Building
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: snow.MakeKwArgs<GID>) =>
  snow.make(import.meta.url, kwArgs)

export const barn = make({
  image: "./barn.svg",
  firstgid: _IDs.BARN,
  // imagescale: 0.4,
})

export const hospital = make({
  image: "./hospital.svg",
  firstgid: _IDs.HOSPITAL,
  // imagescale: 0.4,
})

export const school = make({
  image: "./school.svg",
  firstgid: _IDs.SCHOOL,
  // imagescale: 0.4,
})

export const shop = make({
  image: "./shop.svg",
  firstgid: _IDs.SHOP,
  // imagescale: 0.4,
})
