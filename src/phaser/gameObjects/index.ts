import Phaser from "phaser"

import Button from "./Button"
import CustomGraphics from "./CustomGraphics"
import FloatingActionButton, { type FabButtonDef } from "./FloatingActionButton"

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
  "floatingActionButton",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    radius: number,
    buttons: FabButtonDef[],
    defaultButtonIndex?: number,
  ): Phaser.GameObjects.FloatingActionButton {
    return this.scene.add.existing(
      new FloatingActionButton(
        this.scene,
        x,
        y,
        radius,
        buttons,
        defaultButtonIndex,
      ),
    )
  },
)
