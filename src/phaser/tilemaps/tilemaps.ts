import type { TiledMapOrthogonal as _OrthogonalTilemap } from "tiled-types"

import type * as images from "../images"
import * as layers from "../layers"
import * as tilesets from "../tilesets"
import { COLS, ROWS, TILE_HEIGHT, TILE_WIDTH } from "../globals"

type MakeTileLayerKwArgs<
  N extends layers.tile.Name,
  ID extends layers.tile.data.ID,
  COLS extends number,
  ROWS extends number,
> = Omit<layers.tile.MakeKwArgs<N, ID, NoInfer<COLS>, NoInfer<ROWS>>, "name">

type MakeObjectGroupLayerKwArgs<
  OGN extends layers.objectGroup.Name,
  ON extends layers.objectGroup.objects.Name,
  OID extends layers.objectGroup.objects.ID,
> = Omit<
  layers.objectGroup.MakeKwArgs<
    OGN,
    ON,
    OID,
    layers.objectGroup.objects.FactoryObject<ON, OID>
  >,
  "name"
>

export type OrthogonalTilemap = Omit<
  _OrthogonalTilemap,
  "layers" | "tilesets" | "properties"
> & {
  layers: [
    layers.tile.Layer<"Tile.ROAD", layers.tile.data.RoadID>,
    layers.objectGroup.Layer<
      "ObjectGroup.OBSTACLES",
      layers.objectGroup.objects.obstacles.Name,
      tilesets.obstacles.ID
    >,
    layers.objectGroup.Layer<
      "ObjectGroup.ENDPOINTS",
      layers.objectGroup.objects.endpoints.Name,
      tilesets.endpoints.ID
    >,
    layers.objectGroup.Layer<
      "ObjectGroup.SCENERY",
      layers.objectGroup.objects.scenery.Name,
      tilesets.scenery.ID
    >,
  ]
  tilesets: tilesets.Tileset<tilesets.ID, any>[]
  properties: [
    {
      name: "background"
      type: "string"
      value: keyof typeof images.URLs.Background
    },
    {
      name: "character"
      type: "string"
      value: keyof typeof images.URLs.Character.Normal
    },
  ]
}

type MakeOrthogonalPartials =
  | "renderorder"
  | "version"
  | "nextobjectid"
  | "tilewidth"
  | "tileheight"
  | "tilesets"
export type MakeOrthogonalKwArgs<
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Omit<
  OrthogonalTilemap,
  | MakeOrthogonalPartials
  | "orientation"
  | "layers"
  | "width"
  | "height"
  | "properties"
> &
  Partial<Pick<OrthogonalTilemap, MakeOrthogonalPartials>> & {
    width?: COLS
    height?: ROWS
    properties: {
      background: keyof typeof images.URLs.Background
      character: keyof typeof images.URLs.Character.Normal
    }
    layers: {
      tile: {
        road: MakeTileLayerKwArgs<
          "Tile.ROAD",
          layers.tile.data.RoadID,
          NoInfer<COLS>,
          NoInfer<ROWS>
        >
      }
      objectGroup: {
        endpoints: MakeObjectGroupLayerKwArgs<
          "ObjectGroup.ENDPOINTS",
          layers.objectGroup.objects.endpoints.Name,
          tilesets.endpoints.ID
        >
        obstacles?: MakeObjectGroupLayerKwArgs<
          "ObjectGroup.OBSTACLES",
          layers.objectGroup.objects.obstacles.Name,
          tilesets.obstacles.ID
        >
        scenery?: MakeObjectGroupLayerKwArgs<
          "ObjectGroup.SCENERY",
          layers.objectGroup.objects.scenery.Name,
          tilesets.scenery.ID
        >
      }
    }
  }

