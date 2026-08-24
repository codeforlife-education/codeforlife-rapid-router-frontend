import Phaser from "phaser"

import {
  type FactoryObject,
  type ID,
  type Name,
  getDepth,
  getFlipX,
  getFlipY,
} from "../layers/objectGroup/objects"

Phaser.GameObjects.Image.prototype.getRelativeBounds = function (
  this: Phaser.GameObjects.Image,
  x: number,
  y: number,
): Phaser.Geom.Rectangle {
  // Reuse the real (rotation-aware) getBounds() rather than a hand-rolled
  // unrotated rect, so a hypothetical position still respects the current
  // angle.
  const { x: origX, y: origY } = this
  this.setPosition(x, y)
  const bounds = this.getBounds()
  this.setPosition(origX, origY)
  return bounds
}

Phaser.GameObjects.Image.prototype.rotateAboutCenter = function (
  this: Phaser.GameObjects.Image,
  angleDeg: number,
): typeof this {
  // A rectangle's rotated AABB is always centered on its true geometric
  // center, regardless of origin, so this needs no manual trigonometry.
  const center = this.getBounds()
  this.setAngle(angleDeg)
  const drifted = this.getBounds()
  return this.setPosition(
    this.x + (center.centerX - drifted.centerX),
    this.y + (center.centerY - drifted.centerY),
  )
}

Phaser.GameObjects.Image.prototype.asTiledObject = function (
  this: Phaser.GameObjects.Image,
  obj: FactoryObject<Name, ID>,
): typeof this {
  // Set the below properties to match the values of a tile[map]-object.
  return this.setOrigin(0, 1)
    .setPosition(obj.x, obj.y)
    .setName(obj.name)
    .setAngle(obj.rotation)
    .setVisible(obj.visible)
}

Phaser.GameObjects.Image.prototype.setRequiredProperties = function (
  this: Phaser.GameObjects.Image,
  id: ID | Name = this.name,
): typeof this {
  return (
    this
      // Set the display size to the real size of the image to maintain its
      // aspect ratio.
      .setDisplaySize(this.frame.realWidth, this.frame.realHeight)
      // Tile[map]-objects don't support these properties, so we set them
      // based on their globally registered values.
      .setDepth(getDepth(id))
      .setFlipX(getFlipX(id))
      .setFlipY(getFlipY(id))
  )
}
