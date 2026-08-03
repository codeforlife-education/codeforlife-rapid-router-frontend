import * as building from "./building"
import * as snow from "./snow"
import * as tilesets from "../../tilesets"

export { IDs, type ID } from "./building"

const _IDs = tilesets.IDs.Scenery.Building

const make = <GID extends building.ID>(kwArgs: building.MakeKwArgs<GID>) =>
  building.make(import.meta.url, kwArgs)

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

export default [hospital, house, logCabin, school, shop, ...snow.default]
export { snow }
