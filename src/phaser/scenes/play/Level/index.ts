import BaseLevel, { type BaseLevelData } from "../../BaseLevel"
import CharacterManager from "./CharacterManager"
import type { GameCommand } from "../../../../app/slices"
import HUD from "../HUD"
import { SceneKeys } from "../../../globals"

export interface LevelData extends BaseLevelData {}

/**
 * The Gameplay Scene is the main scene where the core game mechanics and
 * interactions take place. The Gameplay Scene is responsible for managing the
 * game world, handling player input, updating game objects, and implementing
 * the game logic. It typically runs in parallel with the HUD Scene, which
 * displays essential information to the player without interfering with the
 * gameplay experience.
 */
export default class extends BaseLevel<LevelData> {
  static readonly KEY = SceneKeys.Play.LEVEL

  /** Character manager responsible for handling character objects. */
  character!: CharacterManager

  /** The commands compiled from the player's program. */
  get commands() {
    return this.getVariable<GameCommand[]>("commands", [])
  }

  /** The index of the command currently being executed, or -1 before play starts. */
  get commandIndex() {
    return this.getVariable<number>("commandIndex", -1)
  }

  create() {
    this.scene.launch(HUD.KEY)

    super.create()

    // Initialize the managers.
    this.character = new CharacterManager(this)
  }

  // @ts-expect-error will be used in the future
  private pause() {
    this.scene.pause(HUD.KEY)
    this.scene.pause()
  }
}
