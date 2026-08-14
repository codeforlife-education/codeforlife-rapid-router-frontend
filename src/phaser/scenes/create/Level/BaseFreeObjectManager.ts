import Phaser from "phaser"

import * as layers from "../../../layers"
import * as objects from "../../../layers/objectGroup/objects"
import BaseObjectGroupLayerManager, {
  type Placed,
} from "./BaseObjectGroupLayerManager"
import { Events, Variables } from "../../../globals"
import type { default as Level } from "."

type Drag = {
  obj: Phaser.GameObjects.Image
  start: { x: number; y: number }
  listeners: { on: () => void; off: () => void }
}

/**
 * Shared logic for tools that place objects freely (not snapped to a tile),
 * dragged via Phaser's native object dragging, that must not overlap roads,
 * endpoints, or each other. Subclasses currently only ever have a single
 * variant per id (no rotation), but that's kept overridable for the future.
 */
export default abstract class BaseFreeObjectManager<
  Name extends objects.Name,
  ID extends objects.ID,
  VariantKey extends string,
> extends BaseObjectGroupLayerManager<
  ID,
  VariantKey,
  Phaser.GameObjects.Image
> {
  /** The currently dragged object. */
  private drag: Drag | null = null

  /** The semi-transparent preview image. */
  private ghost: { obj: Phaser.GameObjects.Image; id: ID } | null = null

  /** Maps each placed object to the id it was created from. */
  private readonly objectIds = new WeakMap<Phaser.GameObjects.Image, ID>()

  constructor(level: Level) {
    super(level)

    this.registerEventListeners(level)
  }

  private registerEventListeners({ game, input, events }: Level) {
    const onAddRoad: Phaser.Events.AddRoad = (...args) =>
      this.onAddRoad(...args)
    game.events.on(Events.ADD_ROAD, onAddRoad)

    const onAddEndpoint: Phaser.Events.AddEndpoint = (...args) =>
      this.onAddEndpoint(...args)
    game.events.on(Events.ADD_ENDPOINT, onAddEndpoint)

    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)

    // Phaser fires the scene-level POINTER_DOWN with currentlyOver BEFORE the
    // individual game-object POINTER_DOWN events, so we can inspect what is
    // under the cursor here without needing a separate flag.
    const onPointerDown: Phaser.Input.Events.PointerDown<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerDown(...args)
    input.on(Phaser.Input.Events.POINTER_DOWN, onPointerDown)

    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = (...args) => this.onPointerMove(...args)
    input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)

    const onGameOut: Phaser.Input.Events.GameOut = (...args) =>
      this.onGameOut(...args)
    input.on(Phaser.Input.Events.GAME_OUT, onGameOut)

    events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      game.events.off(Events.ADD_ROAD, onAddRoad)
      game.events.off(Events.ADD_ENDPOINT, onAddEndpoint)
      game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
      input.off(Phaser.Input.Events.POINTER_DOWN, onPointerDown)
      input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
      input.off(Phaser.Input.Events.GAME_OUT, onGameOut)
    })
  }

  /** The layer this manager's placed objects live on. */
  protected abstract get layerName(): layers.objectGroup.Name

  /** The maximum number of objects that can be placed. */
  protected abstract get maxLength(): number

  /** Returns the object factory for the given id, if any. */
  protected abstract getFactory(
    id: ID,
  ):
    | ((kwArgs: { x: number; y: number }) => objects.FactoryObject<Name, ID>)
    | undefined

  /** Called whenever an object is placed or removed. */
  protected onPlacedCountChange(): void {}

  /** Every object currently placed on this manager's layer. */
  protected get placedObjects() {
    return this.level.layers[this.layerName]
  }

  private get endpoints() {
    return this.level.layers["ObjectGroup.ENDPOINTS"]
  }

  protected getPlaced(
    key: Phaser.GameObjects.Image,
  ): Placed<ID, VariantKey> | null {
    const id = this.objectIds.get(key)
    return id === undefined
      ? null
      : { id, variantKey: "" as VariantKey, obj: key }
  }

  /** Free objects currently only ever have a single (unnamed) variant. */
  protected validVariantKeys(): VariantKey[] {
    return ["" as VariantKey]
  }

  /** There's nothing to rotate to while there's only 1 variant per id. */
  protected rotate() {}

  /** Free objects can always be rotated to any angle via the free-rotate handle. */
  protected override supportsFreeRotation() {
    return true
  }

  protected override setFreeRotation(
    obj: Phaser.GameObjects.Image,
    angleDeg: number,
  ) {
    obj.rotateAboutCenter(angleDeg)
  }

  protected highlightSelection(obj: Phaser.GameObjects.Image) {
    obj.setTint(0xaaddff)
  }

  protected clearSelectionHighlight(obj: Phaser.GameObjects.Image) {
    obj.clearTint()
  }

  /** Check if `obj` is overlapping an endpoint. */
  private isOverlappingEndpoint(
    obj: Phaser.GameObjects.Image,
    endpoint: Phaser.GameObjects.Image,
    bounds = obj.getBounds(),
  ) {
    return (
      obj !== endpoint &&
      Phaser.Geom.Rectangle.Overlaps(bounds, endpoint.getBounds())
    )
  }

  /** Check if `obj1` can overlap `obj2`. */
  private canOverlapPlacedObject(
    obj1: Phaser.GameObjects.Image,
    obj2: Phaser.GameObjects.Image,
    obj1Bounds = obj1.getBounds(),
  ) {
    if (obj1 === obj2) return true

    const obj2Bounds = obj2.getBounds()

    // The centre of one object can never be inside the bounds of another.
    if (obj2Bounds.contains(obj1Bounds.centerX, obj1Bounds.centerY))
      return false

    // The bounds of the objects don't overlap - no need for further checks.
    if (!Phaser.Geom.Rectangle.Overlaps(obj1Bounds, obj2Bounds)) return true

    // 2 objects that are both below ground can't overlap.
    if (
      obj1.depth === objects.Depths.BELOW_GROUND &&
      obj2.depth === objects.Depths.BELOW_GROUND
    )
      return false

    // A solid object can't overlap another object unless one is above ground
    // and the other is below ground.
    if (
      (objects.getDensity(obj1.name) === objects.Densities.SOLID ||
        objects.getDensity(obj2.name) === objects.Densities.SOLID) &&
      !(
        (obj1.depth === objects.Depths.BELOW_GROUND &&
          obj2.depth === objects.Depths.ABOVE_GROUND) ||
        (obj1.depth === objects.Depths.ABOVE_GROUND &&
          obj2.depth === objects.Depths.BELOW_GROUND)
      )
    )
      return false

    return true // The objects are allowed to overlap.
  }

  private isOverlappingPlacedObject(obj: Phaser.GameObjects.Image): boolean
  private isOverlappingPlacedObject(
    obj: Phaser.GameObjects.Image,
    x: number,
    y: number,
  ): boolean
  /** Check if `obj` is overlapping any other placed object. */
  private isOverlappingPlacedObject(
    obj: Phaser.GameObjects.Image,
    x = obj.x,
    y = obj.y,
  ) {
    const bounds = obj.getRelativeBounds(x, y)

    return (
      // Check if the object overlaps any other placed object.
      this.placedObjects.some(
        o => !this.canOverlapPlacedObject(obj, o, bounds),
      ) ||
      // Check if the object overlaps any endpoint object.
      this.endpoints.some(e => this.isOverlappingEndpoint(obj, e, bounds))
    )
  }

  /** Check if `obj` is overlapping a road tile. */
  private isOverlappingRoad(
    obj: Phaser.GameObjects.Image,
    x: number,
    y: number,
  ) {
    const bounds = obj.getRelativeBounds(x, y)

    const tiles = this.level.tilemap.getTilesWithinWorldXY(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      { isNotEmpty: true },
      undefined,
      layers.Names.Tile.ROAD,
    )

    return !!tiles && tiles.length > 0
  }

  private add(
    worldX: number,
    worldY: number,
    id: ID,
  ): Phaser.GameObjects.Image | null {
    if (this.placedObjects.length >= this.maxLength) return null

    const factory = this.getFactory(id)
    if (!factory) return null

    let obj = this.level
      .addObject(this.layerName, factory({ x: 0, y: 0 }))
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .setPosition(worldX, worldY)

    this.objectIds.set(obj, id)
    this.onPlacedCountChange()

    const onDragStart: Phaser.Input.Events.GameObjectDragStart = () => {
      this.claimToolbox(id)
      this.startDrag(obj, {
        on: () => {
          obj
            .on(Phaser.Input.Events.DRAG, onDrag)
            .on(Phaser.Input.Events.DRAG_END, onDragEnd)
        },
        off: () => {
          obj
            .off(Phaser.Input.Events.DRAG, onDrag)
            .off(Phaser.Input.Events.DRAG_END, onDragEnd)
        },
      })
    }

    const onDrag: Phaser.Input.Events.GameObjectDrag = (_, dragX, dragY) =>
      this.dragTo(obj, dragX, dragY)

    const onDragEnd: Phaser.Input.Events.GameObjectDragEnd = () =>
      this.endDrag(obj)

    const onPointerOver: Phaser.Input.Events.GameObjectPointerOver = () => {
      if (this.level.isDragging) return
      this.level.input.setDefaultCursor("grab")
    }

    const onPointerOut: Phaser.Input.Events.GameObjectPointerOut = () => {
      if (this.level.isDragging) return
      this.level.input.setDefaultCursor("default")
    }

    const onPointerUp: Phaser.Input.Events.GameObjectPointerUp = () => {
      this.claimToolbox(id)
      this.select(obj)
    }

    obj = obj
      .on(Phaser.Input.Events.DRAG_START, onDragStart)
      .on(Phaser.Input.Events.POINTER_OVER, onPointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, onPointerOut)
      .on(Phaser.Input.Events.POINTER_UP, onPointerUp)

    this.level.input.setDraggable(obj)

    return obj
  }

  protected remove(obj: Phaser.GameObjects.Image) {
    if (this.selected && this.sameKey(this.selected, obj)) this.deselect()
    this.level.destroyObject(this.layerName, obj)
    this.onPlacedCountChange()
  }

  /** Begin dragging the given object from its current position. */
  private startDrag(
    obj: Phaser.GameObjects.Image,
    listeners: Drag["listeners"],
  ) {
    this.drag = { obj, start: { x: obj.x, y: obj.y }, listeners }
    this.setIsDragging(true)
    this.level.input.setDefaultCursor("grabbing")
    obj.setScale(1.1)
    this.deselect()
    listeners.on()
  }

  /**
   * Move the dragged object to the given position, snapping back to where the
   * drag started if the position is invalid.
   */
  private dragTo(obj: Phaser.GameObjects.Image, dragX: number, dragY: number) {
    if (!this.drag) return

    const [x, y, cursor] =
      this.isOverlappingPlacedObject(obj, dragX, dragY) ||
      this.isOverlappingRoad(obj, dragX, dragY)
        ? [this.drag.start.x, this.drag.start.y, "not-allowed"]
        : [dragX, dragY, "grabbing"]

    obj.setPosition(x, y)
    this.level.input.setDefaultCursor(cursor)
  }

  /** Stop dragging the given object. */
  private endDrag(obj: Phaser.GameObjects.Image) {
    if (!this.drag) return

    this.drag.listeners.off()
    this.drag = null
    this.setIsDragging(false)
    this.level.input.setDefaultCursor("grab")
    obj.setScale(1)
  }

  /**
   * Phaser only starts its own drag tracking for objects that were already
   * interactive when the pointer went down, so a just-placed object won't be
   * picked up automatically. If the pointer is still held after placing an
   * object, drive the same drag behaviour manually until it's released.
   */
  private dragNewObject(obj: Phaser.GameObjects.Image) {
    const onPointerMove: Phaser.Input.Events.PointerMove<
      Phaser.GameObjects.Image
    > = pointer => this.dragTo(obj, pointer.worldX, pointer.worldY)

    const onPointerUp: Phaser.Input.Events.PointerUp<
      Phaser.GameObjects.Image
    > = () => this.endDrag(obj)

    this.startDrag(obj, {
      on: () => {
        this.level.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
        this.level.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp)
      },
      off: () => {
        this.level.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove)
        this.level.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp)
      },
    })
  }

  private createGhost(id: ID) {
    if (this.ghost?.id === id) return
    this.destroyGhost()

    this.ghost = {
      id,
      obj: this.level.add
        .imageFromTileset(0, 0, id)
        .setOrigin(0.5, 0.5)
        .setAlpha(0.5)
        .setVisible(false),
    }
  }

  protected handleGhost(
    pointer?: Phaser.Input.Pointer,
    currentlyOver: Phaser.GameObjects.Image[] = pointer
      ? (this.level.input.hitTestPointer(pointer) as Phaser.GameObjects.Image[])
      : [],
  ) {
    if (!this.ghost) return

    // Directly over an existing object or dragging an object.
    if (!pointer || currentlyOver.length > 0 || this.drag) {
      this.ghost.obj.setVisible(false)
      return
    }

    // Defer to whichever manager owns this tile's grabbable object (it
    // independently shows its own "grab" cursor) rather than clobbering it
    // with "not-allowed". This doesn't apply to a tile that's merely one of
    // an endpoint's crossover tiles, since those aren't grabbable themselves
    // - overlapping the endpoint there is still checked below.
    const nearestTile = this.level.worldToNearestTile(
      pointer.worldX,
      pointer.worldY,
    )
    if (nearestTile && this.level.isTileGrabbable(nearestTile)) {
      this.ghost.obj.setVisible(false)
      return
    }

    // Indirectly over an existing object or road tile.
    if (
      this.placedObjects.length >= this.maxLength ||
      this.isOverlappingPlacedObject(
        this.ghost.obj,
        pointer.worldX,
        pointer.worldY,
      ) ||
      this.isOverlappingRoad(this.ghost.obj, pointer.worldX, pointer.worldY)
    ) {
      this.ghost.obj.setVisible(false)
      this.level.input.setDefaultCursor("not-allowed")
      return
    }

    this.ghost.obj.setPosition(pointer.worldX, pointer.worldY).setVisible(true)
    this.level.input.setDefaultCursor("grabbing")
  }

  private destroyGhost() {
    this.ghost?.obj.destroy()
    this.ghost = null
  }

  private onPointerDown: Phaser.Input.Events.PointerDown<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      const tool = this.tool
      if (tool === null) return

      // Don't interfere while another manager is mid-drag.
      if (this.level.isDragging) return

      // Clicking on any existing interactive object (this object, delete
      // button, …): let the individual object's events handle it.
      if (currentlyOver.length > 0) return

      // Only place if the ghost is visible, meaning the position is valid.
      if (!this.ghost?.obj.visible) return

      this.deselect()
      const obj = this.add(pointer.worldX, pointer.worldY, tool)

      // Seamlessly continue into a drag if the pointer is still held down.
      if (obj && pointer.isDown) this.dragNewObject(obj)
    }

  private onPointerMove: Phaser.Input.Events.PointerMove<Phaser.GameObjects.Image> =
    (pointer, currentlyOver) => {
      if (this.tool === null || this.level.isDragging) return
      this.handleGhost(pointer, currentlyOver)
    }

  /** Handle the pointer leaving the game canvas. */
  private onGameOut: Phaser.Input.Events.GameOut = () => {
    if (this.ghost) this.handleGhost()
    if (this.selected) this.deselect()
    if (this.drag) this.endDrag(this.drag.obj)
  }

  /** When a road is added, delete any overlapping placed objects. */
  private onAddRoad: Phaser.Events.AddRoad = ({ col, row }) => {
    const tile = this.level.tileToBounds({ col, row })
    if (!tile) return

    for (const obj of [...this.placedObjects]) {
      if (this.level.objectOverlapsTile(obj, tile)) this.remove(obj)
    }
  }

  private onAddEndpoint: Phaser.Events.AddEndpoint = ({ obj: endpoint }) => {
    for (const obj of [...this.placedObjects]) {
      if (this.isOverlappingEndpoint(obj, endpoint)) this.remove(obj)
    }
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
