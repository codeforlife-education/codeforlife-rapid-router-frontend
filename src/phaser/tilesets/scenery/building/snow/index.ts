import { flattenNumberValues } from "codeforlife/utils/object"

import * as building from "../building"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Building.Snow
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: building.MakeKwArgs<GID>) =>
  building.make(import.meta.url, kwArgs)

export const hospital = make({
  image: "./hospital.svg",
  firstgid: _IDs.HOSPITAL,
  imagescale: 0.125,
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

export default [hospital, school, shop]
