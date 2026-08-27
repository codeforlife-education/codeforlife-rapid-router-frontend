import { flattenNumberValues } from "codeforlife/utils/object"

import * as tilesets from "../tilesets"

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
> = Omit<
  tilesets.MakeKwArgs<GID, Properties<Props>>,
  "properties" | "imagewidth" | "imageheight" | "imagescale"
> & {
  properties?: Partial<Props>
}

export const make = <
  GID extends ID,
  Props extends PropertyValues = PropertyValues<false>,
>(
  importMetaUrl: string,
  {
    properties: { canDriveThrough = false } = {},
    ...kwArgs
  }: MakeKwArgs<GID, Props>,
) =>
  tilesets.make(importMetaUrl, {
    properties: [
      {
        name: "canDriveThrough",
        value: canDriveThrough,
        type: "bool",
      },
    ] as Properties<Props>,
    ...kwArgs,
  })
