import * as other from "./other"
import * as snow from "./snow"
import * as tilesets from "../../tilesets"

export { type ID, IDs } from "./other"

const _IDs = tilesets.IDs.Scenery.Other

const make = <GID extends other.ID>(kwArgs: other.MakeKwArgs<GID>) =>
  other.make(import.meta.url, kwArgs)

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
  imagescale: 0.2,
})

export default [solarPanel, ...snow.default]
export { snow }
