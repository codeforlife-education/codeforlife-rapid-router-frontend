import Phaser from "phaser"

import * as objects from "../layers/objectGroup/objects"

export default class extends Phaser.GameObjects.Container {
  readonly radius: number
  readonly backgroundColorOut: number
  readonly backgroundColorOver: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    iconTexture: string,
    backgroundColorOut: number,
    backgroundColorOver: number,
    {
      // Place above all scenery objects.
      depth = Math.max(...Object.values(objects.Depths)) + 1,
      iconMargin = 4,
    }: Phaser.Types.GameObjects.FloatingActionButton.Options = {},
  ) {
    const icon = scene.add.image(0, 0, iconTexture)
    const radius = icon.displayHeight / 2 + iconMargin
    const background = scene.add.circle(0, 0, radius, backgroundColorOut)

    super(scene, x, y, [background, icon])

    this.radius = radius
    this.backgroundColorOut = backgroundColorOut
    this.backgroundColorOver = backgroundColorOver

    this.setInteractive()
      .setDepth(depth)
      .on(Phaser.Input.Events.POINTER_OVER, this.onPointerOver)
      .on(Phaser.Input.Events.POINTER_OUT, this.onPointerOut)
  }

  get background() {
    return this.getAt<Phaser.GameObjects.Arc>(0)
  }

  get icon() {
    return this.getAt<Phaser.GameObjects.Image>(1)
  }

  onPointerOver: Phaser.Input.Events.GameObjectPointerOver = () =>
    this.background.setFillStyle(this.backgroundColorOver)

  onPointerOut: Phaser.Input.Events.GameObjectPointerOut = () =>
    this.background.setFillStyle(this.backgroundColorOut)

  setInteractive({
    cursor = "pointer",
    ...config
  }: Phaser.Types.Input.InputConfigurationWithoutHitArea = {}) {
    return super.setInteractive({
      hitArea: new Phaser.Geom.Circle(0, 0, this.radius),
      hitAreaCallback: (shape: Phaser.Geom.Circle, px: number, py: number) =>
        Phaser.Geom.Circle.Contains(shape, px, py),
      cursor,
      ...config,
    })
  }
}
