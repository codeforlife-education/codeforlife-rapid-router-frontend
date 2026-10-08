import type Phaser from "phaser"

import * as tilesets from "./tilesets"
import {
  type Direction,
  turnAround,
  turnLeft,
  turnRight,
} from "./tilegrid/navigation"
import type { GameCommand, GameState } from "../app/slices"
import { type RoadID, decode } from "./layers/tile/data"
import type { OrthogonalTilemap } from "./tilemaps"
import { createRoadNavigator } from "./tilegrid/road"

export type RelativeDirection = "forward" | "left" | "right"
export type TrafficLightColour = "RED" | "GREEN"

type Tile = Phaser.Types.Tilemaps.Tile
type CommandOptions = Pick<
  GameState["gameCommands"][number],
  "blockId" | "lineNo"
>

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
 * A headless, Phaser-free stand-in for the play-mode van. Mirrors the
 * position/heading rules in `CharacterManager`, but runs the whole script
 * upfront (no animation) and collects the resulting flat `GameCommand[]` list.
 */
export default class LevelSimulator {
  private readonly roadData: readonly number[]
  private readonly roadWidth: number
  private readonly roadHeight: number
  private readonly navigator: ReturnType<typeof createRoadNavigator<Tile>>
  private readonly destinationTiles: Tile[]
  private tile: Tile
  private heading: Direction
  private readonly trafficLightTiles: {
    tile: Tile
    colour: TrafficLightColour
  }[]
  private readonly animalTiles: Tile[]
  readonly commands: GameState["gameCommands"] = []

  constructor(tilemap: OrthogonalTilemap) {
    const roadLayer = tilemap.layers[0]
    this.roadData = roadLayer.data
    this.roadWidth = roadLayer.width
    this.roadHeight = roadLayer.height
    this.navigator = createRoadNavigator<Tile>(tile => {
      if (
        tile.row < 0 ||
        tile.row >= this.roadHeight ||
        tile.col < 0 ||
        tile.col >= this.roadWidth
      )
        return undefined
      const rawId = this.roadData[tile.row * this.roadWidth + tile.col]
      return rawId === 0 ? undefined : decode(rawId as RoadID)
    })

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

  /** Records a command against `this.commands`/`commandLines`/`commandBlocks`. */
  private pushCommand(
    command: GameCommand,
    { blockId, lineNo }: CommandOptions = {},
  ) {
    this.commands.push({ command, lineNo, blockId })
  }

  private turnTo(
    command: GameCommand,
    newHeading: (dir: Direction) => Direction,
    options?: CommandOptions,
  ) {
    this.pushCommand(command, options)
    this.tile = this.navigator.moveFromTile(this.tile, this.heading)
    this.heading = newHeading(this.heading)
  }
  turnLeft = (options?: CommandOptions) =>
    this.turnTo("turn_left", turnLeft, options)
  turnRight = (options?: CommandOptions) =>
    this.turnTo("turn_right", turnRight, options)
  turnAround = (options?: CommandOptions) =>
    this.turnTo("turn_around", turnAround, options)

  moveForwards = (options?: CommandOptions) => {
    this.pushCommand("move_forwards", options)
    this.tile = this.navigator.moveFromTile(this.tile, this.heading)
  }
  wait = (options?: CommandOptions) => this.pushCommand("wait", options)
  deliver = (options?: CommandOptions) => this.pushCommand("deliver", options)
  soundHorn = (options?: CommandOptions) =>
    this.pushCommand("sound_horn", options)

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
    if (!this.navigator.roadConnects(this.tile, this.heading)) return false
    const nextTile = this.navigator.moveFromTile(this.tile, this.heading)
    const resultingHeading =
      direction === "forward"
        ? this.heading
        : direction === "left"
          ? turnLeft(this.heading)
          : turnRight(this.heading)
    return this.navigator.roadConnects(nextTile, resultingHeading)
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
    const aheadTile = this.navigator.moveFromTile(this.tile, this.heading)
    return this.destinationTiles.some(t => this.tileEquals(t, aheadTile))
  }
  // Obstacles are checked one tile ahead (in the van's current heading),
  // never on the van's own tile - the game's rules forbid the van ever
  // sharing a tile with a traffic light or animal.
  atTrafficLight = (colour: TrafficLightColour): boolean => {
    const aheadTile = this.navigator.moveFromTile(this.tile, this.heading)
    return this.trafficLightTiles.some(
      t => t.colour === colour && this.tileEquals(t.tile, aheadTile),
    )
  }
  atRedTrafficLight = (): boolean => this.atTrafficLight("RED")
  atGreenTrafficLight = (): boolean => this.atTrafficLight("GREEN")

  isAnimalCrossing = (): boolean => {
    const aheadTile = this.navigator.moveFromTile(this.tile, this.heading)
    return this.animalTiles.some(t => this.tileEquals(t, aheadTile))
  }
}
