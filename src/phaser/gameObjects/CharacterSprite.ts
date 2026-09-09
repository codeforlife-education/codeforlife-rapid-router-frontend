import Phaser from "phaser"

import type * as images from "../images"
import * as layers from "../layers"

// Shorthands
type NormalKey = keyof typeof images.URLs.Character.Normal
type WreckageKey = keyof typeof images.URLs.Character.Wreckage
type Point = Phaser.Types.Math.Vector2Like
type OnComplete = () => void

export default class extends Phaser.GameObjects.Sprite {
  /** The texture to use when the character is in its normal state. */
  readonly normalTexture: string
  /** The texture to use when the character is wrecked. */
  readonly wreckageTexture?: string
  /** The default duration of a move forwards animation, in milliseconds. */
  readonly defaultMoveDurationMs: number
  /** The default duration of a turn animation, in milliseconds. */
  readonly defaultTurnDurationMs: number
  /** The function to call to finish the current animation, if any. */
  private _finishAnimation?: () => void

  constructor(
    scene: Phaser.Scene,
    key: NormalKey | [NormalKey, WreckageKey],
    {
      x,
      y,
      defaultMoveDurationMs = 400,
      defaultTurnDurationMs = 500,
    }: Phaser.Types.GameObjects.CharacterSprite.Options = {},
  ) {
    const [normalKey, wreckageKey] = Array.isArray(key) ? key : [key, undefined]
    const normalTexture = `character_normal_${normalKey}`
    const wreckageTexture = wreckageKey
      ? `character_wreckage_${wreckageKey}`
      : undefined

    super(scene, x ?? 0, y ?? 0, normalTexture)
    this.normalTexture = normalTexture
    this.wreckageTexture = wreckageTexture
    this.defaultMoveDurationMs = defaultMoveDurationMs
    this.defaultTurnDurationMs = defaultTurnDurationMs

    this.setDepth(
      // Place above all obstacles/endpoints/scenery.
      Math.max(...Object.values(layers.objectGroup.objects.Depths)) + 1,
    ).setOrigin(0.5, 0.5) // Move the character from its center.

    // Hide the character if its position is not explicitly set.
    if (x === undefined && y === undefined) this.setVisible(false)
  }

  setTexture(texture: Phaser.Types.GameObjects.CharacterSprite.Texture) {
    return super.setTexture(
      texture === "normal"
        ? this.normalTexture
        : (this.wreckageTexture ?? this.normalTexture),
    )
  }

  /**
   * Drives `onUpdate(t)` (t: 0..1) over `duration`, then calls `onComplete()`.
   * Exposes a `finishAnimation()` escape hatch that jumps straight to
   * `onUpdate(1)` and `onComplete()`, for when the next command arrives before
   * this animation naturally completes.
   */
  private beginAnimation(
    duration: number,
    onUpdate: (t: number) => void,
    onComplete?: OnComplete,
  ) {
    this._finishAnimation?.()

    const state = { t: 0 }
    const _onComplete = () => {
      this._finishAnimation = undefined
      onComplete?.()
    }

    const tween = this.scene.tweens.add({
      targets: state,
      t: 1,
      duration,
      onUpdate: () => onUpdate(state.t),
      onComplete: _onComplete,
    })

    this._finishAnimation = () => {
      tween.stop()
      onUpdate(1) // Skip the animation to the end.
      _onComplete()
    }
  }

  /** Immediately finishes the current animation, if any. */
  finishAnimation = () => this._finishAnimation?.()

  /** Animates the character moving from one point to another linearly. */
  move(
    from: Point,
    to: Point,
    onComplete?: OnComplete,
    duration = this.defaultMoveDurationMs,
  ) {
    this.beginAnimation(
      duration,
      t => {
        this.setPosition(
          Phaser.Math.Linear(from.x, to.x, t),
          Phaser.Math.Linear(from.y, to.y, t),
        )
      },
      onComplete,
    )
  }

  /**
   * Animates the sprite tracing a circular arc of `deltaDeg` around `pivot`,
   * starting at `from` (at angle `fromAngleDeg`), while rotating the sprite's
   * own angle by the same `deltaDeg`. Used by both the 90-degree turns and
   * the 180-degree u-turn - only the pivot/angle/duration differ.
   */
  turn(
    pivot: Point,
    from: Point,
    fromAngleDeg: number,
    deltaDeg: -90 | 90 | 180,
    onComplete?: OnComplete,
    duration = this.defaultTurnDurationMs,
  ) {
    const offset = { x: from.x - pivot.x, y: from.y - pivot.y }

    this.beginAnimation(
      duration,
      t => {
        const rad = Phaser.Math.DegToRad(deltaDeg * t)
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        this.setPosition(
          pivot.x + offset.x * cos - offset.y * sin,
          pivot.y + offset.x * sin + offset.y * cos,
        )
        this.setAngle(fromAngleDeg + deltaDeg * t)
      },
      onComplete,
    )
  }
}
