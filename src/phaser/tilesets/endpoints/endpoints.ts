import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"

export const IDs = flattenNumberValues(tilesets.IDs.Endpoints)
export type ID = (typeof IDs)[number]

export type MakeKwArgs<GID extends ID> = Omit<
  tilesets.MakeKwArgs<GID>,
  "imagewidth" | "imageheight" | "imagescale"
>

export const make = <GID extends ID>(
  importMetaUrl: string,
  kwArgs: MakeKwArgs<GID>,
) => tilesets.make(importMetaUrl, kwArgs)
