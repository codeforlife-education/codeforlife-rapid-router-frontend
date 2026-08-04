import Phaser from "phaser"

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
