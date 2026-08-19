import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../globals"

export const IDs = flattenNumberValues(tilesets.IDs.Obstacles)
export type ID = (typeof IDs)[number]

export type PropertyValues<CanDriveThrough extends boolean = boolean> = {
  canDriveThrough: CanDriveThrough
}
export type Properties<Values extends PropertyValues> = [
  { name: "canDriveThrough"; value: Values["canDriveThrough"]; type: "bool" },
]

export type MakeKwArgs<
  GID extends ID,
  Props extends PropertyValues = PropertyValues<false>,
> = Omit<tilesets.MakeKwArgs<GID, Properties<Props>>, "properties"> & {
  properties?: Partial<Props>
  tilescale?: number
}

export const make = <
  GID extends ID,
  Props extends PropertyValues = PropertyValues<false>,
>(
  importMetaUrl: string,
  {
    properties: { canDriveThrough = false } = {},
    tilescale = 1,
    ...kwArgs
  }: MakeKwArgs<GID, Props>,
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
    ] as Properties<Props>,
    ...kwArgs,
  })
