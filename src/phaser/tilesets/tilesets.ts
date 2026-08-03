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
  17: end({ CFC: { Barn: "SNOW" } }),
  18: end({ CFC: { Warehouse: "DEFAULT" } }),
  19: end({ CFC: { Warehouse: "SNOW" } }),
  20: end({ House: { Snow: "BLUE" } }),
  21: end({ House: { Snow: "ORANGE" } }),
  22: end({ House: { Snow: "STRAW" } }),
  23: end({ House: { Common: "BLUE" } }),
  24: end({ House: { Common: "ORANGE" } }),
  25: end({ House: { Common: "STRAW" } }),
  26: scenery({ Building: "HOSPITAL" }),
  27: scenery({ Building: "HOUSE" }),
  28: scenery({ Building: "LOG_CABIN" }),
  29: scenery({ Building: "SCHOOL" }),
  30: scenery({ Building: "SHOP" }),
  31: scenery({ Building: { Snow: "HOSPITAL" } }),
  32: scenery({ Building: { Snow: "SCHOOL" } }),
  33: scenery({ Building: { Snow: "SHOP" } }),
  34: scenery({ Nature: "BUSH" }),
  35: scenery({ Nature: "CROPS" }),
  36: scenery({ Nature: "HAY" }),
  37: scenery({ Nature: "POND" }),
  38: scenery({ Nature: { Tree: "OAK" } }),
  39: scenery({ Nature: { Tree: "PINE" } }),
  40: scenery({ Nature: { Snow: "BUSH" } }),
  41: scenery({ Nature: { Snow: "CROPS" } }),
  42: scenery({ Nature: { Snow: "POND" } }),
  43: scenery({ Nature: { Snow: { Tree: "OAK" } } }),
  44: scenery({ Nature: { Snow: { Tree: "PINE" } } }),
  45: scenery({ Other: "SOLAR_PANEL" }),
  46: scenery({ Other: { Snow: "SOLAR_PANEL" } }),
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
