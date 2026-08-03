import { flattenNumberValues } from "codeforlife/utils/object"

import * as nature from "../nature"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Nature.Snow
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: nature.MakeKwArgs<GID>) =>
  nature.make(import.meta.url, kwArgs)

export const bush = make({
  image: "./bush.svg",
  firstgid: _IDs.BUSH,
  imagescale: 0.4,
})

export const crops = make({
  image: "./crops.svg",
  firstgid: _IDs.CROPS,
  imagescale: 0.3,
})

export const pond = make({
  image: "./pond.svg",
  firstgid: _IDs.POND,
  imagescale: 0.3,
})

export const tree = {
  oak: make({
    image: "./tree/oak.svg",
    firstgid: _IDs.Tree.OAK,
    imagescale: 0.4,
  }),
  pine: make({
    image: "./tree/pine.svg",
    firstgid: _IDs.Tree.PINE,
    imagescale: 0.515,
  }),
} as const

export default [bush, crops, pond, tree.oak, tree.pine]
