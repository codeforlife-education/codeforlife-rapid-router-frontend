import Phaser from "phaser"

/** A child must report its own size and position to be laid out. */
type StackChild = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.ComputedSize &
  Phaser.GameObjects.Components.Transform

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

  /**
   * Re-positions all children in a single line along `direction`, spaced by
   * `gap`.
   */
  private layout(): this {
    const isRow = this.direction === "row"
    let offset = 0

    for (const child of this.list as StackChild[]) {
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
