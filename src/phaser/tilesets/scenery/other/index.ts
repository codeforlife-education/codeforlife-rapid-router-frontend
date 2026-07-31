import { flattenNumberValues } from "codeforlife/utils/object"

import * as scenery from "../scenery"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Scenery.Other
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: scenery.MakeKwArgs<GID>) =>
  scenery.make(import.meta.url, kwArgs)

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
  imagescale: 0.2,
})
