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
  11: env({ City: "HOSPITAL" }),
  12: env({ City: "SCHOOL" }),
  13: env({ City: "SHOP" }),
  14: env({ City: "SOLAR_PANEL" }),
  15: env({ Farm: "CROPS" }),
  16: env({ Farm: "SOLAR_PANEL" }),
  17: env({ Grass: "SOLAR_PANEL" }),
  18: env({ Snow: "BARN" }),
  19: env({ Snow: "CROPS" }),
  20: env({ Snow: "HOSPITAL" }),
  21: env({ Snow: "SCHOOL" }),
  22: env({ Snow: "SHOP" }),
  23: env({ Snow: "SOLAR_PANEL" }),
  24: env({ Common: { TrafficLight: "GREEN" } }),
  25: env({ Common: { TrafficLight: "RED" } }),
  26: env({ Common: "PIGEON" }),
  27: env({ Common: "COW" }),
  28: end({ CFC: { Barn: "BLACK" } }),
  29: end({ CFC: { Barn: "RED" } }),
  30: end({ CFC: { Warehouse: "DEFAULT" } }),
  31: end({ CFC: { Warehouse: "SNOW" } }),
  32: end({ House: { Snow: "BLUE" } }),
  33: end({ House: { Snow: "ORANGE" } }),
  34: end({ House: { Snow: "STRAW" } }),
  35: end({ House: { Common: "BLUE" } }),
  36: end({ House: { Common: "ORANGE" } }),
  37: end({ House: { Common: "STRAW" } }),
  38: end({ House: { Common: "WOOD" } }),
  39: scenery({ Snow: "BUSH" }),
  40: scenery({ Snow: "POND" }),
  41: scenery({ Snow: "TREE1" }),
  42: scenery({ Snow: "TREE2" }),
  43: scenery({ Common: "BUSH" }),
  44: scenery({ Common: "HAY" }),
  45: scenery({ Common: "POND" }),
  46: scenery({ Common: "TREE1" }),
  47: scenery({ Common: "TREE2" }),
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
    tileheight = TILE_HEIGHT,
    tilewidth = TILE_WIDTH,
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
    tileheight,
    tilewidth,
    properties: properties as Props,
    ...tileset,
  }
}
