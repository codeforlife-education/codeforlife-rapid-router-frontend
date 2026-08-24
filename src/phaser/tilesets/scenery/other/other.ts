import { flattenNumberValues } from "codeforlife/utils/object"

import * as scenery from "../scenery"
import * as tilesets from "../../tilesets"

export const IDs = flattenNumberValues(tilesets.IDs.Scenery.Other)
export type ID = (typeof IDs)[number]

export type MakeKwArgs<GID extends ID> = scenery.MakeKwArgs<GID>

export const make = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) => scenery.make(importMetaUrl, kwArgs)
