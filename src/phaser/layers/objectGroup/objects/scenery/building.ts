import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import * as scenery from "./scenery"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Building
const _Names = objects.Names.Scenery.Building
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.scenery.building.ID>(
  kwArgs: scenery.FactoryKwArgs<N, GID>,
) => scenery.factory(kwArgs)

export const hospital = factory({
  gid: _IDs.HOSPITAL,
  name: _Names.HOSPITAL,
})

export const house = factory({
  gid: _IDs.HOUSE,
  name: _Names.HOUSE,
})

export const school = factory({
  gid: _IDs.SCHOOL,
  name: _Names.SCHOOL,
})

export const shop = factory({
  gid: _IDs.SHOP,
  name: _Names.SHOP,
})
