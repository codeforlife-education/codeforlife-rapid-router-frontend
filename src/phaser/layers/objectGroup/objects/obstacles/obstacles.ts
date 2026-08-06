import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import type * as tilesets from "../../../../tilesets"

export const Names = flattenStringValues(objects.Names.Obstacles)
export type Name = (typeof Names)[number]

export type FactoryKwArgs<
  N extends Name,
  GID extends tilesets.obstacles.ID,
> = objects.FactoryKwArgs<N, GID>

export type FactoryVariants = objects.MakeStraightRotationVariantsKwArgs

export const factory = <N extends Name, GID extends tilesets.obstacles.ID>(
  kwArgs: FactoryKwArgs<N, GID>,
  variants: FactoryVariants,
) => objects.factory(kwArgs, objects.makeStraightRotationVariants(variants))
