import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../globals"

export const IDs = flattenNumberValues(tilesets.IDs.Endpoints)
export type ID = (typeof IDs)[number]

export type MakeKwArgs<GID extends ID> = Omit<
  tilesets.MakeKwArgs<GID>,
  "imagewidth" | "imageheight" | "imagescale"
> & { tilescale?: number }

export const make = <GID extends ID>(
  importMetaUrl: string,
  { tilescale = 1, ...kwArgs }: MakeKwArgs<GID>,
) =>
  tilesets.make(importMetaUrl, {
    // endpoints are placed as grid-aligned objects whose rendered size must
    // match a tile slot.
    imagewidth: TILE_WIDTH * tilescale,
    imageheight: TILE_HEIGHT * tilescale,
    ...kwArgs,
  })
