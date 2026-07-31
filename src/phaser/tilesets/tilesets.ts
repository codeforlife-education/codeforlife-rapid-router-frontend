import { type DeepNumbersOf, createIdRegistry } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledTileset as _Tileset,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

// Create top-level object factories for constructing tile IDs.
const road = <const V>(v: V) => ({ Road: v })
const env = <const V>(v: V) => ({ Environment: v })
const end = <const V>(v: V) => ({ Endpoints: v })
const scenery = <const V>(v: V) => ({ Scenery: v })

/**
 * Global registry of tile IDs.
 *
 * WARNING: 🚫You should not recycle numeric IDs🚫 across different tilesets,
 * as this can lead to confusion and bugs when referencing tiles in the code.
 */
export const IDs = createIdRegistry({
  // 0 is reserved by Phaser as a special "empty" tile.
  1: road({ Asphalt: "STRAIGHT" }),
  2: road({ Asphalt: "TURN" }),
  3: road({ Asphalt: "T_JUNCTION" }),
  4: road({ Asphalt: "CROSSROADS" }),
  5: road({ Asphalt: "DEAD_END" }),
  6: road({ Dirt: "STRAIGHT" }),
  7: road({ Dirt: "TURN" }),
  8: road({ Dirt: "T_JUNCTION" }),
  9: road({ Dirt: "CROSSROADS" }),
  10: road({ Dirt: "DEAD_END" }),
  11: env({ Animal: "COW" }),
  12: env({ Animal: "PIGEON" }),
  13: env({ TrafficLight: "GREEN" }),
  14: env({ TrafficLight: "RED" }),
  15: end({ CFC: { Barn: "BLACK" } }),
  16: end({ CFC: { Barn: "RED" } }),
  17: end({ CFC: { Warehouse: "DEFAULT" } }),
  18: end({ CFC: { Warehouse: "SNOW" } }),
  19: end({ House: { Snow: "BLUE" } }),
  20: end({ House: { Snow: "ORANGE" } }),
  21: end({ House: { Snow: "STRAW" } }),
  22: end({ House: { Common: "BLUE" } }),
  23: end({ House: { Common: "ORANGE" } }),
  24: end({ House: { Common: "STRAW" } }),
  25: end({ House: { Common: "WOOD" } }),
  26: scenery({ Building: "HOSPITAL" }),
  27: scenery({ Building: "HOUSE" }),
  28: scenery({ Building: "SCHOOL" }),
  29: scenery({ Building: "SHOP" }),
  30: scenery({ Nature: "BUSH" }),
  31: scenery({ Nature: "CROPS" }),
  32: scenery({ Nature: "HAY" }),
  33: scenery({ Nature: "POND" }),
  34: scenery({ Nature: { Tree: "OAK" } }),
  35: scenery({ Nature: { Tree: "PINE" } }),
  36: scenery({ Other: "SOLAR_PANEL" }),
  37: scenery({ Snow: { Building: "BARN" } }),
  38: scenery({ Snow: { Building: "HOSPITAL" } }),
  39: scenery({ Snow: { Building: "SCHOOL" } }),
  40: scenery({ Snow: { Building: "SHOP" } }),
  41: scenery({ Snow: { Nature: "BUSH" } }),
  42: scenery({ Snow: { Nature: "CROPS" } }),
  43: scenery({ Snow: { Nature: "POND" } }),
  44: scenery({ Snow: { Nature: { Tree: "OAK" } } }),
  45: scenery({ Snow: { Nature: { Tree: "PINE" } } }),
  46: scenery({ Snow: { Other: "SOLAR_PANEL" } }),
} as const)
export type ID = DeepNumbersOf<typeof IDs>

export type Tileset<
  GID extends ID = ID,
  Props extends Property[] | undefined = undefined,
> = Omit<_Tileset, "firstgid" | "properties"> & {
  image: string
  firstgid: GID
  properties: Props
  imagescale?: number
}

type MakePartials =
  | "name"
  | "tilecount"
  | "columns"
  | "spacing"
  | "margin"
  | "imageheight"
  | "imagewidth"
  | "tileheight"
  | "tilewidth"
  | "properties"
export type MakeKwArgs<
  GID extends ID,
  Props extends Property[] | undefined = undefined,
> = Omit<Tileset<GID, Props>, MakePartials> &
  Partial<Pick<Tileset<GID, Props>, MakePartials>>

export const make = <
  GID extends ID,
  Props extends Property[] | undefined = undefined,
>(
  importMetaUrl: string,
  {
    image,
    name,
    tilecount = 1,
    columns = 1,
    spacing = 0,
    margin = 0,
    imageheight,
    imagewidth,
    tileheight = imageheight ?? TILE_HEIGHT,
    tilewidth = imagewidth ?? TILE_WIDTH,
    properties,
    ...tileset
  }: MakeKwArgs<GID, Props>,
): Tileset<GID, Props> => {
  image = new URL(image, importMetaUrl).href

  return {
    image,
    name: name ?? image, // Use the provided name or fallback to the image path.
    tilecount,
    columns,
    spacing,
    margin,
    imageheight,
    imagewidth,
    tileheight,
    tilewidth,
    properties: properties as Props,
    ...tileset,
  }
}
