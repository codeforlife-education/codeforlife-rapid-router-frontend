import {
  type DeepStringsOf,
  createIdRegistry,
  createPathStrings,
} from "codeforlife/utils/object"
import type { TiledObject as _Object } from "tiled-types"

import type * as tilesets from "../../../tilesets"
import { TILE_HEIGHT, TILE_WIDTH } from "../../../globals"

export type ID = tilesets.endpoints.ID | tilesets.scenery.ID

// Global registry of object names.
export const Names = createPathStrings({
  Endpoints: {
    CFC: {
      Barn: ["BLACK", "RED"],
      Warehouse: ["DEFAULT", "SNOW"],
    },
    House: {
      Snow: ["BLUE", "ORANGE", "STRAW"],
      Common: ["BLUE", "ORANGE", "STRAW", "WOOD"],
    },
  },
  Scenery: {
    Snow: {
      Building: ["BARN", "HOSPITAL", "SCHOOL", "SHOP"],
      Nature: ["BUSH", "CROPS", "POND", { Tree: ["OAK", "PINE"] }],
      Other: ["SOLAR_PANEL"],
    },
    Nature: ["BUSH", "CROPS", "HAY", "POND", { Tree: ["OAK", "PINE"] }],
    Building: ["HOSPITAL", "HOUSE", "SCHOOL", "SHOP"],
    Other: ["SOLAR_PANEL"],
  },
} as const)
export type Name = DeepStringsOf<typeof Names>

// Enum of object depths.
export const Depths = createIdRegistry({
  0: "BELOW_GROUND", // below the ground layer (e.g., pond).
  1: "GROUND", // on the ground layer (e.g., bush).
  2: "ABOVE_GROUND", // above the ground layer (e.g., tree).
} as const)
export type Depth = (typeof Depths)[keyof typeof Depths]

// Global registry of object depths.
const DEPTHS: Partial<Record<ID | Name, Depth>> = {}

// Getter for an object depth by its GID.
export const getDepth = (id: ID | Name) => DEPTHS[id] ?? Depths.GROUND

export type Object<N extends Name, GID extends ID> = Omit<
  _Object,
  "type" | "name" | "gid"
> & { type: N; name: N; gid: GID }
export type FactoryObject<N extends Name, GID extends ID> = Omit<
  Object<N, GID>,
  | "id"
  // `width` and `height` are omitted because they will be determined in their
  // tileset's `imagewidth` and `imageheight` properties.
  | "width"
  | "height"
>

type TileOffset = { col: number; row: number }

export type FactoryBaseKwArgs<N extends Name, GID extends ID> = Partial<
  Omit<FactoryObject<N, GID>, "type" | "name" | "gid"> & TileOffset
>
type FactoryBase<N extends Name, GID extends ID> = (
  kwArgs: FactoryBaseKwArgs<N, GID>,
) => FactoryObject<N, GID>

export type FactoryVariantSpecs<N extends Name, GID extends ID> = Record<
  string,
  FactoryBaseKwArgs<N, GID>
>
export type FactoryVariant<
  N extends Name,
  GID extends ID,
  B extends FactoryBaseKwArgs<N, GID>,
> = (
  kwArgs: Omit<FactoryBaseKwArgs<N, GID>, keyof B>,
) => FactoryObject<N, GID> & B
type FactoryVariants<
  N extends Name,
  GID extends ID,
  V extends FactoryVariantSpecs<N, GID>,
> = { [K in keyof V]: FactoryVariant<N, GID, V[K]> }

export type FactoryKwArgs<N extends Name, GID extends ID> = {
  name: N
  gid: GID
  depth?: Depth
} & FactoryBaseKwArgs<N, GID>
export type Factory<
  N extends Name,
  GID extends ID,
  V extends FactoryVariantSpecs<N, GID> = {},
> = FactoryBase<N, GID> & FactoryVariants<N, GID, V>

// Global registry of object factories.
const FACTORIES: Partial<Record<ID | Name, FactoryBase<Name, ID>>> = {}

// Getter for an object factory by its GID.
export const getFactory = (id: ID | Name) => FACTORIES[id]

export const factory = <
  N extends Name,
  GID extends ID,
  const V extends FactoryVariantSpecs<N, GID> = {},
