import Phaser from "phaser"

import BaseObjectGroupLayerManager, {
  type Placed,
} from "./BaseObjectGroupLayerManager"
import { Events, Variables } from "../../../globals"
import type { default as Level } from "."
import type { objects } from "../../../layers/objectGroup"

export type { Placed }

/**
 * Shared logic for tools that place a single object per tile: ghost preview
 * and tile-to-tile drag. Subclasses plug in their own placement/collision
 * rules via the abstract hooks below.
 */
export default abstract class BaseRoadObjectManager<
  Name extends objects.Name,
  ID extends objects.ID,
  VariantKey extends string,
> extends BaseObjectGroupLayerManager<
  ID,
  VariantKey,
  Phaser.Types.Tilemaps.Tile
> {
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

  constructor(level: Level) {
    super(level)

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

  /** Places an object with the given id and variant onto the tile. */
  protected abstract place(
    tile: Phaser.Types.Tilemaps.Tile,
    id: ID,
    variantKey: VariantKey,
  ): void

  /** Exports every placed object as Tiled objects, keyed by their tile. */
  toTiledObjects(): objects.FactoryObject<Name, ID>[] {
    const result: objects.FactoryObject<Name, ID>[] = []

    for (let row = 0; row < this.level.tilemap.height; row++) {
      for (let col = 0; col < this.level.tilemap.width; col++) {
        const tile = { row, col }
        const placed = this.getPlaced(tile)
        if (!placed) continue

        const factory = this.getFactory(placed.id, placed.variantKey)
        if (factory) result.push(factory(tile))
      }
    }

    return result
  }

  protected sameKey(
    a: Phaser.Types.Tilemaps.Tile,
    b: Phaser.Types.Tilemaps.Tile,
  ) {
    return a.row === b.row && a.col === b.col
  }

  protected highlightSelection(tile: Phaser.Types.Tilemaps.Tile) {
    this.level.graphics.clear()
    this.level.highlightTile(tile, 0xaaddff)
  }

  protected clearSelectionHighlight() {
    this.level.graphics.clear()
  }

  /** Rotates the placed object on the given tile to its next valid facing. */
  protected rotate(tile: Phaser.Types.Tilemaps.Tile) {
    const placed = this.getPlaced(tile)
    if (!placed) return

    const validKeys = this.validVariantKeys(tile, placed.id)
    let index = validKeys.indexOf(placed.variantKey)
    index = index === -1 || ++index >= validKeys.length ? 0 : index

    this.remove(tile)
    this.place(tile, placed.id, validKeys[index])
    this.select(tile)
  }

  /** Road objects are only ever rotated between discrete facing variants. */
  protected supportsFreeRotation() {
    return false
  }

  protected startFreeRotateDrag() {}

  protected cancelFreeRotateDrag() {}

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
  protected handleGhost(pointer?: Phaser.Input.Pointer) {
    if (!this.ghost) return

    const tile = pointer
      ? this.level.worldToTile(pointer.worldX, pointer.worldY)
      : null

    if (!tile || !this.canPlace(tile, this.ghost.id)) {
      this.ghost.obj.setVisible(false)
      this.ghost.tile = undefined
      this.ghost.variantKey = undefined
      // Defer to whichever manager owns this tile's grabbable object (it
      // independently shows its own "grab" cursor) rather than clobbering it
      // with "not-allowed". This doesn't apply to a tile that's merely one of
      // an endpoint's crossover tiles, since those aren't grabbable themselves.
      if (pointer && !(tile && this.level.isTileGrabbable(tile))) {
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
      if (tile && this.getPlaced(tile) && this.level.toolbox?.box !== "road") {
        // My own placed object is always selectable/draggable, regardless of
        // whether my box is the active tool - but the road tool takes
        // priority over showing a "grab" cursor for an endpoint on the tile.
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
