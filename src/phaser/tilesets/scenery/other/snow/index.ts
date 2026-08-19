import { flattenNumberValues } from "codeforlife/utils/object"

import * as other from "../other"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Other.Snow
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: other.MakeKwArgs<GID>) =>
  other.make(import.meta.url, kwArgs)

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
  imagescale: 0.2,
})

export default [solarPanel]
