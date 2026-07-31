import { flattenNumberValues } from "codeforlife/utils/object"

import * as snow from "../snow"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Snow.Other
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: snow.MakeKwArgs<GID>) =>
  snow.make(import.meta.url, kwArgs)

export const solarPanel = make({
  image: "./solar_panel.svg",
  firstgid: _IDs.SOLAR_PANEL,
  // imagescale: 0.4,
})
