import * as tilesets from "../phaser/tilesets"
import {
  type Direction,
  STEP_BY_DIRECTION,
  turnAround,
  turnLeft,
  turnRight,
} from "../phaser/tilemaps/navigation"
import { type RoadID, decode } from "../phaser/layers/tile/data"
import type { GameCommand } from "../app/slices"
import type { OrthogonalTilemap } from "../phaser/tilemaps"
import { roadOpenSides } from "../phaser/tilemaps/roadConnectivity"

export type RelativeDirection = "forward" | "left" | "right"
export type TrafficLightColour = "RED" | "GREEN"

type Tile = { row: number; col: number }

const CFC_IDS: readonly number[] = tilesets.endpoints.cfc.IDs
const HOUSE_IDS: readonly number[] = tilesets.endpoints.house.IDs
const COW_ID: number = tilesets.IDs.Obstacles.Animal.COW
const PIGEON_ID: number = tilesets.IDs.Obstacles.Animal.PIGEON
const RED_TRAFFIC_LIGHT_ID: number = tilesets.IDs.Obstacles.TrafficLight.RED
const GREEN_TRAFFIC_LIGHT_ID: number = tilesets.IDs.Obstacles.TrafficLight.GREEN

/** Finds a level object's tile/facing from its `tileRow`/`tileCol`/`variant` properties. */
function readObjectTile(properties: unknown): {
  tile: Tile
  heading: Direction
} {
  const props = properties as { name: string; value: unknown }[]
  const property = (name: string) => props.find(p => p.name === name)?.value
  return {
    tile: {
      row: property("tileRow") as number,
      col: property("tileCol") as number,
    },
    heading: property("variant") as Direction,
  }
}

/**
 * A headless, Phaser-free stand-in for the play-mode van, used to resolve a
 * Python script's sensing calls (`is_road`/`at_dead_end`/`at_destination`/
 * `at_traffic_light`/`is_animal_crossing`) against a level's static tile
 * data. Mirrors the position/heading rules in `CharacterManager`, but runs
 * the whole script upfront (no animation) and collects the resulting flat
 * `GameCommand[]` list.
 */
export default class LevelSimulator {
  private readonly roadData: readonly number[]
  private readonly roadWidth: number
  private readonly roadHeight: number
  private readonly destinationTiles: Tile[]
  private tile: Tile
  private heading: Direction
  private readonly trafficLightTiles: {
    tile: Tile
    colour: TrafficLightColour
  }[]
  private readonly animalTiles: Tile[]
  readonly commands: GameCommand[] = []
  /** The Python source line (1-indexed) that produced each entry in `commands`. */
  readonly commandLines: number[] = []
  /** The originating Blockly block ID for each entry in `commands`, when the
   * script was compiled from a Blockly workspace (`null` for hand-typed
   * Python, or any command not preceded by a `_highlight_block` call). */
  readonly commandBlocks: (string | null)[] = []
  /** True for entries the line tracer synthesised purely so the editor can
   * highlight a loop/if header or sensing-only line - not a real command the
   * player issued (see `syntheticWait`). These must never cost fuel. */
  readonly commandSynthetic: boolean[] = []

  constructor(tilemap: OrthogonalTilemap) {
    const roadLayer = tilemap.layers[0]
    this.roadData = roadLayer.data
    this.roadWidth = roadLayer.width
    this.roadHeight = roadLayer.height

    const objects = tilemap.layers[2].objects
    const start = objects.find(
      o => o.gid !== undefined && CFC_IDS.includes(o.gid),
    )
    if (!start) throw new Error("Level has no CFC start endpoint")
    const { tile, heading } = readObjectTile(start.properties)
    this.tile = tile
    this.heading = heading

    this.destinationTiles = objects
      .filter(o => o.gid !== undefined && HOUSE_IDS.includes(o.gid))
      .map(o => readObjectTile(o.properties).tile)

    this.trafficLightTiles = objects
      .filter(
        o => o.gid === RED_TRAFFIC_LIGHT_ID || o.gid === GREEN_TRAFFIC_LIGHT_ID,
      )
      .map(o => ({
        tile: readObjectTile(o.properties).tile,
        colour: (o.gid === RED_TRAFFIC_LIGHT_ID
          ? "RED"
          : "GREEN") as TrafficLightColour,
      }))

    this.animalTiles = objects
      .filter(o => o.gid === COW_ID || o.gid === PIGEON_ID)
      .map(o => readObjectTile(o.properties).tile)
  }

  private tileEquals(a: Tile, b: Tile): boolean {
    return a.row === b.row && a.col === b.col
  }

  private moveFromTile(tile: Tile, dir: Direction): Tile {
    const step = STEP_BY_DIRECTION[dir]
    return { row: tile.row + step.row, col: tile.col + step.col }
  }

  /** The compass directions the tile at `tile` actually opens onto, or
   * `undefined` if it isn't a road tile at all (including off the map). */
  private openSides(tile: Tile): Set<Direction> | undefined {
    if (
      tile.row < 0 ||
      tile.row >= this.roadHeight ||
      tile.col < 0 ||
      tile.col >= this.roadWidth
    )
      return undefined
    const rawId = this.roadData[tile.row * this.roadWidth + tile.col]
    if (rawId === 0) return undefined
    const { index, rotation } = decode(rawId as RoadID)
    return roadOpenSides(index, rotation)
  }

