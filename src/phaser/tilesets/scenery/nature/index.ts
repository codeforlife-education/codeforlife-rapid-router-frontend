import * as nature from "./nature"
import * as snow from "./snow"
import * as tilesets from "../../tilesets"

export { type ID, IDs } from "./nature"

const _IDs = tilesets.IDs.Scenery.Nature

const make = <GID extends nature.ID>(kwArgs: nature.MakeKwArgs<GID>) =>
  nature.make(import.meta.url, kwArgs)

export const bush = make({
  image: "./bush.svg",
  firstgid: _IDs.BUSH,
  imagescale: 0.5,
})

export const crops = make({
  image: "./crops.svg",
  firstgid: _IDs.CROPS,
  imagescale: 0.3,
})

export const hay = make({
  image: "./hay.svg",
  firstgid: _IDs.HAY,
  imagescale: 0.5,
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
    imagescale: 0.5,
  }),
  pine: make({
    image: "./tree/pine.svg",
    firstgid: _IDs.Tree.PINE,
    imagescale: 0.65,
  }),
} as const

export default [bush, crops, hay, pond, tree.oak, tree.pine, ...snow.default]
export { snow }
