import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../../objects"
import * as snow from "./snow"
import * as tilesets from "../../../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Snow.Other
const _Names = objects.Names.Scenery.Snow.Other
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.scenery.snow.ID>(
  kwArgs: snow.FactoryKwArgs<N, GID>,
) => snow.factory(kwArgs)

export const solarPanel = factory({
  gid: _IDs.SOLAR_PANEL,
  name: _Names.SOLAR_PANEL,
})
