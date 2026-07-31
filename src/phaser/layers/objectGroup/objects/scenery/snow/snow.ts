import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../../objects"
import * as scenery from "../scenery"
import type * as tilesets from "../../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Scenery.Snow)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.scenery.ID,
> = scenery.FactoryKwArgs<N, GID>

export const factory = <N extends Name, GID extends tilesets.scenery.snow.ID>(
  kwArgs: FactoryKwArgs<N, GID>,
) => scenery.factory(kwArgs)