  /** True only if `fromTile` opens onto `dir` AND the neighbouring tile in
   * `dir` opens back onto `fromTile` - a tile merely being road isn't
   * enough, since e.g. a dead end or turn tile only connects 1-2 sides. */
  private roadConnects(fromTile: Tile, dir: Direction): boolean {
    if (!this.openSides(fromTile)?.has(dir)) return false
    const toTile = this.moveFromTile(fromTile, dir)
    return this.openSides(toTile)?.has(turnAround(dir)) ?? false
  }

  /** Records a command against `this.commands`/`commandLines`/`commandBlocks`/
   * `commandSynthetic`. */
  private pushCommand(
    command: GameCommand,
    line?: number,
    blockId?: string,
    synthetic = false,
  ) {
    this.commands.push(command)
    this.commandLines.push(line ?? 0)
    this.commandBlocks.push(blockId ?? null)
    this.commandSynthetic.push(synthetic)
  }

  private turnTo(
    command: GameCommand,
    newHeading: (dir: Direction) => Direction,
    line?: number,
    blockId?: string,
  ) {
    this.pushCommand(command, line, blockId)
    this.tile = this.moveFromTile(this.tile, this.heading)
    this.heading = newHeading(this.heading)
  }

  // Commands - exposed to Python as the game-command functions. Each takes
  // the calling line number (see `VAN_MODULE_PREAMBLE` in pyodide.worker.ts)
  // so the editor can highlight the line currently being animated, plus the
  // originating Blockly block ID (if the script was compiled from blocks).
  moveForwards = (line?: number, blockId?: string) => {
    this.pushCommand("move_forwards", line, blockId)
    this.tile = this.moveFromTile(this.tile, this.heading)
  }
  turnLeft = (line?: number, blockId?: string) =>
    this.turnTo("turn_left", turnLeft, line, blockId)
  turnRight = (line?: number, blockId?: string) =>
    this.turnTo("turn_right", turnRight, line, blockId)
  turnAround = (line?: number, blockId?: string) =>
    this.turnTo("turn_around", turnAround, line, blockId)
  wait = (line?: number, blockId?: string) =>
    this.pushCommand("wait", line, blockId)
  /** Same as `wait`, but flagged as synthetic - injected by the line tracer
   * purely so the editor can highlight a loop/if header or sensing-only
   * line, not a real command the player issued. Must not cost fuel. */
  syntheticWait = (line?: number, blockId?: string) =>
    this.pushCommand("wait", line, blockId, true)
  deliver = (line?: number, blockId?: string) =>
    this.pushCommand("deliver", line, blockId)
  soundHorn = (line?: number, blockId?: string) =>
    this.pushCommand("sound_horn", line, blockId)

  // Sensing - exposed to Python as boolean-returning functions.
  // Mirrors `CharacterManager.isValidState`: a move/turn is only actually
  // safe if BOTH tiles it would leave the van straddling are road AND
  // actually connected to each other - the immediate next tile (reached by
  // moving forward in the CURRENT heading, same for every command) and the
  // tile beyond that in the RESULTING heading (unchanged for a plain move,
  // turned for a turn). Checking only tile presence is wrong on two counts:
  // at a turn junction, the immediate tile is itself a valid (turning) road
  // tile, so "is there a road forward" must also confirm the road actually
  // continues straight past it; and a tile like a dead end or turn only
  // opens onto 1-2 of its 4 sides, so it must not be treated as connected
  // on a side it doesn't actually open onto.
  roadExists = (direction: RelativeDirection): boolean => {
    if (!this.roadConnects(this.tile, this.heading)) return false
    const nextTile = this.moveFromTile(this.tile, this.heading)
    const resultingHeading =
      direction === "forward"
        ? this.heading
        : direction === "left"
          ? turnLeft(this.heading)
          : turnRight(this.heading)
    return this.roadConnects(nextTile, resultingHeading)
  }
  isRoad = (direction: "FORWARD" | "LEFT" | "RIGHT"): boolean =>
    this.roadExists(direction.toLowerCase() as RelativeDirection)
  isRoadForward = (): boolean => this.roadExists("forward")
  isRoadLeft = (): boolean => this.roadExists("left")
  isRoadRight = (): boolean => this.roadExists("right")
  atDeadEnd = (): boolean =>
    (["forward", "left", "right"] as const).every(d => !this.roadExists(d))
  // The van straddles the boundary between `this.tile` (back half) and
  // `moveFromTile(this.tile, heading)` (front half) - it "arrives" once its
  // front half reaches the destination tile, matching the real van sprite's
  // position (see `CharacterManager`'s `boundaryPoint`).
  atDestination = (): boolean => {
    const aheadTile = this.moveFromTile(this.tile, this.heading)
    return this.destinationTiles.some(t => this.tileEquals(t, aheadTile))
  }
  // Obstacles are checked one tile ahead (in the van's current heading),
  // never on the van's own tile - the game's rules forbid the van ever
  // sharing a tile with a traffic light or animal.
  atTrafficLight = (colour: TrafficLightColour): boolean => {
    const aheadTile = this.moveFromTile(this.tile, this.heading)
    return this.trafficLightTiles.some(
      t => t.colour === colour && this.tileEquals(t.tile, aheadTile),
    )
  }
  atRedTrafficLight = (): boolean => this.atTrafficLight("RED")
  atGreenTrafficLight = (): boolean => this.atTrafficLight("GREEN")
  isAnimalCrossing = (): boolean => {
    const aheadTile = this.moveFromTile(this.tile, this.heading)
    return this.animalTiles.some(t => this.tileEquals(t, aheadTile))
  }
}
