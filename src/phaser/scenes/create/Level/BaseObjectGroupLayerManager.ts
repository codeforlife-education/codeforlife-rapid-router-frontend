import Phaser from "phaser"

import BaseToolboxManager from "./BaseToolboxManager"
import type { default as Level } from "."

/** Gap, in pixels, between the rotate and delete buttons. */
const BUTTON_GAP = 16

/** Margin, in pixels, between the placed object and the button stack. */
const BUTTON_STACK_MARGIN = 8

export type Placed<ID extends number, VariantKey extends string> = {
  id: ID
  variantKey: VariantKey
  obj: Phaser.GameObjects.Image
}

/** In-progress state for a free-rotate drag, keyed to a pivot in world space. */
type FreeRotateDrag = {
  pivot: { x: number; y: number }
  startAngleDeg: number
  startPointerAngleDeg: number
}

/**
 * Shared logic for tools that place objects and let the player select one to
 * rotate or delete it via a floating button stack. `Key` identifies a placed
 * object (e.g. a tile for road objects, or the object itself for free ones).
 */
export default abstract class BaseObjectGroupLayerManager<
  ID extends number,
  VariantKey extends string,
  Key,
> extends BaseToolboxManager<ID> {
  /** The key of the currently selected placed object. */
  protected selected: Key | null = null

  /** Non-null while the free-rotate handle is being dragged. */
  private freeRotateDrag: FreeRotateDrag | null = null

  private readonly button: {
    /** The row of buttons shown below the selected object. */
    stack: Phaser.GameObjects.Stack
    /** The delete button shown in the button stack. */
    delete: Phaser.GameObjects.FloatingActionButton
    /** The rotate button shown in the button stack. */
    rotate: Phaser.GameObjects.FloatingActionButton
    /** The free (hold-and-drag) rotate button shown in the button stack. */
    freeRotate: Phaser.GameObjects.FloatingActionButton
    /** The cancel button shown in the button stack. */
    cancel: Phaser.GameObjects.FloatingActionButton
  }

  constructor(level: Level) {
    super(level)

    const deleteButton = this.createDeleteButton(level)
    const rotateButton = this.createRotateButton(level)
    const freeRotateButton = this.createFreeRotateButton(level)
    const cancelButton = this.createCancelButton(level)
    this.button = {
      rotate: rotateButton,
      freeRotate: freeRotateButton,
      delete: deleteButton,
      cancel: cancelButton,
      stack: level.add
        .stack(
          0,
          0,
          [cancelButton, rotateButton, freeRotateButton, deleteButton],
          { direction: "row", gap: BUTTON_GAP },
        )
        .setVisible(false),
    }

    // The tooltips must be created after the buttons are added to the stack
    // so that the tooltips can observe the stack's visibility.
    level.add.tooltip("Rotate", rotateButton)
    level.add.tooltip("Rotate freely", freeRotateButton)
    level.add.tooltip("Delete", deleteButton)
    level.add.tooltip("Cancel", cancelButton)
  }

  /** Checks if this manager has a placed object identified by `key`. */
  isOccupied(key: Key): boolean {
    return this.getPlaced(key) !== null
  }

  /** Returns the object placed at `key`, if any. */
  protected abstract getPlaced(key: Key): Placed<ID, VariantKey> | null

  /** Returns the valid variant keys for the object identified by `key`. */
  protected abstract validVariantKeys(key: Key, id: ID): VariantKey[]

  /** Removes the placed object identified by `key`, if any. */
  protected abstract remove(key: Key): void

  /** Rotates the placed object identified by `key` to its next valid variant. */
  protected abstract rotate(key: Key): void

  /** Whether `key` can be rotated to any angle via the free-rotate handle. */
  protected abstract supportsFreeRotation(key: Key, id: ID): boolean

  /** Sets the free (continuous) rotation angle, in degrees, of `key`. */
  protected abstract setFreeRotation(key: Key, angleDeg: number): void

  /** Show/hide and position the ghost based on the tile under the pointer. */
  protected abstract handleGhost(pointer?: Phaser.Input.Pointer): void

  /** Visually highlights the object identified by `key` as selected. */
  protected abstract highlightSelection(key: Key): void

  /** Clears the selection highlight left by `key`. */
  protected abstract clearSelectionHighlight(key: Key): void

  /** Checks if `a` and `b` identify the same placed object. */
  protected sameKey(a: Key, b: Key) {
    return (a as unknown) === (b as unknown)
  }

  private createDeleteButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = pointer => {
      if (this.selected !== null) this.remove(this.selected)
      this.handleGhost(pointer)
    }

    return add
      .fab(0, 0, "delete-icon", 0xff0000, 0xc0392b)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  private createRotateButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      if (this.selected !== null) this.rotate(this.selected)
    }

    return add
      .fab(0, 0, "rotate-right-icon", 0x2196f3, 0x1565c0)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  /** Updates the rotation while the free-rotate handle is held and dragged. */
  private onFreeRotatePointerMove: Phaser.Input.Events.PointerMove =
    pointer => {
      if (!this.freeRotateDrag || this.selected === null) return
      const placed = this.getPlaced(this.selected)
      if (!placed) return

      const { pivot, startAngleDeg, startPointerAngleDeg } = this.freeRotateDrag
      const pointerAngleDeg = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(
          pivot.x,
          pivot.y,
          pointer.worldX,
          pointer.worldY,
        ),
      )

      this.setFreeRotation(
        this.selected,
        startAngleDeg + (pointerAngleDeg - startPointerAngleDeg),
      )
      this.positionButtonStack(placed)
    }

  /** Ends an in-progress free-rotate drag, if any. */
  private endFreeRotateDrag = () => {
    if (!this.freeRotateDrag) return
    this.freeRotateDrag = null
    this.setIsDragging(false)
    this.level.input.off(
      Phaser.Input.Events.POINTER_MOVE,
      this.onFreeRotatePointerMove,
    )
    this.level.input.off(Phaser.Input.Events.POINTER_UP, this.endFreeRotateDrag)
    this.level.input.off(Phaser.Input.Events.GAME_OUT, this.endFreeRotateDrag)
  }

  private createFreeRotateButton({ add, input }: Level) {
    const onPointerDown: Phaser.Input.Events.GameObjectPointerDown =
      pointer => {
        if (this.selected === null) return
        const placed = this.getPlaced(this.selected)
        if (!placed) return

        const bounds = placed.obj.getBounds()
        const pivot = { x: bounds.centerX, y: bounds.centerY }
        this.freeRotateDrag = {
          pivot,
          startAngleDeg: placed.obj.angle,
          startPointerAngleDeg: Phaser.Math.RadToDeg(
            Phaser.Math.Angle.Between(
              pivot.x,
              pivot.y,
              pointer.worldX,
              pointer.worldY,
            ),
          ),
        }
        this.setIsDragging(true)
        input.on(Phaser.Input.Events.POINTER_MOVE, this.onFreeRotatePointerMove)
        input.on(Phaser.Input.Events.POINTER_UP, this.endFreeRotateDrag)
        input.on(Phaser.Input.Events.GAME_OUT, this.endFreeRotateDrag)
      }

    return add
      .fab(0, 0, "three-sixty-icon", 0x2196f3, 0x1565c0)
      .on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
  }

  private createCancelButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      this.deselect()
    }

    return add
      .fab(0, 0, "clear-icon", 0x8d8d8d, 0x717171)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  /** Positions the button stack under the placed object's current bounds. */
  private positionButtonStack(placed: Placed<ID, VariantKey>) {
    // Use the axis-aligned world bounds so the buttons don't rotate with
    // the placed object.
    const bounds = placed.obj.getBounds()

    this.button.stack.setPosition(
      bounds.centerX - this.button.stack.displayWidth / 2,
      bounds.bottom + BUTTON_STACK_MARGIN + this.button.stack.displayHeight / 2,
    )
  }

  protected select(key: Key) {
    if (this.selected !== null && this.sameKey(this.selected, key)) return
    this.deselect()
    this.selected = key
    this.highlightSelection(key)

    const placed = this.getPlaced(key)
    if (!placed) return

    const validKeys = this.validVariantKeys(key, placed.id)
    this.button.rotate.setVisible(validKeys.length > 1)
    this.button.freeRotate.setVisible(this.supportsFreeRotation(key, placed.id))

    this.positionButtonStack(placed)
    this.button.stack.setVisible(true)
  }

  protected deselect() {
    if (this.selected === null) return
    this.endFreeRotateDrag()
    const key = this.selected
    this.selected = null
    this.clearSelectionHighlight(key)
    this.button.stack.setVisible(false)
  }
}
