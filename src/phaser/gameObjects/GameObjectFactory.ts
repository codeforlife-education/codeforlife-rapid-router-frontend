import Phaser from "phaser"

import FloatingActionButton from "./FloatingActionButton"
import type { ID } from "../layers/objectGroup/objects"
import Stack from "./Stack"
import { getTileset } from "../tilesets"

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

Phaser.GameObjects.GameObjectFactory.register(
  "imageFromTileset",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    tilesetId: ID,
  ): Phaser.GameObjects.Image {
    const tileset = getTileset(tilesetId)
    if (!tileset) throw new Error(`No tileset found for ID ${tilesetId}`)
    return this.image(x, y, tileset.name).setRequiredProperties(tilesetId)
  },
)

Phaser.GameObjects.GameObjectFactory.register(
  "stack",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    children: Phaser.GameObjects.GameObject[],
    options?: Phaser.Types.GameObjects.Stack.Options,
  ): Phaser.GameObjects.Stack {
    return this.scene.add.existing(
      new Stack(this.scene, x, y, children, options),
    )
  },
)
