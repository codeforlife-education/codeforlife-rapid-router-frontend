import type Phaser from "phaser"

import * as tilesets from "./tilesets"
import {
  DEFAULT_TIMING,
  type Timing,
} from "./layers/objectGroup/objects/obstacles/trafficLight"
import {
  type Direction,
  turnAround,
  turnLeft,
  turnRight,
} from "./tilegrid/navigation"
import { type RoadID, decode } from "./layers/tile/data"
import { DEFAULT_MAX_FUEL } from "./globals"
import type { GameCommand } from "../app/slices"
import type { OrthogonalTilemap } from "./tilemaps"
import { createRoadNavigator } from "./tilegrid/road"

export type RelativeDirection = "forward" | "left" | "right"
export type TrafficLightColour = "RED" | "GREEN"

export type Collision =
  /** The character drove off the road. */
  | "off_road"
  /** The character drove into an animal (cow/pigeon). */
  | "animal"
  /** The character drove through a red traffic light. */
  | "red_light"

export type Mistake =
  /** The character delivered somewhere that isn't a destination. */
  | "delivered_to_non_destination"
  /** The character delivered to a destination it had already delivered to. */
  | "already_delivered"

export type StopReason =
  | Collision
  | Mistake
  /** The character couldn't afford its next command's fuel. */
  | "out_of_fuel"

/** Why a level wasn't completed once the student's program ended. */
export type FailureReason =
  | StopReason
  /** The program ended before the character reached the (only) destination. */
  | "out_of_instructions"
  /** The character drove through the (only) destination, but didn't stop there. */
  | "visited_but_did_not_stop"
  /** The program ended before the character delivered to every destination. */
  | "undelivered_destinations"

export type AnimalKind = "COW" | "PIGEON"

/** Why a level wasn't completed, alongside any details needed to explain it. */
export type LevelFailure =
  | {
      success: false
      reason: "off_road"
      /** How many moves the character made successfully before crashing. */
      correctMoves: number
    }
  | { success: false; reason: "animal"; animal: AnimalKind }
  | {
      success: false
      reason: Exclude<FailureReason, "off_road" | "animal">
    }

/** Whether the level was completed once the student's program ended. */
export type LevelOutcome = { success: true } | LevelFailure

/** A single interpreted command, alongside the presentation metadata needed
 * to highlight whatever produced it (Blockly blocks and/or a source line) -
 * callers split this apart into whatever each consumer actually stores. */
export type SimulatorCommand = {
  command: GameCommand
  blockIds?: string[]
  lineNo?: number
}

type Tile = Phaser.Types.Tilemaps.Tile
type CommandOptions = Partial<Pick<SimulatorCommand, "blockIds" | "lineNo">>
type TiledProperties = { name: string; value: unknown }[]

/** Where the character is: it always straddles the boundary between `tile`
 * (its back half) and the tile ahead of it in `heading` (its front half). */
export type CharacterState = { tile: Tile; heading: Direction }

export type TrafficLight = {
  /** The tile the light sits on, i.e. the tile it stops traffic leaving. */
  tile: Tile
  /** The side of its tile the light faces, i.e. towards oncoming traffic. */
  variant: Direction
  /** The heading of the traffic the light controls. */
  heading: Direction
  timing: Timing
  colour: TrafficLightColour
  /** How many actions the light has spent in its current colour. */
  time: number
}

export type Destination = {
  /** The (road) tile the destination's house sits beside. */
  tile: Tile
  /** True once the character has delivered to this destination. */
  delivered: boolean
}

export type Animal = {
  tile: Tile
  kind: AnimalKind
  /** False once the animal has been scared off the road by the horn. */
  active: boolean
}

/** The outcome of performing a single command. */
export type SimulatorStep = {
  command: GameCommand
  /** Where the character was before the command. */
  from: CharacterState
  /** Where the character ended up (or, if it crashed, where it was heading). */
  to: CharacterState
  /** Set if this command ended the run early. */
  stopReason?: StopReason
  /** The animal scared off the road by this command (a horn), if any. */
  scaredAnimal?: Animal
  /** The destination delivered to by this command (a deliver), if any. */
  delivered?: Destination
}

/**
 * Thrown by the program-facing command methods (`moveForwards`, `wait`, etc.)
 * once the run ends early (a collision or an invalid delivery), to stop
 * running the student's program. The command that ended it is always the last
 * one recorded. */
export class LevelStop extends Error {
  readonly reason: StopReason

  constructor(reason: StopReason) {
    super(`The run stopped early (${reason}).`)
    this.reason = reason
  }
}

