import { flattenNumberValues } from "codeforlife/utils/object"

import * as snow from "../snow"
import * as tilesets from "../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Snow.Nature
export const IDs = flattenNumberValues(_IDs)
export type ID = (typeof IDs)[number]

const make = <GID extends ID>(kwArgs: snow.MakeKwArgs<GID>) =>
  snow.make(import.meta.url, kwArgs)

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
