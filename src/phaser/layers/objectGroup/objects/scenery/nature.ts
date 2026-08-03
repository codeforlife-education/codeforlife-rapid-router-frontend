import { flattenStringValues } from "codeforlife/utils/object"

import * as objects from "../objects"
import * as scenery from "./scenery"
import * as tilesets from "../../../../tilesets"

const _IDs = tilesets.IDs.Scenery.Nature
const _Names = objects.Names.Scenery.Nature
export const Names = flattenStringValues(_Names)
export type Name = (typeof Names)[number]

const factory = <N extends Name, GID extends tilesets.scenery.nature.ID>(
  kwArgs: scenery.FactoryKwArgs<N, GID>,
) => scenery.factory(kwArgs)

export const bush = factory({
  gid: _IDs.BUSH,
  name: _Names.BUSH,
})

export const crops = factory({
  gid: _IDs.CROPS,
  name: _Names.CROPS,
  depth: objects.Depths.BELOW_GROUND,
})

export const hay = factory({
  gid: _IDs.HAY,
  name: _Names.HAY,
})

export const pond = factory({
  gid: _IDs.POND,
  name: _Names.POND,
  depth: objects.Depths.BELOW_GROUND,
})

export const tree = {
  oak: factory({
    gid: _IDs.Tree.OAK,
    name: _Names.Tree.OAK,
    depth: objects.Depths.ABOVE_GROUND,
  }),
  pine: factory({
    gid: _IDs.Tree.PINE,
    name: _Names.Tree.PINE,
    depth: objects.Depths.ABOVE_GROUND,
  }),
} as const

export const snow = {
  bush: factory({
    gid: _IDs.Snow.BUSH,
    name: _Names.Snow.BUSH,
  }),
  crops: factory({
    gid: _IDs.Snow.CROPS,
    name: _Names.Snow.CROPS,
    depth: objects.Depths.BELOW_GROUND,
  }),
  pond: factory({
    gid: _IDs.Snow.POND,
    name: _Names.Snow.POND,
    depth: objects.Depths.BELOW_GROUND,
  }),
  tree: {
    oak: factory({
      gid: _IDs.Snow.Tree.OAK,
      name: _Names.Snow.Tree.OAK,
      depth: objects.Depths.ABOVE_GROUND,
    }),
    pine: factory({
      gid: _IDs.Snow.Tree.PINE,
      name: _Names.Snow.Tree.PINE,
      depth: objects.Depths.ABOVE_GROUND,
    }),
  },
} as const
