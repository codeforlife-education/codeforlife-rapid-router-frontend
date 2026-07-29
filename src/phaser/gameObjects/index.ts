import Phaser from "phaser"

import "./Image"
import Button from "./Button"
import CustomGraphics from "./CustomGraphics"
import FloatingActionButton from "./FloatingActionButton"

Phaser.GameObjects.GameObjectFactory.register("button", Button)

Phaser.GameObjects.GameObjectFactory.register(
  "customGraphics",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
  ): Phaser.GameObjects.CustomGraphics {
    return this.scene.add.existing(new CustomGraphics(this.scene))
  },
)

Phaser.GameObjects.GameObjectFactory.register(
  "fab",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    iconTexture: string,
    backgroundColorOut: number,
    backgroundColorOver: number,
    options?: Phaser.Types.GameObjects.FloatingActionButton.Options,
  ): Phaser.GameObjects.FloatingActionButton {
    return this.scene.add.existing(
      new FloatingActionButton(
        this.scene,
        x,
        y,
        iconTexture,
        backgroundColorOut,
        backgroundColorOver,
        options,
      ),
    )
  },
)
