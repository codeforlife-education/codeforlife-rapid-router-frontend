import * as tilesets from "../phaser/tilesets"
import {
  type Direction,
  STEP_BY_DIRECTION,
  turnAround,
  turnLeft,
  turnRight,
} from "../phaser/tilemaps/navigation"
import type { GameCommand } from "../app/slices"
import type { OrthogonalTilemap } from "../phaser/tilemaps"

/** Hard cap on emitted commands, so a script with an infinite loop (e.g. a
 * `while True: move_forwards()` on a closed road loop) can't hang forever. */
export const MAX_GAME_COMMANDS = 1000

export class TooManyGameCommandsError extends Error {
  constructor() {
    super(
      `Your program ran for too long (over ${MAX_GAME_COMMANDS} commands). ` +
        "Check for an infinite loop.",
    )
    this.name = "TooManyGameCommandsError"
  }
}

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

  /** `false` for any tile off the road, including off the edge of the map. */
  private hasRoad(tile: Tile): boolean {
    if (
      tile.row < 0 ||
      tile.row >= this.roadHeight ||
      tile.col < 0 ||
      tile.col >= this.roadWidth
    )
      return false
    return this.roadData[tile.row * this.roadWidth + tile.col] !== 0
  }

  private pushCommand(command: GameCommand, line?: number) {
    this.commands.push(command)
    this.commandLines.push(line ?? 0)
    if (this.commands.length > MAX_GAME_COMMANDS)
      throw new TooManyGameCommandsError()
  }

  private turnTo(
    command: GameCommand,
    newHeading: (dir: Direction) => Direction,
    line?: number,
  ) {
    this.pushCommand(command, line)
    this.tile = this.moveFromTile(this.tile, this.heading)
    this.heading = newHeading(this.heading)
  }

  // Commands - exposed to Python as the game-command functions. Each takes
  // the calling line number (see `VAN_MODULE_PREAMBLE` in pyodide.worker.ts)
  // so the editor can highlight the line currently being animated.
  moveForwards = (line?: number) => {
    this.pushCommand("move_forwards", line)
    this.tile = this.moveFromTile(this.tile, this.heading)
  }
  turnLeft = (line?: number) => this.turnTo("turn_left", turnLeft, line)
  turnRight = (line?: number) => this.turnTo("turn_right", turnRight, line)
  turnAround = (line?: number) => this.turnTo("turn_around", turnAround, line)
  wait = (line?: number) => this.pushCommand("wait", line)
  deliver = (line?: number) => this.pushCommand("deliver", line)
  soundHorn = (line?: number) => this.pushCommand("sound_horn", line)

  // Sensing - exposed to Python as boolean-returning functions.
  roadExists = (direction: RelativeDirection): boolean => {
    const absoluteDirection =
      direction === "forward"
        ? this.heading
        : direction === "left"
          ? turnLeft(this.heading)
          : turnRight(this.heading)
    return this.hasRoad(this.moveFromTile(this.tile, absoluteDirection))
  }
  isRoad = (direction: "FORWARD" | "LEFT" | "RIGHT"): boolean =>
    this.roadExists(direction.toLowerCase() as RelativeDirection)
  isRoadForward = (): boolean => this.roadExists("forward")
  isRoadLeft = (): boolean => this.roadExists("left")
  isRoadRight = (): boolean => this.roadExists("right")
  atDeadEnd = (): boolean =>
    (["forward", "left", "right"] as const).every(d => !this.roadExists(d))
  atDestination = (): boolean =>
    this.destinationTiles.some(t => this.tileEquals(t, this.tile))
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