export const makeOrthogonal = <
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
>({
  renderorder = "right-down",
  version = 1,
  nextobjectid = 0,
  width: mapWidth = COLS as COLS,
  height: mapHeight = ROWS as ROWS,
  tilewidth: mapTileWidth = TILE_WIDTH,
  tileheight: mapTileHeight = TILE_HEIGHT,
  properties,
  tilesets: _tilesets,
  layers: _layers,
  ...tilemap
}: MakeOrthogonalKwArgs<COLS, ROWS>): OrthogonalTilemap => {
  // Auto-derive the tilesets in use from the layer data when not explicitly
  // provided. Tile IDs are bit-encoded with flip/rotation flags, so they must
  // be decoded to recover the underlying tileset ID; object GIDs are already
  // tileset IDs.
  _tilesets ??= Array.from(
    new Set<tilesets.ID>([
      ...[_layers.tile.road.data]
        .map(data => data.flat())
        .flat()
        .map(id => layers.tile.data.decode(id).index)
        .filter(id => id !== layers.tile.data.IDs.EMPTY),
      ...[
        _layers.objectGroup.endpoints,
        _layers.objectGroup.obstacles,
        _layers.objectGroup.scenery,
      ].flatMap(group => group?.objects.map(obj => obj.gid) ?? []),
    ]),
  )
    .map(tilesets.getTileset)
    .filter(tileset => tileset !== undefined)

  const tilesetsById = _tilesets.reduce(
    (acc, tileset) => ({ ...acc, [tileset.firstgid]: tileset }),
    {} as Partial<Record<tilesets.ID, tilesets.Tileset>>,
  )

  const makeTileLayer = <
    Name extends layers.tile.Name,
    ID extends layers.tile.data.ID,
  >(
    name: Name,
    {
      // Provide default values for width and height based on the tilemap.
      width = mapWidth,
      height = mapHeight,
      ...layer
    }: MakeTileLayerKwArgs<Name, ID, NoInfer<COLS>, NoInfer<ROWS>> = {
      data: layers.tile.data.fillManyRows({
        rows: mapHeight,
        cols: mapWidth,
      }) as (ID[] & { length: COLS })[] & { length: ROWS },
    },
  ) => layers.tile.make({ name, width, height, ...layer })

  let objectIdCounter = 1
  const makeObjectGroupLayer = <
    OGN extends layers.objectGroup.Name,
    ON extends layers.objectGroup.objects.Name,
    OID extends layers.objectGroup.objects.ID,
  >(
    name: OGN,
    {
      // Provide default values for width and height based on the tilemap.
      width = mapWidth,
      height = mapHeight,
      objects: _objects,
      ...layer
    }: MakeObjectGroupLayerKwArgs<OGN, ON, OID> = { objects: [] },
  ) =>
    layers.objectGroup.make({
      name,
      width,
      height,
      objects: _objects.map(obj => ({
        id: objectIdCounter++,
        width: tilesetsById[obj.gid]?.imagewidth ?? mapTileWidth,
        height: tilesetsById[obj.gid]?.imageheight ?? mapTileHeight,
        ...obj,
      })),
      ...layer,
    })

  return {
    orientation: "orthogonal",
    renderorder,
    version,
    nextobjectid,
    width: mapWidth,
    height: mapHeight,
    tilewidth: mapTileWidth,
    tileheight: mapTileHeight,
    properties: [
      { name: "background", type: "string", value: properties.background },
      { name: "character", type: "string", value: properties.character },
    ],
    tilesets: _tilesets.map(
      ({
        // Provide default values for width and height based on the tilemap.
        imagewidth = mapTileWidth,
        imageheight = mapTileHeight,
        tilewidth = mapTileWidth,
        tileheight = mapTileHeight,
        ...tileset
      }) => ({
        imagewidth,
        imageheight,
        tilewidth,
        tileheight,
        ...tileset,
      }),
    ),
    layers: [
      makeTileLayer(layers.Names.Tile.ROAD, _layers.tile.road),
      makeObjectGroupLayer(
        layers.Names.ObjectGroup.OBSTACLES,
        _layers.objectGroup.obstacles,
      ),
      makeObjectGroupLayer(
        layers.Names.ObjectGroup.ENDPOINTS,
        _layers.objectGroup.endpoints,
      ),
      makeObjectGroupLayer(
        layers.Names.ObjectGroup.SCENERY,
        _layers.objectGroup.scenery,
      ),
    ],
    ...tilemap,
  }
}

