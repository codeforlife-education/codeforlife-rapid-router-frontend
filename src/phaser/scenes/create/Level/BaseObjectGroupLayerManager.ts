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

  private readonly button: {
    /** The row of buttons shown below the selected object. */
    stack: Phaser.GameObjects.Stack
    /** The delete button shown in the button stack. */
    delete: Phaser.GameObjects.FloatingActionButton
    /** The rotate button shown in the button stack. */
    rotate: Phaser.GameObjects.FloatingActionButton
    /** The cancel button shown in the button stack. */
    cancel: Phaser.GameObjects.FloatingActionButton
  }

  /** The rotate button's tooltip, whose title depends on the rotation mode. */
  private readonly rotateTooltip: Phaser.GameObjects.Tooltip

  constructor(level: Level) {
    super(level)

    const deleteButton = this.createDeleteButton(level)
    const rotateButton = this.createRotateButton(level)
    const cancelButton = this.createCancelButton(level)
    this.button = {
      rotate: rotateButton,
      delete: deleteButton,
      cancel: cancelButton,
      stack: level.add
        .stack(0, 0, [cancelButton, rotateButton, deleteButton], {
          direction: "row",
          gap: BUTTON_GAP,
        })
        .setVisible(false),
    }

    // The tooltips must be created after the buttons are added to the stack
    // so that the tooltips can observe the stack's visibility.
    this.rotateTooltip = level.add.tooltip("Rotate", rotateButton)
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

  /** Whether `key` rotates to any angle (dragged) rather than between discrete variants (clicked). */
  protected abstract supportsFreeRotation(key: Key, id: ID): boolean

  /** Starts a free-rotate drag of `key`, driven by the given pointer. */
  protected abstract startFreeRotateDrag(
    key: Key,
    pointer: Phaser.Input.Pointer,
  ): void

  /** Cancels an in-progress free-rotate drag, if any. */
  protected abstract cancelFreeRotateDrag(): void

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

  /** Whether `key` currently rotates freely rather than between discrete variants. */
  private isFreeRotating(key: Key) {
    const placed = this.getPlaced(key)
    return placed !== null && this.supportsFreeRotation(key, placed.id)
  }

  private createRotateButton({ add }: Level) {
    const button = add.fab(0, 0, "rotate-right-icon", 0x2196f3, 0x1565c0)

    const onPointerDown: Phaser.Input.Events.GameObjectPointerDown =
      pointer => {
        if (this.selected !== null && this.isFreeRotating(this.selected))
          this.startFreeRotateDrag(this.selected, pointer)
      }

    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      // A free-rotating object is rotated by dragging (above), not clicking.
      if (this.selected !== null && !this.isFreeRotating(this.selected))
        this.rotate(this.selected)
    }

    return button
      .on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
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
  protected positionButtonStack(placed: Placed<ID, VariantKey>) {
    // Use the axis-aligned world bounds so the buttons don't rotate with
    // the placed object.
    const bounds = placed.obj.getBounds()

    this.button.stack.setPosition(
      bounds.centerX - this.button.stack.displayWidth / 2,
      bounds.bottom + BUTTON_STACK_MARGIN + this.button.stack.displayHeight / 2,
    )
  }

  /** Shows/hides the button stack, e.g. while a free-rotate drag is in progress. */
  protected setButtonStackVisible(visible: boolean) {
    this.button.stack.setVisible(visible)
  }

  protected select(key: Key) {
    if (this.selected !== null && this.sameKey(this.selected, key)) return
    this.deselect()
    this.selected = key
    this.highlightSelection(key)

    const placed = this.getPlaced(key)
    if (!placed) return

    const isFree = this.supportsFreeRotation(key, placed.id)
    const validKeys = this.validVariantKeys(key, placed.id)
    this.button.rotate.setVisible(isFree || validKeys.length > 1)
    this.button.rotate.icon.setTexture(
      isFree ? "three-sixty-icon" : "rotate-right-icon",
    )
    this.rotateTooltip.setText(isFree ? "Rotate freely" : "Rotate")

    this.positionButtonStack(placed)
    this.setButtonStackVisible(true)
  }

  protected deselect() {
    if (this.selected === null) return
    this.cancelFreeRotateDrag()
    const key = this.selected
    this.selected = null
    this.clearSelectionHighlight(key)
    this.setButtonStackVisible(false)
  }
}
