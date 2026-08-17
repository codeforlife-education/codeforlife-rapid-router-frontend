import Phaser from "phaser"

import type * as images from "../../../images"
import * as tilemaps from "../../../tilemaps"
import BaseLevel, { type BaseLevelData } from "../../BaseLevel"
import { Events, SceneKeys } from "../../../globals"
import EndpointManager from "./EndpointManager"
import ObstacleManager from "./ObstacleManager"
import RoadManager from "./RoadManager"
import SceneryManager from "./SceneryManager"

export type Direction = "top" | "bottom" | "left" | "right"
export type DirectionSet = Set<Direction> & { readonly size: 0 | 1 | 2 | 3 | 4 }

export interface LevelData extends BaseLevelData {}

/**
 * The Level Scene is responsible for providing a user interface and tools for
 * designing and creating game levels. This scene allows developers or players
 * to place game objects, set up the environment, and define the layout of a
 * level. It typically includes features such as a grid system, object placement
 * tools, and options for saving and loading created levels. The Level Scene is
 * an essential part of the game development process, enabling the creation of
 * engaging and diverse gameplay experiences.
 */
export default class extends BaseLevel<LevelData> {
  static readonly KEY = SceneKeys.Create.LEVEL

  /** Road manager responsible for handling road tiles. */
  road!: RoadManager

  /** Endpoint manager responsible for handling endpoint objects. */
  endpoint!: EndpointManager

  /** Obstacle manager responsible for handling obstacle objects. */
  obstacle!: ObstacleManager

  /** Scenery manager responsible for handling scenery objects. */
  scenery!: SceneryManager

  /** Graphics used to render tile highlights for tools. */
  graphics!: Phaser.GameObjects.Graphics

