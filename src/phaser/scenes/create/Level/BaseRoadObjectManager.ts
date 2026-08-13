import Phaser from "phaser"

import { Events, Variables } from "../../../globals"
import BaseToolboxManager from "./BaseToolboxManager"
import type { default as Level } from "."
import type { objects } from "../../../layers/objectGroup"

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
 * Shared logic for tools that place a single object per tile: ghost preview,
 * tile-to-tile drag, selection, and a delete/rotate button stack. Subclasses
 * plug in their own placement/collision rules via the abstract hooks below.
 */
export default abstract class BaseRoadObjectManager<
  Name extends objects.Name,
  ID extends objects.ID,
  VariantKey extends string,
> extends BaseToolboxManager {
  /** The tile of the currently selected placed object. */
  protected selected: Phaser.Types.Tilemaps.Tile | null = null

  private drag: {
    /** The tile the object is currently being dragged from. */
    tile: Phaser.Types.Tilemaps.Tile
    /** The id of the object currently being dragged. */
    id: ID
    /** The original variant key of the object currently being dragged. */
    originalVariantKey: VariantKey
  } | null = null

  private ghost: {
    /** The id of the object currently being previewed. */
    id: ID
    /** The semi-transparent preview image. */
    obj: Phaser.GameObjects.Image
    /** The tile the ghost is currently snapped/positioned to. */
    tile?: Phaser.Types.Tilemaps.Tile
    /** The variant key the ghost is currently showing. */
    variantKey?: VariantKey
  } | null = null

  private readonly button: {
    /** The row of buttons shown below the selected object. */
    stack: Phaser.GameObjects.Stack
    /** The delete button shown in the button stack. */
    delete: Phaser.GameObjects.FloatingActionButton
    /** The rotate button shown in the button stack. */
    rotate: Phaser.GameObjects.FloatingActionButton
  }

  constructor(level: Level) {
    super(level)

    const deleteButton = this.createDeleteButton(level)
    const rotateButton = this.createRotateButton(level)
    this.button = {
      rotate: rotateButton,
      delete: deleteButton,
      stack: this.level.add
        .stack(0, 0, [rotateButton, deleteButton], {
          direction: "row",
          gap: BUTTON_GAP,
        })
        .setVisible(false),
    }

    // WARN: The tooltips must be created after the buttons are added to the
    // stack so that the tooltips can observe the stack's visibility.
    level.add.tooltip("Rotate", rotateButton)
    level.add.tooltip("Delete", deleteButton)

    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)

    const onPointerDown: Phaser.Input.Events.PointerDown<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerDown(...args)
    level.input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerMove(...args)
    level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onPointerUp: Phaser.Input.Events.PointerUp = () => this.endDrag()
    level.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    const onPointerUpOutside: Phaser.Input.Events.PointerUpOutside = () =>
      this.endDrag()
    level.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, onPointerUpOutside)

    const onGameOut: Phaser.Input.Events.GameOut = (...args) =>
      this.onGameOut(...args)
    level.input.on(Phaser.Input.Events.GAME_OUT, onGameOut)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      level.input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      level.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      level.input.off(
        Phaser.Input.Events.POINTER_UP_OUTSIDE,
        onPointerUpOutside,
      )
      level.input.off(Phaser.Input.Events.GAME_OUT, onGameOut)
    })
  }

  /** The box (toolbox category) this manager owns, e.g. `"obstacles"`. */
  protected abstract get box(): Phaser.Types.Scenes.Create.Toolbox.Any["box"]

  /** The id currently selected in this manager's toolbox, or `null`. */
  protected get tool(): ID | null {
    return this.level.toolbox?.box === this.box
      ? (this.level.toolbox.tool as ID)
      : null
  }

  /** Checks if this manager has a placed object on the given tile. */
  isOccupied(tile: Phaser.Types.Tilemaps.Tile): boolean {
    return this.getPlaced(tile) !== null
  }

  /**
   * Switches the active toolbox to this manager's own box (if it isn't
   * already), so React mirrors the change and other managers deactivate.
   */
  private claimToolbox(id: ID) {
    if (this.tool === null)
      this.level.setVariable("toolbox", { box: this.box, tool: id })
  }

  /** Checks if the given id can be placed on the given tile. */
  protected abstract canPlace(tile: Phaser.Types.Tilemaps.Tile, id: ID): boolean

  /** Returns the tile-object factory for the given id and variant, if any. */
  protected abstract getFactory(
    id: ID,
    variantKey: VariantKey,
  ):
    | NonNullable<
        ReturnType<typeof objects.getFactory<Name, ID, VariantKey>>
      >[VariantKey]
    | undefined

  /** Returns the valid variant keys for the given tile and id. */
  protected abstract validVariantKeys(
    tile: Phaser.Types.Tilemaps.Tile,
    id: ID,
  ): VariantKey[]

  /** Places an object with the given id and variant onto the tile. */
  protected abstract place(
    tile: Phaser.Types.Tilemaps.Tile,
    id: ID,
    variantKey: VariantKey,
  ): void

  /** Removes the placed object from the given tile, if any. */
  protected abstract remove(tile: Phaser.Types.Tilemaps.Tile): void

  /** Returns the object placed at the given tile, if any. */
  protected abstract getPlaced(
    tile: Phaser.Types.Tilemaps.Tile,
  ): Placed<ID, VariantKey> | null

  private createDeleteButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = pointer => {
      if (this.selected) this.remove(this.selected)
      this.handleGhost(pointer)
    }

    return add
      .fab(0, 0, "delete-icon", 0xff0000, 0xc0392b)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  private createRotateButton({ add }: Level) {
    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      if (this.selected) this.rotate(this.selected)
    }

    return add
      .fab(0, 0, "rotate-right-icon", 0x2196f3, 0x1565c0)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)
  }

  protected sameTile(
    a: Phaser.Types.Tilemaps.Tile,
    b: Phaser.Types.Tilemaps.Tile,
  ) {
    return a.row === b.row && a.col === b.col
  }

  protected select(tile: Phaser.Types.Tilemaps.Tile) {
    if (this.selected && this.sameTile(this.selected, tile)) return
    this.deselect()
    this.selected = tile

    this.level.graphics.clear()
    this.level.highlightTile(tile, 0xaaddff)

    const placed = this.getPlaced(tile)
    if (!placed) return

    // Use the axis-aligned world bounds so the buttons don't rotate with
    // the placed object.
    const bounds = placed.obj.getBounds()

    const validKeys = this.validVariantKeys(tile, placed.id)
    this.button.rotate.setVisible(validKeys.length > 1)

    this.button.stack
      .setPosition(
        bounds.centerX - this.button.stack.displayWidth / 2,
        bounds.bottom +
          BUTTON_STACK_MARGIN +
          this.button.stack.displayHeight / 2,
      )
      .setVisible(true)
  }

  protected deselect() {
    if (!this.selected) return
    this.selected = null
    this.level.graphics.clear()
    this.button.stack.setVisible(false)
  }

  /** Rotates the placed object on the given tile to its next valid facing. */
  private rotate(tile: Phaser.Types.Tilemaps.Tile) {
    const placed = this.getPlaced(tile)
    if (!placed) return

    const validKeys = this.validVariantKeys(tile, placed.id)
    let index = validKeys.indexOf(placed.variantKey)
    index = index === -1 || ++index >= validKeys.length ? 0 : index

    this.remove(tile)
    this.place(tile, placed.id, validKeys[index])
    this.select(tile)
  }

  private createGhost(id: ID, alpha = 0.5) {
    if (this.ghost?.id === id) {
      this.ghost.obj.setAlpha(alpha)
      return
    }
    this.destroyGhost()

    this.ghost = {
      id,
      obj: this.level.add
        .imageFromTileset(0, 0, id)
        .setOrigin(0, 1)
        .setAlpha(alpha)
        .setVisible(false),
    }
  }

  /**
   * Position (and rotate) the ghost for the given tile, resolving the facing
   * variant from the tile's valid variant keys. Keeps `preferredVariantKey`
   * if it's still valid there, otherwise falls back to the first valid key.
   */
  private positionGhost(
    tile: Phaser.Types.Tilemaps.Tile,
    preferredVariantKey?: VariantKey,
  ) {
    if (!this.ghost) return

    const validKeys = this.validVariantKeys(tile, this.ghost.id)
    const variantKey =
      preferredVariantKey && validKeys.includes(preferredVariantKey)
        ? preferredVariantKey
        : validKeys[0]

    const factory = this.getFactory(this.ghost.id, variantKey)
    if (!factory) return
    const obj = factory(tile)

    this.ghost.obj.asTiledObject(obj)
    this.ghost.tile = tile
    this.ghost.variantKey = variantKey
  }

  private destroyGhost() {
    this.ghost?.obj.destroy()
    this.ghost = null
  }

  /** Show/hide and position the ghost based on the tile under the pointer. */
  private handleGhost(pointer?: Phaser.Input.Pointer) {
    if (!this.ghost) return

    const tile = pointer
      ? this.level.worldToTile(pointer.worldX, pointer.worldY)
      : null

    if (!tile || !this.canPlace(tile, this.ghost.id)) {
      this.ghost.obj.setVisible(false)
      this.ghost.tile = undefined
      this.ghost.variantKey = undefined
      // Defer to whichever manager owns this tile (it independently shows its
      // own "grab" cursor for its own placed objects) rather than clobbering
      // it with "not-allowed".
      if (pointer && !(tile && this.level.isTileOccupied(tile))) {
        this.level.input.setDefaultCursor(tile ? "not-allowed" : "default")
      }
      return
    }

    this.positionGhost(tile)
    this.ghost.obj.setVisible(true)
    // Show the ghost as if it's already being dragged into place.
    this.level.input.setDefaultCursor("grabbing")
  }

  /**
   * Begin dragging the object with the given id from the given tile. If an
   * object already occupies the tile, it's temporarily removed until the
   * drag ends.
   */
  private startDrag(tile: Phaser.Types.Tilemaps.Tile, id: ID) {
    const existing = this.getPlaced(tile)
    const originalVariantKey = existing
      ? existing.variantKey
      : this.validVariantKeys(tile, id)[0]

    if (existing) this.remove(tile)

    this.deselect()
    this.drag = { tile, id, originalVariantKey }
    this.setIsDragging(true)
    // Only a not-yet-placed object should look ghost-like while dragging.
    this.createGhost(id, existing ? 1 : 0.5)
    this.positionGhost(tile, originalVariantKey)
    this.ghost!.obj.setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  /** Finalize the current drag by placing the object at its final tile. */
  private endDrag() {
    if (!this.drag) return

    const { id, originalVariantKey } = this.drag
    const finalTile = this.ghost?.tile ?? this.drag.tile

    this.place(finalTile, id, this.ghost?.variantKey ?? originalVariantKey)

    this.drag = null
    this.setIsDragging(false)
    this.ghost!.tile = undefined
    this.ghost!.variantKey = undefined
    this.ghost!.obj.setVisible(false)

    const tool = this.tool
    if (tool !== null) this.createGhost(tool)
    else this.destroyGhost()

    this.select(finalTile)
    this.level.input.setDefaultCursor("grab")
  }

  private onPointerDown: Phaser.Input.Events.PointerDown<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      // Clicking on any existing interactive object (e.g. the delete button):
      // let the individual object's events handle it.
      if (currentlyOver.length > 0) return

      // Don't interfere while another manager is mid-drag.
      if (this.level.isDragging && !this.drag) return

      const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
      if (!tile) return

      // My own placed object is always selectable, regardless of whether my
      // box is the active tool - switch the toolbox to it first.
      const existing = this.getPlaced(tile)
      if (existing) {
        this.claimToolbox(existing.id)
        this.startDrag(tile, existing.id)
        return
      }

      const tool = this.tool
      if (tool !== null && this.ghost?.obj.visible) this.startDrag(tile, tool)
    }

  private onPointerMove: Phaser.Input.Events.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (this.drag) {
        const nearest = this.level.worldToNearestTile(
          pointer.worldX,
          pointer.worldY,
        )
        const valid = !!nearest && this.canPlace(nearest, this.drag.id)
        this.positionGhost(
          valid ? nearest : this.drag.tile,
          this.drag.originalVariantKey,
        )
        this.level.input.setDefaultCursor(valid ? "grabbing" : "not-allowed")
        return
      }

      // Don't interfere while another manager is mid-drag.
      if (this.level.isDragging) return

      // Directly over an existing interactive object (e.g. the delete button).
      if (currentlyOver.length > 0) {
        this.ghost?.obj.setVisible(false)
        return
      }

      const tile = this.level.worldToTile(pointer.worldX, pointer.worldY)
      if (tile && this.getPlaced(tile)) {
        // My own placed object is always selectable/draggable, regardless of
        // whether my box is the active tool.
        this.ghost?.obj.setVisible(false)
        this.level.input.setDefaultCursor("grab")
        return
      }

      if (this.tool === null) return
      this.handleGhost(pointer)
    }

  /** Handle the pointer leaving the game canvas. */
  private onGameOut: Phaser.Input.Events.GameOut = () => {
    if (this.ghost) this.handleGhost()
    if (this.drag) this.endDrag()
    if (this.selected) this.deselect()
  }

  private onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
    if (key !== Variables.TOOLBOX) return

    const tool = this.tool
    if (tool !== null) this.createGhost(tool)
    else {
      this.deselect()
      this.destroyGhost()
    }
  }
}
