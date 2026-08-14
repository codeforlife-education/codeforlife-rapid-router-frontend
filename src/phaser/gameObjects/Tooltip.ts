import Phaser from "phaser"

import * as objects from "../layers/objectGroup/objects"

/** Finds the property descriptor for `prop` anywhere up `obj`'s prototype chain. */
function getPropertyDescriptor(obj: object, prop: string) {
  for (
    let proto: object | null = obj;
    proto;
    proto = Object.getPrototypeOf(proto) as object | null
  ) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop)
    if (descriptor) return descriptor
  }
  return undefined
}

/**
 * A label that appears next to one or more target objects while the pointer
 * is hovering over them.
 */
export default class extends Phaser.GameObjects.Text {
  private readonly target: Phaser.GameObjects.GameObject[]
  private readonly placement: Phaser.Types.GameObjects.Tooltip.Placement
  private readonly gap: number

  /** Objects whose `visible` property has already been wrapped. */
  private readonly observed = new WeakSet<Phaser.GameObjects.GameObject>()

  constructor(
    scene: Phaser.Scene,
    title: string,
    target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    {
      placement = "bottom",
      gap = 8,
      // Place above all objects (and any FABs/stacks pointing to them).
      depth = Math.max(...Object.values(objects.Depths)) + 2,
    }: Phaser.Types.GameObjects.Tooltip.Options = {},
  ) {
    super(scene, 0, 0, title, {
      fontFamily: '"SpaceGrotesk"',
      fontSize: "21px",
      color: "#ffffff",
      backgroundColor: "#000000cc",
      padding: { x: 8, y: 4 },
    })

    this.target = Array.isArray(target) ? target : [target]
    this.placement = placement
    this.gap = gap

    this.setOrigin(
      placement === "left" ? 1 : placement === "right" ? 0 : 0.5,
      placement === "top" ? 1 : placement === "bottom" ? 0 : 0.5,
    )

    this.setDepth(depth).setVisible(false)

    for (const obj of this.target) {
      if (!obj.input) obj.setInteractive()
      obj
        .on(Phaser.Input.Events.POINTER_OVER, this.show)
        .on(Phaser.Input.Events.POINTER_OUT, this.hide)
      this.observeVisibility(obj)
    }
  }

  /**
   * `obj` and every Container that visually contains it, closest first. A
   * target is only effectively visible if it and all of its ancestors are.
   */
  private ancestors(obj: Phaser.GameObjects.GameObject) {
    const chain = [obj]
    for (
      let parent = obj.parentContainer;
      parent;
      parent = parent.parentContainer
    )
      chain.push(parent)
    return chain
  }

  /** Whether `obj` (and every Container containing it) is visible. */
  private isVisible(obj: Phaser.GameObjects.GameObject) {
    return this.ancestors(obj).every(
      o =>
        !("visible" in o) ||
        (o as unknown as Phaser.GameObjects.Components.Visible).visible,
    )
  }

  /**
   * Re-checks visibility whenever `obj` or any of its ancestor Containers'
   * `visible` property is changed.
   */
  private observeVisibility(obj: Phaser.GameObjects.GameObject) {
    for (const o of this.ancestors(obj)) this.observeOwnVisibility(o)
  }

  private observeOwnVisibility(obj: Phaser.GameObjects.GameObject) {
    if (this.observed.has(obj)) return
    this.observed.add(obj)

    const descriptor = getPropertyDescriptor(obj, "visible")
    if (!descriptor?.get || !descriptor?.set) return

    Object.defineProperty(obj, "visible", {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: (): boolean => descriptor.get!.call(obj) as boolean,
      set: (value: boolean) => {
        descriptor.set!.call(obj, value)
        this.onTargetVisibilityChange()
      },
    })
  }

  /** Hides the tooltip if every target is now invisible, otherwise repositions it. */
  private onTargetVisibilityChange() {
    if (!this.visible) return

    if (this.target.every(obj => !this.isVisible(obj))) this.setVisible(false)
    else this.reposition()
  }

  /** The union of the bounds of every target object that reports bounds. */
  private targetBounds(): Phaser.Geom.Rectangle | null {
    let bounds: Phaser.Geom.Rectangle | null = null

    for (const obj of this.target) {
      if (!this.isVisible(obj) || !("getBounds" in obj)) continue
      const objBounds = (
        obj as unknown as Phaser.GameObjects.Components.GetBounds
      ).getBounds()
      bounds = bounds
        ? Phaser.Geom.Rectangle.Union(bounds, objBounds)
        : objBounds
    }

    return bounds
  }

  /** Re-positions the tooltip next to the target, following `placement`. */
  private reposition() {
    const bounds = this.targetBounds()
    if (!bounds) return

    if (this.placement === "top")
      this.setPosition(bounds.centerX, bounds.top - this.gap)
    else if (this.placement === "bottom")
      this.setPosition(bounds.centerX, bounds.bottom + this.gap)
    else if (this.placement === "left")
      this.setPosition(bounds.left - this.gap, bounds.centerY)
    else this.setPosition(bounds.right + this.gap, bounds.centerY)
  }

  private show: Phaser.Input.Events.GameObjectPointerOver = () => {
    this.reposition()
    this.setVisible(true)
  }

  private hide: Phaser.Input.Events.GameObjectPointerOut = () =>
    this.setVisible(false)

  destroy(fromScene?: boolean) {
    for (const obj of this.target) {
      obj
        .off(Phaser.Input.Events.POINTER_OVER, this.show)
        .off(Phaser.Input.Events.POINTER_OUT, this.hide)
    }
    super.destroy(fromScene)
  }
}