const CFC_IDS: readonly number[] = tilesets.endpoints.cfc.IDs
const HOUSE_IDS: readonly number[] = tilesets.endpoints.house.IDs
const ANIMAL_IDS: readonly number[] = tilesets.obstacles.animal.IDs
const PIGEON_ID: number = tilesets.IDs.Obstacles.Animal.PIGEON
const RED_TRAFFIC_LIGHT_ID: number = tilesets.IDs.Obstacles.TrafficLight.RED
const TRAFFIC_LIGHT_IDS: readonly number[] = tilesets.obstacles.trafficLight.IDs

/** The amount of fuel each command costs to execute - where every action that
 * goes through \`moveVan\` (moving, turning, waiting and sounding the horn)
 * burns fuel, but delivering doesn't. Nor does \`observe\`, a step synthesised
 * purely for editor highlighting (e.g. a loop/if header or sensing check),
 * which isn't an action at all. */
export const FUEL_COST: Record<GameCommand, number> = {
  move_forwards: 1,
  turn_left: 1,
  turn_right: 1,
  turn_around: 1,
  wait: 1,
  deliver: 0,
  sound_horn: 1,
  observe: 0,
}

/** The commands that move the character off its current tile. */
const MOVING_COMMANDS: readonly GameCommand[] = [
  "move_forwards",
  "turn_left",
  "turn_right",
  "turn_around",
]

/** Reads a Tiled object's custom property by name. */
function readProperty<T>(properties: unknown, name: string) {
  return (properties as TiledProperties).find(p => p.name === name)?.value as
    | T
    | undefined
}

/** Finds a level object's tile/facing from its `tileRow`/`tileCol`/`variant` properties. */
function readObjectTile(properties: unknown): {
  tile: Tile
  variant: Direction
} {
  return {
    tile: {
      row: readProperty<number>(properties, "tileRow")!,
      col: readProperty<number>(properties, "tileCol")!,
    },
    variant: readProperty<Direction>(properties, "variant")!,
  }
}

/** Reads a traffic light object's starting state and timing. Lights without
 * timing properties (e.g. placed in the level creator) use `DEFAULT_TIMING`. */
function readTrafficLight(gid: number, properties: unknown): TrafficLight {
  const { tile, variant } = readObjectTile(properties)
  const timing: Timing = {
    redDuration:
      readProperty<number>(properties, "redDuration") ??
      DEFAULT_TIMING.redDuration,
    greenDuration:
      readProperty<number>(properties, "greenDuration") ??
      DEFAULT_TIMING.greenDuration,
    startTime:
      readProperty<number>(properties, "startTime") ?? DEFAULT_TIMING.startTime,
  }
  return {
    tile,
    variant,
    // A light faces the traffic coming towards it.
    heading: turnAround(variant),
    timing,
    colour: gid === RED_TRAFFIC_LIGHT_ID ? "RED" : "GREEN",
    time: timing.startTime,
  }
}

/**
 * A headless, Phaser-free model of a play-mode level - the single source of
 * truth for the game's rules. It's used both to run the student's program
 * upfront (collecting the flat `SimulatorCommand[]` list to play back) and by
 * Phaser to replay those commands, so both always agree on where the character
 * is, what colour each traffic light is, which animals are on the road and when
 * the character collides with something.
 */
export default class LevelSimulator {
  private readonly roadData: readonly number[]
  private readonly roadWidth: number
  private readonly roadHeight: number
  private readonly navigator: ReturnType<typeof createRoadNavigator<Tile>>
  private tile: Tile
  private heading: Direction
  /** Every tile the character's front half has been on. */
  private readonly visitedTiles: Tile[]
  readonly destinations: Destination[]
  readonly trafficLights: TrafficLight[]
  readonly animals: Animal[]
  readonly commands: SimulatorCommand[] = []
  /** Set once the run has ended early. */
  stop?: { reason: StopReason; commandIndex: number }
  private correctMoves = 0
  private collidedAnimal?: Animal
  fuel: number

  constructor(tilemap: OrthogonalTilemap, maxFuel = DEFAULT_MAX_FUEL) {
    this.fuel = maxFuel
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

    const endpoints = tilemap.layers[2].objects
    const start = endpoints.find(
      o => o.gid !== undefined && CFC_IDS.includes(o.gid),
    )
    if (!start) throw new Error("Level has no CFC start endpoint")
    const { tile, variant } = readObjectTile(start.properties)
    this.tile = tile
    this.heading = variant

    this.visitedTiles = [this.aheadTile()]

    this.destinations = endpoints
      .filter(o => o.gid !== undefined && HOUSE_IDS.includes(o.gid))
      .map(o => ({
        tile: readObjectTile(o.properties).tile,
        delivered: false,
      }))

    const obstacles = tilemap.layers[1].objects
    this.trafficLights = obstacles
      .filter(o => o.gid !== undefined && TRAFFIC_LIGHT_IDS.includes(o.gid))
      .map(o => readTrafficLight(o.gid, o.properties))

    this.animals = obstacles
      .filter(o => o.gid !== undefined && ANIMAL_IDS.includes(o.gid))
      .map(o => ({
        tile: readObjectTile(o.properties).tile,
        kind: o.gid === PIGEON_ID ? ("PIGEON" as const) : ("COW" as const),
        active: true,
      }))
  }

