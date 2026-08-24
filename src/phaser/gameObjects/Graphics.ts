import Phaser from "phaser"

Phaser.GameObjects.Graphics.prototype.defaultArrowShaftStyle = {
  width: 2,
  color: 0xffffff,
  alpha: 1,
} as Phaser.Types.GameObjects.Graphics.RequiredLineStyle

Phaser.GameObjects.Graphics.prototype.defaultArrowHeadStyle = {
  color: 0xffffff,
  alpha: 1,
} as Phaser.Types.GameObjects.Graphics.RequiredFillStyle

Phaser.GameObjects.Graphics.prototype.defaultGridStyle = {
  width: 1,
  color: 0x000000,
  alpha: 1,
} as Phaser.Types.GameObjects.Graphics.RequiredLineStyle

const lineStyle = function (
  this: Phaser.GameObjects.Graphics,
  widthOrStyle: number | Phaser.Types.GameObjects.Graphics.RequiredLineStyle,
  color?: number,
  alpha?: number,
): typeof this {
  return typeof widthOrStyle === "number"
    ? this.lineStyle(widthOrStyle, color!, alpha)
    : this.lineStyle(widthOrStyle.width, widthOrStyle.color, widthOrStyle.alpha)
}

const fillStyle = function (
  this: Phaser.GameObjects.Graphics,
  colorOrStyle: number | Phaser.Types.GameObjects.Graphics.RequiredFillStyle,
  alpha?: number,
): typeof this {
  return typeof colorOrStyle === "number"
    ? this.fillStyle(colorOrStyle, alpha)
    : this.fillStyle(colorOrStyle.color, colorOrStyle.alpha)
}

Phaser.GameObjects.Graphics.prototype.arrow = function (
  this: Phaser.GameObjects.Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  headWidth: number,
  headHeight: number,
  shaftStyle: Phaser.Types.GameObjects.Graphics.RequiredLineStyle = this
    .defaultArrowShaftStyle,
  headStyle: Phaser.Types.GameObjects.Graphics.RequiredFillStyle = this
    .defaultArrowHeadStyle,
): typeof this {
  lineStyle.call(this, shaftStyle).lineBetween(x1, y1, x2, y2)

  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)

  // Line unit vector.
  const udx = dx / len
  const udy = dy / len

  // Perpendicular unit vector.
  const pdx = -udy
  const pdy = udx

  // Arrowhead base vertices.
  const x3 = x2 - headHeight * udx + headWidth * pdx
  const y3 = y2 - headHeight * udy + headWidth * pdy
  const x4 = x2 - headHeight * udx - headWidth * pdx
  const y4 = y2 - headHeight * udy - headWidth * pdy

  fillStyle.call(this, headStyle).fillTriangle(x2, y2, x3, y3, x4, y4)

  return this
}

Phaser.GameObjects.Graphics.prototype.grid = function (
  this: Phaser.GameObjects.Graphics,
  cols: number,
  rows: number,
  cellWidth: number,
  cellHeight: number,
  style: Phaser.Types.GameObjects.Graphics.RequiredLineStyle = this
    .defaultGridStyle,
): typeof this {
  // Set the line style for the grid lines.
  lineStyle.call(this, style)

  // Draw vertical lines.
  const gridHeight = rows * cellHeight
  for (let col = 0; col <= cols; col++) {
    const x = col * cellWidth
    this.moveTo(x, 0)
    this.lineTo(x, gridHeight)
  }

  // Draw horizontal lines.
  const gridWidth = cols * cellWidth
  for (let row = 0; row <= rows; row++) {
    const y = row * cellHeight
    this.moveTo(0, y)
    this.lineTo(gridWidth, y)
  }

  // Stroke the grid lines to render them on the scene.
  this.strokePath()

  return this
}
