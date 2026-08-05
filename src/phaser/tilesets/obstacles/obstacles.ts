import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../globals"

export const IDs = flattenNumberValues(tilesets.IDs.Obstacles)
export type ID = (typeof IDs)[number]

type Properties<T extends boolean> = [
  { name: "canDriveThrough"; value: T; type: "bool" },
]

export type MakeKwArgs<GID extends ID, T extends boolean = false> = Omit<
  tilesets.MakeKwArgs<GID, Properties<T>>,
  "properties"
> & { properties?: Partial<{ canDriveThrough: T }>; tilescale?: number }

export const make = <GID extends ID, T extends boolean = false>(
  importMetaUrl: string,
  {
    properties: { canDriveThrough = false as T } = {},
    tilescale = 1,
    ...kwArgs
  }: MakeKwArgs<GID, T>,
) =>
  tilesets.make(importMetaUrl, {
    imagewidth: TILE_WIDTH * tilescale,
    imageheight: TILE_HEIGHT * tilescale,
    properties: [
      {
        name: "canDriveThrough",
        value: canDriveThrough,
        type: "bool",
      },
    ] as Properties<T>,
    ...kwArgs,
  })
