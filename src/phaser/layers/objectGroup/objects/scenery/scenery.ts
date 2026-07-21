import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"
import { TILE_HEIGHT } from "../../../../globals"

export const Names = flattenStringValues(objects.Names.Scenery)
export type Name = (typeof Names)[number]

export const FACTORIES: Partial<
  Record<tilesets.scenery.ID, ReturnType<typeof factory>>
> = {}

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.scenery.ID,
> = objects.FactoryKwArgs<N, GID>

export const factory = <N extends Name, GID extends tilesets.scenery.ID>({
  gid,
  ...kwArgs
}: FactoryKwArgs<N, GID>) => {
  const f = objects.factory({ y: TILE_HEIGHT, gid, ...kwArgs })
  FACTORIES[gid] = f
  return f
}
