import Phaser from "phaser"

import { getDepth, getFlipX, getFlipY } from "../layers/objectGroup/objects"

Phaser.GameObjects.Image.prototype.getRelativeTopLeft = function (
  this: Phaser.GameObjects.Image,
  x: number,
  y: number,
): Phaser.Types.Math.Vector2Like {
  return {
    x: x - this.displayWidth * this.originX,
    y: y - this.displayHeight * this.originY,
  }
}

Phaser.GameObjects.Image.prototype.getRelativeBounds = function (
  this: Phaser.GameObjects.Image,
  x: number,
  y: number,
): Phaser.Geom.Rectangle {
  const topLeft = this.getRelativeTopLeft(x, y)
  return new Phaser.Geom.Rectangle(
    topLeft.x,
    topLeft.y,
    this.displayWidth,
    this.displayHeight,
  )
}

Phaser.GameObjects.Image.prototype.setRequiredProperties = function (
  this: Phaser.GameObjects.Image,
): typeof this {
  return (
    this
      // Set the display size to the real size of the image to maintain its
      // aspect ratio.
      .setDisplaySize(this.frame.realWidth, this.frame.realHeight)
      // Tile[map]-objects don't support these properties, so we set them
      // based on their globally registered values.
      .setDepth(getDepth(this.name))
      .setFlipX(getFlipX(this.name))
      .setFlipY(getFlipY(this.name))
  )
}