/** The minimal data needed to recreate a tile-anchored object. */
export type ExportedRoadObject<GID extends layers.objectGroup.objects.ID> = {
  gid: GID
  properties: [
    { name: "variant"; type: "string"; value: string },
    { name: "tileRow"; type: "int"; value: number },
    { name: "tileCol"; type: "int"; value: number },
  ]
}
/** The minimal data needed to recreate a free (non-tile-anchored) object. */
export type ExportedFreeObject<GID extends layers.objectGroup.objects.ID> = {
  gid: GID
  x: number
  y: number
  width: number
  height: number
  rotation: number
}
/** The minimal data needed to recreate an orthogonal tilemap - everything
 * else (dimensions, tilesets, render order, etc.) is fixed/derivable, so
 * `importOrthogonal` can fall back to `makeOrthogonal`'s own defaults. */
export type ExportedOrthogonalTilemap<
  COLS extends number = typeof COLS,
  ROWS extends number = typeof ROWS,
> = Pick<OrthogonalTilemap, "properties"> & {
  layers: [
    Pick<MakeOrthogonalKwArgs<COLS, ROWS>["layers"]["tile"]["road"], "data">,
    Pick<
      layers.objectGroup.Layer<
        "ObjectGroup.OBSTACLES",
        layers.objectGroup.objects.obstacles.Name,
        tilesets.obstacles.ID,
        ExportedRoadObject<tilesets.obstacles.ID>
      >,
      "objects"
    >,
    Pick<
      layers.objectGroup.Layer<
        "ObjectGroup.ENDPOINTS",
        layers.objectGroup.objects.endpoints.Name,
        tilesets.endpoints.ID,
        ExportedRoadObject<tilesets.endpoints.ID>
      >,
      "objects"
    >,
    Pick<
      layers.objectGroup.Layer<
        "ObjectGroup.SCENERY",
        layers.objectGroup.objects.scenery.Name,
        tilesets.scenery.ID,
        ExportedFreeObject<tilesets.scenery.ID>
      >,
      "objects"
    >,
  ]
}

/**
 * Reconstructs a full, spec-shaped Tiled tilemap from a previously-exported
 * minimal one (see `ExportedOrthogonalTilemap`) - re-deriving each object's
 * full position/rotation/name/etc. from its gid/variant/tile via the same
 * factories used to create it in the first place, so it can be loaded
 * directly by Phaser's native tilemap/object-layer renderer (e.g. play mode).
 */
export const importOrthogonal = ({
  properties: [{ value: background }, { value: character }],
  layers: [roadLayer, obstaclesLayer, endpointsLayer, sceneryLayer],
}: ExportedOrthogonalTilemap): OrthogonalTilemap => {
  // Reconstructs a full road object from its minimal exported data.
  const importRoadObject = <
    N extends layers.objectGroup.objects.Name,
    GID extends layers.objectGroup.objects.ID,
  >({
    gid,
    properties: [{ value: variantKey }, { value: row }, { value: col }],
  }: ExportedRoadObject<GID>) => {
    const factory = layers.objectGroup.objects.getFactory<N, GID, string>(gid)!
    return factory[variantKey]({ row, col })
  }

  // Reconstructs a full free object from its minimal exported data.
  const importFreeObject = <
    N extends layers.objectGroup.objects.Name,
    GID extends layers.objectGroup.objects.ID,
  >({
    gid,
    x,
    y,
    rotation,
  }: ExportedFreeObject<GID>) => {
    const factory = layers.objectGroup.objects.getFactory<N, GID, string>(gid)!
    // The factory's own x/y is ignored (see `BaseFreeObjectManager`), since
    // only the position we already recovered from the export is accurate.
    return { ...factory({}), x, y, rotation }
  }

  return makeOrthogonal({
    properties: { background, character },
    layers: {
      tile: { road: { data: roadLayer.data } },
      objectGroup: {
        obstacles: {
          objects: obstaclesLayer.objects.map(
            importRoadObject<
              layers.objectGroup.objects.obstacles.Name,
              tilesets.obstacles.ID
            >,
          ),
        },
        endpoints: {
          objects: endpointsLayer.objects.map(
            importRoadObject<
              layers.objectGroup.objects.endpoints.Name,
              tilesets.endpoints.ID
            >,
          ),
        },
        scenery: {
          objects: sceneryLayer.objects.map(
            importFreeObject<
              layers.objectGroup.objects.scenery.Name,
              tilesets.scenery.ID
            >,
          ),
        },
      },
    },
  })
}