>(
  {
    gid,
    name,
    depth = Depths.GROUND,
    x: baseX = 0,
    y: baseY = 0,
    col: baseCol = 0,
    row: baseRow = 0,
    properties: baseProperties = [],
    visible: baseVisible = true,
    rotation: baseRotation = 0,
    ...objBase
  }: FactoryKwArgs<N, GID>,
  variants: V = {} as V,
): Factory<N, GID, V> => {
  DEPTHS[gid] = DEPTHS[name] = depth

  baseX += baseCol * TILE_WIDTH
  baseY += baseRow * TILE_HEIGHT

  const base: FactoryBase<N, GID> = ({
    x,
    y,
    col,
    row,
    properties,
    visible = baseVisible,
    rotation,
    ...obj
  }) => ({
    gid,
    type: name,
    name,
    x: (x ? baseX + x : baseX) + (col ? col * TILE_WIDTH : 0),
    y: (y ? baseY + y : baseY) + (row ? row * TILE_HEIGHT : 0),
    properties: properties
      ? [...baseProperties, ...properties]
      : baseProperties,
    visible,
    rotation: rotation ? baseRotation + rotation : baseRotation,
    ...objBase,
    ...obj,
  })

  FACTORIES[gid] = FACTORIES[name] = base

  return (Object.entries(variants) as [keyof V, V[keyof V]][]).reduce(
    (f, [variantName, variantKwArgs]) => {
      ;(f as unknown as FactoryVariants<N, GID, V>)[variantName] = kwArgs =>
        f({ ...variantKwArgs, ...kwArgs }) as FactoryObject<N, GID> & V[keyof V]

      return f
    },
    base,
  ) as Factory<N, GID, V>
}

type BaseRotationVariant<R extends number> = { rotation: R }
type RotationVariant<R extends number> = BaseRotationVariant<R> & {
  x: number
  y: number
}

type StraightRotation = 0 | 90 | 180 | 270
export type BaseStraightRotationVariant = BaseRotationVariant<StraightRotation>
export type BaseStraightRotationVariants = {
  top: BaseStraightRotationVariant
  right: BaseStraightRotationVariant
  bottom: BaseStraightRotationVariant
  left: BaseStraightRotationVariant
}
export type MakeStraightRotationVariantsKwArgs =
  BaseStraightRotationVariants & { tileOffset?: Partial<TileOffset> }
export type StraightRotationVariant = RotationVariant<StraightRotation>
export type StraightRotationVariants = {
  [K in keyof BaseStraightRotationVariants]: StraightRotationVariant
}

export const makeStraightRotationVariants = ({
  tileOffset: { col = 0, row = 0 } = {},
  top: t,
  right: r,
  bottom: b,
  left: l,
}: MakeStraightRotationVariantsKwArgs): StraightRotationVariants => ({
  top: { x: TILE_WIDTH * row, y: TILE_HEIGHT * (1 - col), ...t },
  bottom: { x: TILE_WIDTH * (1 - row), y: TILE_HEIGHT * col, ...b },
  left: { x: TILE_WIDTH * (1 - col), y: TILE_HEIGHT * (1 - row), ...l },
  right: { x: TILE_WIDTH * col, y: TILE_HEIGHT * row, ...r },
})

type DiagonalRotation = 45 | 135 | 225 | 315
export type BaseDiagonalRotationVariant = BaseRotationVariant<DiagonalRotation>
export type BaseDiagonalRotationVariants = {
  topLeft: BaseDiagonalRotationVariant
  topRight: BaseDiagonalRotationVariant
  bottomRight: BaseDiagonalRotationVariant
  bottomLeft: BaseDiagonalRotationVariant
}
export type MakeDiagonalRotationVariantsKwArgs =
  BaseDiagonalRotationVariants & { tileOffset?: Partial<TileOffset> }
export type DiagonalRotationVariant = RotationVariant<DiagonalRotation>
export type DiagonalRotationVariants = {
  [K in keyof BaseDiagonalRotationVariants]: DiagonalRotationVariant
}

export const makeDiagonalRotationVariants = ({
  tileOffset: { col = 0, row = 0 } = {},
  topLeft: tl,
  topRight: tr,
  bottomRight: br,
  bottomLeft: bl,
}: MakeDiagonalRotationVariantsKwArgs): DiagonalRotationVariants => ({
  topLeft: { x: TILE_WIDTH * col, y: TILE_HEIGHT * row, ...tl },
  bottomRight: { x: TILE_WIDTH * (1 - col), y: TILE_HEIGHT * (1 - row), ...br },
  bottomLeft: { x: TILE_WIDTH * row, y: TILE_HEIGHT * (1 - col), ...bl },
  topRight: { x: TILE_WIDTH * (1 - row), y: TILE_HEIGHT * col, ...tr },
})
