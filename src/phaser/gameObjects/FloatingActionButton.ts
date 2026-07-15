import Phaser from "phaser"
import type { SvgIcon } from "@mui/material"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPTH = 200
const FAB_COLOR = 0x2979ff
const ACTIVE_COLOR = 0xe94560
const DEFAULT_COLOR = 0x16213e
const HOVER_COLOR = 0x0f3460
const ICON_COLOR = "#ffffff"
const TOOL_SPACING = 60 // px between button centres when expanded
const DRAG_THRESHOLD = 4 // px; pointer travel below this = click
const ANIM_DURATION = 180 // ms per-button tween duration
const ANIM_STAGGER = 40 // ms delay between consecutive buttons on expand

// ─── Icon texture helper ──────────────────────────────────────────────────────

/**
 * Renders a MUI icon into a canvas-backed Phaser texture. The SVG data-URI is
 * drawn synchronously (works in all modern browsers for data-URI sources).
 * Textures are deduplicated by icon name + size + colour.
 */
function ensureIconTexture(
  scene: Phaser.Scene,
  icon: typeof SvgIcon,
  size: number,
  color: string,
): string {
  const iconName =
    (icon as unknown as { displayName?: string }).displayName ?? "icon"
  const key = `__fab:${iconName}:${size}:${color}`
  if (scene.textures.exists(key)) return key

  const svg = renderToStaticMarkup(
    createElement(icon, {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      fill: color,
    }),
  )

  const img = new window.Image()

  // Create the canvas texture immediately so the key is registered and any
  // game objects referencing it can be created right away. The pixels will
  // be drawn once the image is decoded (onload). Registering onload BEFORE
  // setting src ensures we never miss the event even in browsers that decode
  // data-URIs synchronously.
  const tex = scene.textures.createCanvas(key, size, size)!
  img.onload = () => {
    tex.context.drawImage(img, 0, 0, size, size)
    tex.refresh()
  }
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

  return key
}

// ─── Types ─────────────────────────────────────────────────────────────────

export type FabButtonDef = {
  icon: typeof SvgIcon
  onClick: () => void
}

type ToolBtn = {
  bg: Phaser.GameObjects.Arc
  img: Phaser.GameObjects.Image
  /** Final container-local y position when fully expanded. */
  targetY: number
}

// ─── Class ─────────────────────────────────────────────────────────────────

export default class FloatingActionButton extends Phaser.GameObjects.Container {
  /** Whether the tool list is currently visible. */
  isExpanded = false

  /** Zero-based index of the currently active tool. */
  activeIndex: number

  private readonly iconSize: number
  private readonly toolRadius: number
  private readonly toolIconSize: number
  private readonly buttonDefs: ReadonlyArray<FabButtonDef>
  private readonly mainIcon: Phaser.GameObjects.Image
  private readonly toolBtns: ReadonlyArray<ToolBtn>

