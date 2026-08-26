import type { TiledLayerTilelayer as _Layer } from "tiled-types"

import type * as data from "./data"
import * as layers from "../layers"
import type { COLS, ROWS } from "../../globals"

export const Names = Object.values(layers.Names.Tile)
export type Name = (typeof Names)[number]
export type Layer<N extends Name = Name, ID extends data.ID = data.ID> = Omit<
  _Layer,
  "name" | "id"
> & { name: N; data: ID[] }

export type MakeKwArgs<
  N extends Name,
  ID extends data.ID = data.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<layers.MakeKwArgs<N, "tilelayer">, "type"> &
  Omit<Layer<N, ID>, keyof layers.MakeKwArgs<N, "tilelayer"> | "data"> & {
    data: data.Data<ID, COLS, ROWS>
  }

export const make = <
  N extends Name,
  ID extends data.ID = data.ID,
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  name,
  data,
}: MakeKwArgs<N, ID, COLS, ROWS>): Layer<N, ID> => ({
  ...layers.make({ name, type: "tilelayer" }),
  data: data.flat(),
})
