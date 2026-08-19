import { type DeepNumbersOf, createIdRegistry } from "codeforlife/utils/object"
import type {
  TiledProperty as Property,
  TiledTileset as _Tileset,
} from "tiled-types"

import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

// Create top-level object factories for constructing tile IDs.
const road = <const V>(v: V) => ({ Road: v })
road.asphalt = <const V>(v: V) => road({ Asphalt: v })
road.dirt = <const V>(v: V) => road({ Dirt: v })

const obstacles = <const V>(v: V) => ({ Obstacles: v })
obstacles.animal = <const V>(v: V) => obstacles({ Animal: v })
obstacles.trafficLight = <const V>(v: V) => obstacles({ TrafficLight: v })

const endpoints = <const V>(v: V) => ({ Endpoints: v })
endpoints.cfc = <const V>(v: V) => endpoints({ CFC: v })
endpoints.house = <const V>(v: V) => endpoints({ House: v })

const scenery = <const V>(v: V) => ({ Scenery: v })
scenery.building = <const V>(v: V) => scenery({ Building: v })
scenery.nature = <const V>(v: V) => scenery({ Nature: v })
scenery.other = <const V>(v: V) => scenery({ Other: v })

/**
 * Global registry of tile IDs.
 *
 * WARNING: 🚫You should not recycle numeric IDs🚫 across different tilesets,
 * as this can lead to confusion and bugs when referencing tiles in the code.
 */
export const IDs = createIdRegistry({
  // 0 is reserved by Phaser as a special "empty" tile.
  1: road.asphalt("STRAIGHT"),
  2: road.asphalt("TURN"),
  3: road.asphalt("T_JUNCTION"),
  4: road.asphalt("CROSSROADS"),
  5: road.asphalt("DEAD_END"),
  6: road.dirt("STRAIGHT"),
  7: road.dirt("TURN"),
  8: road.dirt("T_JUNCTION"),
  9: road.dirt("CROSSROADS"),
  10: road.dirt("DEAD_END"),
  11: obstacles.animal("COW"),
  12: obstacles.animal("PIGEON"),
  13: obstacles.trafficLight("GREEN"),
  14: obstacles.trafficLight("RED"),
  15: endpoints.cfc({ Barn: "BLACK" }),
  16: endpoints.cfc({ Barn: "RED" }),
  17: endpoints.cfc({ Barn: "SNOW" }),
  18: endpoints.cfc({ Warehouse: "DEFAULT" }),
  19: endpoints.cfc({ Warehouse: "SNOW" }),
  20: endpoints.house({ Snow: "BLUE" }),
  21: endpoints.house({ Snow: "ORANGE" }),
  22: endpoints.house({ Snow: "STRAW" }),
  23: endpoints.house({ Common: "BLUE" }),
  24: endpoints.house({ Common: "ORANGE" }),
  25: endpoints.house({ Common: "STRAW" }),
  26: scenery.building("HOSPITAL"),
  27: scenery.building("HOUSE"),
  28: scenery.building("LOG_CABIN"),
  29: scenery.building("SCHOOL"),
  30: scenery.building("SHOP"),
  31: scenery.building({ Snow: "HOSPITAL" }),
  32: scenery.building({ Snow: "SCHOOL" }),
  33: scenery.building({ Snow: "SHOP" }),
  34: scenery.nature("BUSH"),
  35: scenery.nature("CROPS"),
  36: scenery.nature("HAY"),
  37: scenery.nature("POND"),
  38: scenery.nature({ Tree: "OAK" }),
  39: scenery.nature({ Tree: "PINE" }),
  40: scenery.nature({ Snow: "BUSH" }),
  41: scenery.nature({ Snow: "CROPS" }),
  42: scenery.nature({ Snow: "POND" }),
  43: scenery.nature({ Snow: { Tree: "OAK" } }),
  44: scenery.nature({ Snow: { Tree: "PINE" } }),
  45: scenery.other("SOLAR_PANEL"),
  46: scenery.other({ Snow: "SOLAR_PANEL" }),
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

// Global registry of tilesets, keyed by their GID, and a getter.
const TILESETS: Partial<Record<ID, Tileset<ID, Property[] | undefined>>> = {}
export const getTileset = (id: ID) => TILESETS[id]

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
    firstgid,
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
    ...kwArgs
  }: MakeKwArgs<GID, Props>,
): Tileset<GID, Props> => {
  image = new URL(image, importMetaUrl).href

  const tileset: Tileset<GID, Props> = {
    firstgid,
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
    ...kwArgs,
  }

  TILESETS[firstgid] = tileset
  return tileset
}