  /** A mapping of each direction to its opposite direction. */
  readonly dirOpposites: Record<Direction, Direction> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }

  create() {
    // Create the tilemap, layers, and other essentials of the level scene.
    super.create()

    // Draw a permanent grid over the tilemap to visualize the tile boundaries.
    this.add
      .graphics()
      .grid(
        this.tilemap.width,
        this.tilemap.height,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )

    // Create a configurable graphics objects for tools to use.
    // Set the depth to 1 so it renders above the grid and tilemap layers.
    this.graphics = this.add.graphics().setDepth(1)

    // Initialize the managers.
    this.road = new RoadManager(this)
    this.endpoint = new EndpointManager(this)
    this.obstacle = new ObstacleManager(this)
    this.scenery = new SceneryManager(this)

    const onExportLevel = () =>
      this.setVariable("levelTiledJson", this.toTiledJSON())
    this.game.events.on(Events.EXPORT_LEVEL, onExportLevel)

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Events.EXPORT_LEVEL, onExportLevel)
    })
  }

  /** Exports the current editor state as a Tiled-compatible tilemap JSON. */
  toTiledJSON(): tilemaps.OrthogonalTilemap {
    return tilemaps.makeOrthogonal({
      properties: {
        background: this.getVariable<keyof typeof images.URLs.Background>(
          "background",
          "GRASS",
        ),
      },
      layers: {
        tile: { road: { data: this.road.toTiledData() } },
        objectGroup: {
          obstacles: { objects: this.obstacle.toTiledObjects() },
          endpoints: { objects: this.endpoint.toTiledObjects() },
          scenery: { objects: this.scenery.toTiledObjects() },
        },
      },
    })
  }

  /** The currently active tool selected by the player. */
  get toolbox() {
    return this.getVariable<Phaser.Types.Scenes.Create.Toolbox.Any>("toolbox")
  }

  /** Whether any manager currently has an active drag in progress. */
  get isDragging() {
    return (
      this.road.isDragging ||
      this.endpoint.isDragging ||
      this.obstacle.isDragging ||
      this.scenery.isDragging
    )
  }

  /**
   * Checks if the given tile has its own grabbable placed object (an obstacle,
   * or an endpoint's main tile) - as opposed to merely being reserved as one
   * of an endpoint's crossover tiles.
   */
  isTileGrabbable(tile: Phaser.Types.Tilemaps.Tile) {
    return this.endpoint.isMainOccupied(tile) || this.obstacle.isOccupied(tile)
  }

  /**
   * Converts world coordinates to a tile position, clamping to the nearest edge
   * tile when the cursor is outside the tilemap bounds. Returns null only if
   * the tilemap conversion itself fails.
   */
  worldToNearestTile(
    worldX: number,
    worldY: number,
  ): Phaser.Types.Tilemaps.Tile | null {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY) return null
    const col = Phaser.Math.Clamp(tileXY.x, 0, this.tilemap.width - 1)
    const row = Phaser.Math.Clamp(tileXY.y, 0, this.tilemap.height - 1)
    return { col, row }
  }

  /**
   * Returns the tile at the given world coordinates without clamping to the
   * tilemap bounds. Returns null when the cursor is outside the tilemap.
   */
  worldToTile(
    worldX: number,
    worldY: number,
  ): Phaser.Types.Tilemaps.Tile | null {
    const tileXY = this.tilemap.worldToTileXY(worldX, worldY)
    if (!tileXY || !this.tileInMap({ col: tileXY.x, row: tileXY.y }))
      return null
    return { col: Math.floor(tileXY.x), row: Math.floor(tileXY.y) }
  }

  /** Converts a tile position to world coordinates. */
  tileToWorld = ({ col, row }: Phaser.Types.Tilemaps.Tile) =>
    this.tilemap.tileToWorldXY(col, row)

  /** Returns a unique key for the given tile position. */
  tileToKey = ({ col, row }: Phaser.Types.Tilemaps.Tile) => `${row},${col}`

  /** Returns the tile position for the given key. */
  keyToTile(key: string): Phaser.Types.Tilemaps.Tile {
    const [row, col] = key.split(",").map(Number)
    return { row, col }
  }

  /** Checks if the given tile is within the bounds of the tilemap. */
  tileInMap = ({ col, row }: Phaser.Types.Tilemaps.Tile): boolean =>
    row >= 0 &&
    row < this.tilemap.height &&
    col >= 0 &&
    col < this.tilemap.width

  /**
   * Returns the dominant direction of travel from one tile to another. When the
   * cursor jumps diagonally (fast movement), the axis with the larger delta
   * wins so we always produce a single cardinal direction.
   */
  dirBetweenTiles(
    from: Phaser.Types.Tilemaps.Tile,
    to: Phaser.Types.Tilemaps.Tile,
  ): Direction {
    const dRow = to.row - from.row
    const dCol = to.col - from.col
    return Math.abs(dRow) >= Math.abs(dCol)
      ? dRow < 0
        ? "top"
        : "bottom"
      : dCol < 0
        ? "left"
        : "right"
  }

  /**
   * Returns a map of valid directions for the given tile. A direction is
   * considered valid if it does not lead outside the tilemap bounds.
   */
  validTileDirs = ({
    col,
    row,
  }: Phaser.Types.Tilemaps.Tile): Record<Direction, boolean> => ({
    left: col > 0,
    right: col < this.tilemap.width - 1,
    top: row > 0,
    bottom: row < this.tilemap.height - 1,
  })

  /**
   * Returns the tile after moving in the given directions.
   * Returns null if the resulting tile is outside the tilemap bounds.
   */
  moveFromTile(
    { col, row }: Phaser.Types.Tilemaps.Tile,
    dirs: Direction[],
  ): Phaser.Types.Tilemaps.Tile | null {
    for (const dir of dirs) {
      if (dir === "left") col--
      else if (dir === "right") col++
      else if (dir === "top") row--
      else row++ // bottom
    }

    const tile = { col, row }
    return this.tileInMap(tile) ? tile : null
  }

  /** Walk tiles from the start tile to the end tile. */
  walkBetweenTiles(
    from: Phaser.Types.Tilemaps.Tile,
    to: Phaser.Types.Tilemaps.Tile,
    processTile: (
      current: Phaser.Types.Tilemaps.Tile,
      next: Phaser.Types.Tilemaps.Tile,
    ) => void,
  ) {
    // Calculate the delta from the start tile to the end tile.
    const dRow = to.row - from.row
    const dCol = to.col - from.col

    // Diagonal movement is not allowed.
    if (dRow !== 0 && dCol !== 0) return

    // Determine the step direction for each axis: -1, 0, or +1.
    const step: Phaser.Types.Tilemaps.Tile = {
      row: dRow === 0 ? 0 : dRow > 0 ? 1 : -1,
      col: dCol === 0 ? 0 : dCol > 0 ? 1 : -1,
    }

    // Walk one tile at a time, calling the callback for each tile.
    let current = from
    while (current.row !== to.row || current.col !== to.col) {
      // Calculate the next tile along the path.
      const next: Phaser.Types.Tilemaps.Tile = {
        row: current.row + step.row,
        col: current.col + step.col,
      }

      processTile(current, next)

      current = next
    }
  }

  /** Highlights a single tile with a transparent overlay. */
  highlightTile(
    tileOrWorld: Phaser.Types.Tilemaps.Tile | Phaser.Math.Vector2,
    color: number,
    alpha = 0.4,
  ) {
    const worldXY =
      "col" in tileOrWorld ? this.tileToWorld(tileOrWorld) : tileOrWorld
    if (!worldXY) return

    this.graphics
      .fillStyle(color, alpha)
      .fillRect(
        worldXY.x,
        worldXY.y,
        this.tilemap.tileWidth,
        this.tilemap.tileHeight,
      )
  }

  /** Converts a tile position to a bounding box in world coordinates. */
  tileToBounds(tile: Phaser.Types.Tilemaps.Tile): Phaser.Geom.Rectangle | null {
    const world = this.tileToWorld(tile)
    if (!world) return null

    return new Phaser.Geom.Rectangle(
      world.x,
      world.y,
      this.tilemap.tileWidth,
      this.tilemap.tileHeight,
    )
  }

  /** Checks if a given box overlaps with a tile. */
  objectOverlapsTile(
    obj: Phaser.GameObjects.Components.GetBounds | Phaser.Geom.Rectangle,
    tile: Phaser.Types.Tilemaps.Tile | Phaser.Geom.Rectangle,
  ) {
    if ("col" in tile) {
      const bounds = this.tileToBounds(tile)
      if (!bounds) return false
      tile = bounds
    }

    return Phaser.Geom.Rectangle.Overlaps(
      "getBounds" in obj ? obj.getBounds() : obj,
      tile,
    )
  }
}
