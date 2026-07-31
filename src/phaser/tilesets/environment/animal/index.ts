import { flattenNumberValues } from "codeforlife/utils/object"

import * as environment from "../environment"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Environment.Animal
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: environment.MakeKwArgs<GID, T>,
) => environment.make(import.meta.url, kwArgs)

export const cow = make({
  image: "./cow.svg",
  firstgid: _IDs.COW,
})

export const pigeon = make({
  image: "./pigeon.svg",
  firstgid: _IDs.PIGEON,
})
