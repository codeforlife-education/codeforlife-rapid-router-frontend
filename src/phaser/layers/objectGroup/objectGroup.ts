import type { TiledLayerObjectgroup as _Layer } from "tiled-types"

import * as layers from "../layers"
import type * as objects from "./objects"

export const Names = Object.values(layers.Names.ObjectGroup)
export type Name = (typeof Names)[number]
export type Layer<
  OGN extends Name = Name,
  ON extends objects.Name = objects.Name,
  OID extends objects.ID = objects.ID,
  Obj extends { gid: OID } = objects.Object<ON, OID>,
> = Omit<_Layer, "name" | "objects"> & { name: OGN; objects: Obj[] }

type MakePartials = "draworder"
export type MakeKwArgs<
  OGN extends Name = Name,
  ON extends objects.Name = objects.Name,
  OID extends objects.ID = objects.ID,
  Obj extends { gid: OID } = objects.Object<ON, OID>,
> = Omit<layers.MakeKwArgs<OGN, "objectgroup">, "type"> &
  Omit<
    Layer<OGN, ON, OID, Obj>,
    keyof layers.MakeKwArgs<OGN, "objectgroup"> | MakePartials
  > &
  Partial<Pick<Layer<OGN, ON, OID, Obj>, MakePartials>>

export const make = <
  OGN extends Name,
  ON extends objects.Name,
  OID extends objects.ID,
>({
  name,
  draworder = "topdown",
  ...layer
}: MakeKwArgs<OGN, ON, OID>): Layer<OGN, ON, OID> => ({
  ...layers.make({ name, type: "objectgroup" }),
  draworder,
  ...layer,
})
