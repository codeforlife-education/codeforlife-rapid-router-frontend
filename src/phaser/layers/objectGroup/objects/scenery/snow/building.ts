import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../../objects"
import * as snow from "./snow"
import * as tilesets from "../../../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Snow.Building
const _Names = objects.Names.Scenery.Snow.Building
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.scenery.snow.ID>(
  kwArgs: snow.FactoryKwArgs<N, GID>,
) => snow.factory(kwArgs)

export const hospital = factory({
  gid: _IDs.HOSPITAL,
  name: _Names.HOSPITAL,
})

export const school = factory({
  gid: _IDs.SCHOOL,
  name: _Names.SCHOOL,
})

export const shop = factory({
  gid: _IDs.SHOP,
  name: _Names.SHOP,
})
