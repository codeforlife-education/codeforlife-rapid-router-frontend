import Phaser from "phaser"

import type { FactoryObject, ID, Name } from "../layers/objectGroup/objects"
import FloatingActionButton from "./FloatingActionButton"
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
  "imageFromTiledObject",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    obj: FactoryObject<Name, ID>,
  ): Phaser.GameObjects.Image {
    const tileset = getTileset(obj.gid)
    if (!tileset) throw new Error(`No tileset found for ID ${obj.gid}`)

    return (
      this.image(obj.x, obj.y, tileset.name)
        // Set the below properties to match the default values for
        // tile[map]-objects.
        .setOrigin(0, 1)
        .setName(obj.name)
        .setAngle(obj.rotation)
        .setVisible(obj.visible)
    )
  },
)
