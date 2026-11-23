import Phaser from "phaser"

import type * as sounds from "../../../sounds"
import type { AnimalKind } from "../../../LevelSimulator"
import { Events } from "../../../globals"
import type { GamePhase } from "../../../PhaserGameContext"
import type Level from "."

/** How long the engine takes to fade out at the end, in milliseconds. */
const ENGINE_FADE_MS = 1000

/** How long the starting sound plays before the engine kicks in, in
 * milliseconds - matching the legacy game's starting step. */
const ENGINE_START_DELAY_MS = 820

/**
 * Plays the level's sound effects. Which engine and crash sounds play depends
 * on the character:
 * - Van: a starting sound, then the engine (played once), and a crash.
 * - Electric van: an electric starting sound, no engine, and the failure
 *   jingle as its crash.
 * - Everyone else: no starting or engine sound, and the failure jingle as
 *   their crash.
 *
 * The engine fades out over its last second, and pauses (fade included)
 * while playback is paused.
 */
export default class SoundManager {
  private readonly level: Level
  /** The engine, if the character has one. */
  private readonly engine?: Phaser.Sound.BaseSound & { volume: number }
  /** The sound the character makes as it starts, if any. */
  private readonly starting?: Phaser.Sound.BaseSound
  /** Starts the engine once the starting sound's had its moment. */
  private engineTimer?: Phaser.Time.TimerEvent
  /** Fades the engine out over its last second. */
  private engineFade?: Phaser.Tweens.Tween

  constructor(level: Level) {
    this.level = level

    const { normalKey } = level.initData.character
    if (normalKey === "VAN") {
      this.starting = level.sound.add("starting" satisfies sounds.Key)
      this.engine = level.sound.add("moving" satisfies sounds.Key) as
        | Phaser.Sound.WebAudioSound
        | Phaser.Sound.HTML5AudioSound
    } else if (normalKey === "ELECTRIC_VAN") {
      this.starting = level.sound.add(
        "electric_van_starting" satisfies sounds.Key,
      )
    }

    const onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
      if (key === "phase") this.onPhaseChanged()
    }
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)
    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      this.stopEngine()
    })
  }

  private get crashKey(): sounds.Key {
    return this.level.initData.character.normalKey === "VAN"
      ? "crash"
      : "failure"
  }

  private play(key: sounds.Key) {
    this.level.sound.play(key)
  }

  /** Pauses the engine while playback's paused, and resumes it after. */
  private onPhaseChanged() {
    const phase = this.level.getVariable<GamePhase>("phase", "idle")
    if (phase === "paused") {
      if (this.engineTimer) this.engineTimer.paused = true
      this.engineFade?.pause()
      if (this.engine?.isPlaying) this.engine.pause()
    } else if (phase === "playing") {
      if (this.engineTimer) this.engineTimer.paused = false
      this.engineFade?.resume()
      if (this.engine?.isPaused) this.engine.resume()
    }
  }

  /** The character starts up, at the beginning of a run. */
  start() {
    this.stopEngine()
    this.starting?.play()
    const engine = this.engine
    if (!engine) return
    this.engineTimer = this.level.time.delayedCall(
      ENGINE_START_DELAY_MS,
      () => {
        this.engineTimer = undefined
        engine.play({ volume: 1 })
        // Fade out over the engine's last second (or all of it, if shorter).
        const fadeMs = Math.min(ENGINE_FADE_MS, engine.duration * 1000)
        this.engineFade = this.level.tweens.add({
          targets: engine,
          volume: 0,
          delay: engine.duration * 1000 - fadeMs,
          duration: fadeMs,
          onComplete: () => (this.engineFade = undefined),
        })
        // Started while paused (e.g. stepping) - stay quiet until playing.
        if (this.level.getVariable<GamePhase>("phase", "idle") === "paused") {
          this.engineFade.pause()
          engine.pause()
        }
      },
    )
  }

  /** Stops the engine (and any electric starting sound), e.g. once the run's
   * over or restarted. */
  stopEngine() {
    this.engineTimer?.remove()
    this.engineTimer = undefined
    this.engineFade?.remove()
    this.engineFade = undefined
    this.engine?.stop()
    if (this.level.initData.character.normalKey === "ELECTRIC_VAN")
      this.starting?.stop()
  }

  crash() {
    this.play(this.crashKey)
  }

  failure() {
    this.play("failure")
  }

  win() {
    this.play("win")
  }

  delivery() {
    this.play("delivery")
  }

  horn() {
    this.play("horn")
  }

  /** The noise an animal makes as it's scared off the road. */
  animal(kind: AnimalKind) {
    this.play(kind === "PIGEON" ? "pigeon" : "cow")
  }
}