  private wasDrag = false
  private downX = 0
  private downY = 0
  private isAnimating = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    buttons: FabButtonDef[],
    defaultButtonIndex = 0,
  ) {
    super(scene, x, y)

    this.activeIndex = Phaser.Math.Clamp(
      defaultButtonIndex,
      0,
      buttons.length - 1,
    )
    this.buttonDefs = buttons
    this.iconSize = Math.round(2 * radius * 0.75)
    this.toolRadius = Math.round(radius * 0.75)
    this.toolIconSize = Math.round(2 * this.toolRadius * 0.75)

    // ── Container: interactive + draggable ────────────────────────────────

    this.setDepth(DEPTH).setInteractive(
      new Phaser.Geom.Circle(0, 0, radius),
      (shape: Phaser.Geom.Circle, px: number, py: number) =>
        Phaser.Geom.Circle.Contains(shape, px, py),
    )
    scene.input.setDraggable(this)

    // ── Main FAB (at local origin) ─────────────────────────────────────────

    const mainBg = new Phaser.GameObjects.Arc(
      scene,
      0,
      0,
      radius,
      0,
      360,
      false,
      FAB_COLOR,
    )
    this.mainIcon = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      ensureIconTexture(
        scene,
        buttons[this.activeIndex].icon,
        this.iconSize,
        ICON_COLOR,
      ),
    ).setDisplaySize(this.iconSize, this.iconSize)
    this.add([mainBg, this.mainIcon])

    // ── Tool buttons (built and added to this container) ───────────────────

    this.toolBtns = buttons.map((btnDef, i) => this.buildToolBtn(btnDef, i))

    // ── Drag & click ───────────────────────────────────────────────────────

    this.on(Phaser.Input.Events.POINTER_DOWN, (ptr: Phaser.Input.Pointer) => {
      this.downX = ptr.x
      this.downY = ptr.y
      this.wasDrag = false
    })

    this.on(
      Phaser.Input.Events.DRAG,
      (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.wasDrag = true
        this.x = dragX
        this.y = dragY
      },
    )

    this.on(Phaser.Input.Events.DRAG_END, () => {
      // Delay the reset so POINTER_UP events on tool buttons that fire at the
      // same tick as DRAG_END still see wasDrag = true and are ignored.
      scene.time.delayedCall(50, () => {
        this.wasDrag = false
      })
    })

    this.on(Phaser.Input.Events.POINTER_UP, (ptr: Phaser.Input.Pointer) => {
      const dist = Phaser.Math.Distance.Between(
        ptr.x,
        ptr.y,
        this.downX,
        this.downY,
      )
      if (dist < DRAG_THRESHOLD) this.setExpanded(!this.isExpanded)
    })
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /** Expand or collapse the tool list with a slide + fade animation. */
  setExpanded(state: boolean) {
    this.isExpanded = state

    if (this.toolBtns.length === 0) return

    this.isAnimating = true
    let remaining = this.toolBtns.length
    const onOneDone = () => {
      if (--remaining === 0) this.isAnimating = false
    }

    if (state) {
      // Expand: slide each button up from the FAB centre to its target y.
      this.toolBtns.forEach(({ bg, img, targetY }, i) => {
        this.scene.tweens.killTweensOf([bg, img])
        // Always start from the FAB centre so the animation is consistent.
        bg.y = 0
        img.y = 0
        bg.setAlpha(0).setVisible(true)
        img.setAlpha(0).setVisible(true)

        this.scene.tweens.add({
          targets: [bg, img],
          y: targetY,
          alpha: 1,
          duration: ANIM_DURATION,
          delay: i * ANIM_STAGGER,
          ease: "Back.Out",
          onComplete: onOneDone,
        })
      })
    } else {
      // Collapse: slide all buttons back down to the FAB centre simultaneously.
      this.toolBtns.forEach(({ bg, img }) => {
        this.scene.tweens.killTweensOf([bg, img])

        this.scene.tweens.add({
          targets: [bg, img],
          y: 0,
          alpha: 0,
          duration: ANIM_DURATION,
          ease: "Cubic.In",
          onComplete: () => {
            bg.setVisible(false)
            img.setVisible(false)
            onOneDone()
          },
        })
      })
    }
  }

  /** Programmatically activate a tool button by zero-based index. */
  setActiveIndex(index: number) {
    this.selectTool(Phaser.Math.Clamp(index, 0, this.buttonDefs.length - 1))
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private buildToolBtn(btnDef: FabButtonDef, i: number): ToolBtn {
    const targetY = -(i + 1) * TOOL_SPACING
    const texKey = ensureIconTexture(
      this.scene,
      btnDef.icon,
      this.toolIconSize,
      ICON_COLOR,
    )
    const fill = i === this.activeIndex ? ACTIVE_COLOR : DEFAULT_COLOR

    // Buttons start at y=0 (the FAB centre) so they can animate upward.
    const bg = new Phaser.GameObjects.Arc(
      this.scene,
      0,
      0,
      this.toolRadius,
      0,
      360,
      false,
      fill,
    )
      .setInteractive(
        new Phaser.Geom.Circle(0, 0, this.toolRadius),
        (shape: Phaser.Geom.Circle, px: number, py: number) =>
          Phaser.Geom.Circle.Contains(shape, px, py),
      )
      .setAlpha(0)
      .setVisible(false)

    const img = new Phaser.GameObjects.Image(this.scene, 0, 0, texKey)
      .setDisplaySize(this.toolIconSize, this.toolIconSize)
      .setAlpha(0)
      .setVisible(false)

    bg.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (i !== this.activeIndex) bg.setFillStyle(HOVER_COLOR)
    })
    bg.on(Phaser.Input.Events.POINTER_OUT, () => {
      if (i !== this.activeIndex) bg.setFillStyle(DEFAULT_COLOR)
    })
    bg.on(Phaser.Input.Events.POINTER_UP, () => {
      if (this.wasDrag || this.isAnimating) return
      if (i !== this.activeIndex) {
        this.selectTool(i)
        btnDef.onClick()
      }
      this.setExpanded(false)
    })

    this.add([bg, img])
    return { bg, img, targetY }
  }

  private selectTool(index: number) {
    if (index === this.activeIndex) return
    this.toolBtns[this.activeIndex].bg.setFillStyle(DEFAULT_COLOR)
    this.toolBtns[index].bg.setFillStyle(ACTIVE_COLOR)
    this.activeIndex = index
    this.mainIcon.setTexture(
      ensureIconTexture(
        this.scene,
        this.buttonDefs[index].icon,
        this.iconSize,
        ICON_COLOR,
      ),
    )
  }
}