  /** Where the character currently is. */
  get state(): CharacterState {
    return { tile: this.tile, heading: this.heading }
  }

  private tileEquals(a: Tile, b: Tile): boolean {
    return a.row === b.row && a.col === b.col
  }

  /** The tile the character's front half is on - the tile it's "at". */
  private aheadTile({ tile, heading }: CharacterState = this.state): Tile {
    return this.navigator.moveFromTile(tile, heading)
  }

  /** The traffic light the character is currently stopped at, if any - one
   * on the tile ahead that controls the character's own heading. */
  private trafficLightAt(state: CharacterState = this.state) {
    const aheadTile = this.aheadTile(state)
    return this.trafficLights.find(
      light =>
        light.heading === state.heading &&
        this.tileEquals(light.tile, aheadTile),
    )
  }

  /** The animal (still on the road) on the given tile, if any. */
  private animalAt(tile: Tile) {
    return this.animals.find(
      animal => animal.active && this.tileEquals(animal.tile, tile),
    )
  }

  /** The destination on the given tile not yet delivered to, if any. */
  private destinationAt(tile: Tile) {
    return this.destinations.find(
      destination =>
        !destination.delivered && this.tileEquals(destination.tile, tile),
    )
  }

  /** Where the given command would take the character. */
  private nextState(command: GameCommand): CharacterState {
    const { tile, heading } = this
    switch (command) {
      case "move_forwards":
        return { tile: this.aheadTile(), heading }
      case "turn_left":
        return { tile: this.aheadTile(), heading: turnLeft(heading) }
      case "turn_right":
        return { tile: this.aheadTile(), heading: turnRight(heading) }
      case "turn_around":
        return { tile: this.aheadTile(), heading: turnAround(heading) }
      default:
        return { tile, heading }
    }
  }

  /** Advances every traffic light by one action. */
  private tickTrafficLights() {
    for (const light of this.trafficLights) {
      light.time++
      if (light.colour === "RED" && light.time >= light.timing.redDuration) {
        light.colour = "GREEN"
        light.time = 0
      } else if (
        light.colour === "GREEN" &&
        light.time >= light.timing.greenDuration
      ) {
        light.colour = "RED"
        light.time = 0
      }
    }
  }

  /**
   * Records and performs a single command:
   * 1. Driving on while an animal is on the tile ahead is a collision.
   * 2. Driving off the road is a collision.
   * 3. Leaving a red traffic light's tile (by moving or turning in any
   *    direction - only waiting/the horn are allowed) is a collision.
   * 4. Delivering anywhere but an undelivered destination is a mistake.
   * Every action except `observe` then advances the traffic lights by one.
   *
   * Never throws - once the run has stopped, further commands are ignored
   * (see `act` for the program-facing variant that does throw).
   */
  perform(command: GameCommand, options: CommandOptions = {}): SimulatorStep {
    const from = this.state
    if (this.stop) return { command, from, to: from }

    this.commands.push({ command, ...options })
    if (command === "observe") return { command, from, to: from }

    // Without enough fuel, the character can't do anything at all - which
    // also stops a program that'd otherwise loop forever (e.g. turning
    // around until it reaches the destination).
    const cost = FUEL_COST[command]
    if (cost > this.fuel) {
      this.stop = {
        reason: "out_of_fuel",
        commandIndex: this.commands.length - 1,
      }
      return { command, from, to: from, stopReason: "out_of_fuel" }
    }
    this.fuel -= cost

    // The horn scares the animal ahead off the road before anything else.
    let scaredAnimal: Animal | undefined
    if (command === "sound_horn") {
      scaredAnimal = this.animalAt(this.aheadTile())
      if (scaredAnimal) scaredAnimal.active = false
    }

    // Delivering marks the undelivered destination ahead as delivered.
    let delivered: Destination | undefined
    if (command === "deliver") {
      delivered = this.destinationAt(this.aheadTile())
      if (delivered) delivered.delivered = true
    }

    const moving = MOVING_COMMANDS.includes(command)
    let stopReason: StopReason | undefined
    let to = from

    const animal = moving ? this.animalAt(this.aheadTile()) : undefined
    if (animal) {
      stopReason = "animal"
      this.collidedAnimal = animal
    } else if (command === "deliver" && !delivered)
      stopReason = this.destinations.some(d =>
        this.tileEquals(d.tile, this.aheadTile()),
      )
        ? "already_delivered"
        : "delivered_to_non_destination"
    else {
      to = this.nextState(command)
      if (moving && !this.navigator.roadConnects(to.tile, to.heading))
        stopReason = "off_road"
      else if (moving && this.trafficLightAt(from)?.colour === "RED")
        stopReason = "red_light"
    }

    this.tile = to.tile
    this.heading = to.heading
    if (moving) this.visitedTiles.push(this.aheadTile())

    if (stopReason) {
      this.stop = { reason: stopReason, commandIndex: this.commands.length - 1 }
      return { command, from, to, stopReason, scaredAnimal }
    }

    if (moving) this.correctMoves++
    this.tickTrafficLights()
    return { command, from, to, scaredAnimal, delivered }
  }

