import Phaser from "phaser"

/** A child must report its own size, position, and visibility to be laid out. */
type StackChild = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.ComputedSize &
  Phaser.GameObjects.Components.Transform &
  Phaser.GameObjects.Components.Visible

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
 * Lays out its children in a single row or column, evenly spaced by `gap`.
 * Each child is assumed to be centered on its own origin.
 */
export default class extends Phaser.GameObjects.Container {
  private _direction: Phaser.Types.GameObjects.Stack.Direction
  private _gap: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    children: Phaser.GameObjects.GameObject[],
    {
      direction = "column",
      gap = 0,
    }: Phaser.Types.GameObjects.Stack.Options = {},
  ) {
    super(scene, x, y, children)

    this._direction = direction
    this._gap = gap

    for (const child of this.list as StackChild[]) this.observeVisibility(child)

    this.layout()
  }

  get direction() {
    return this._direction
  }

  set direction(direction: Phaser.Types.GameObjects.Stack.Direction) {
    this._direction = direction
    this.layout()
  }

  get gap() {
    return this._gap
  }

  set gap(gap: number) {
    this._gap = gap
    this.layout()
  }

  /** Re-lays out whenever the child's `visible` property is changed. */
  private observeVisibility(child: StackChild) {
    const descriptor = getPropertyDescriptor(child, "visible")
    if (!descriptor?.get || !descriptor?.set) return

    Object.defineProperty(child, "visible", {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: (): boolean => descriptor.get!.call(child) as boolean,
      set: (value: boolean) => {
        descriptor.set!.call(child, value)
        this.layout()
      },
    })
  }

  /**
   * Re-positions all visible children in a single line along `direction`,
   * spaced by `gap`. Invisible children are skipped entirely.
   */
  private layout(): this {
    const isRow = this.direction === "row"
    let offset = 0

    for (const child of this.list as StackChild[]) {
      if (!child.visible) continue

      const size = isRow ? child.displayWidth : child.displayHeight

      child.setPosition(
        isRow ? offset + size / 2 : 0,
        isRow ? 0 : offset + size / 2,
      )

      offset += size + this.gap
    }

    return this
  }
}
