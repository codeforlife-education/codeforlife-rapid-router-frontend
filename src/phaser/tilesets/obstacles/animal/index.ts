import { flattenNumberValues } from "codeforlife/utils/object"

import * as obstacles from "../obstacles"
import * as tilesets from "../../tilesets"

const _IDs = tilesets.IDs.Obstacles.Animal
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID, T extends boolean = false>(
  kwArgs: Omit<obstacles.MakeKwArgs<GID, T>, "tilescale">,
) => obstacles.make(import.meta.url, { tilescale: 0.5, ...kwArgs })

export const cow = make({
  image: "./cow.svg",
  firstgid: _IDs.COW,
})

export const pigeon = make({
  image: "./pigeon.svg",
  firstgid: _IDs.PIGEON,
})

export default [cow, pigeon]