  /** Performs a command on behalf of the student's program, throwing
   * `LevelStop` to stop the program once the run ends early. */
  private act(command: GameCommand, options?: CommandOptions) {
    if (this.stop) throw new LevelStop(this.stop.reason)
    const { stopReason } = this.perform(command, options)
    if (stopReason) throw new LevelStop(stopReason)
  }

  /**
   * Whether the level was completed, once the student's program has ended:
   * - With a single destination, the character just has to stop on it (no
   *   delivery needed) - which then counts as delivering to it.
   * - With several, every destination must have been delivered to, wherever
   *   the character ends up.
   */
  evaluate(): LevelOutcome {
    if (this.stop) return this.failure(this.stop.reason)

    if (this.destinations.length === 1) {
      const [destination] = this.destinations
      const aheadTile = this.aheadTile()
      if (this.tileEquals(destination.tile, aheadTile)) {
        destination.delivered = true
        return { success: true }
      }
      return {
        success: false,
        reason: this.visitedTiles.some(t =>
          this.tileEquals(t, destination.tile),
        )
          ? "visited_but_did_not_stop"
          : "out_of_instructions",
      }
    }

    return this.destinations.every(d => d.delivered)
      ? { success: true }
      : { success: false, reason: "undelivered_destinations" }
  }

  /** Describes why the run stopped early, with the details needed to explain it. */
  private failure(reason: StopReason): LevelFailure {
    switch (reason) {
      case "off_road":
        return { success: false, reason, correctMoves: this.correctMoves }
      case "animal":
        return {
          success: false,
          reason,
          animal: this.collidedAnimal?.kind ?? "COW",
        }
      default:
        return { success: false, reason }
    }
  }

  moveForwards = (options?: CommandOptions) =>
    this.act("move_forwards", options)
  turnLeft = (options?: CommandOptions) => this.act("turn_left", options)
  turnRight = (options?: CommandOptions) => this.act("turn_right", options)
  turnAround = (options?: CommandOptions) => this.act("turn_around", options)
  wait = (options?: CommandOptions) => this.act("wait", options)
  deliver = (options?: CommandOptions) => this.act("deliver", options)
  soundHorn = (options?: CommandOptions) => this.act("sound_horn", options)
  /** Records a step that isn't one of the character's own actions (e.g. a
   * loop/if header), purely so playback pauses on and highlights it. */
  observe = (options?: CommandOptions) => this.act("observe", options)

  // A move/turn is only actually safe if BOTH tiles it would leave the van
  // straddling are road AND actually connected to each other - the immediate
  // next tile (reached by moving forward in the CURRENT heading, same for
  // every command) and the tile beyond that in the RESULTING heading
  // (unchanged for a plain move, turned for a turn). Checking only tile
  // presence is wrong on two counts: at a turn junction, the immediate tile
  // is itself a valid (turning) road tile, so "is there a road forward" must
  // also confirm the road actually continues straight past it; and a tile
  // like a dead end or turn only opens onto 1-2 of its 4 sides, so it must
  // not be treated as connected on a side it doesn't actually open onto.
  roadExists = (direction: RelativeDirection): boolean => {
    if (!this.navigator.roadConnects(this.tile, this.heading)) return false
    const nextTile = this.aheadTile()
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

  // The van "arrives" once its front half reaches the destination tile,
  // matching the real van sprite's position (see `CharacterManager`)..
  atDestination = (): boolean =>
    this.destinationAt(this.aheadTile()) !== undefined
  // The van is at a traffic light once its front half reaches the light's
  // tile, travelling in the direction the light controls.
  atTrafficLight = (colour: TrafficLightColour): boolean =>
    this.trafficLightAt()?.colour === colour
  atRedTrafficLight = (): boolean => this.atTrafficLight("RED")
  atGreenTrafficLight = (): boolean => this.atTrafficLight("GREEN")

  isAnimalCrossing = (): boolean =>
    this.animalAt(this.aheadTile()) !== undefined
}
