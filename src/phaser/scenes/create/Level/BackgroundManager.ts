import Phaser from "phaser"

import * as images from "../../../images"
import { Events, TILE_HEIGHT, TILE_WIDTH, Variables } from "../../../globals"
import BaseToolboxManager from "./BaseToolboxManager"
import type { default as Level } from "."

type Tool = Phaser.Types.Scenes.Create.Toolbox.Background["tool"]

export default class extends BaseToolboxManager<Tool> {
  constructor(level: Level) {
    super(level)

    const onReactSetVariable: Phaser.Events.ReactSetVariable = (...args) =>
      this.onReactSetVariable(...args)
    level.game.events.on(Events.REACT_SET_VARIABLE, onReactSetVariable)

    level.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      level.game.events.off(Events.REACT_SET_VARIABLE, onReactSetVariable)
    })
  }

  protected get box() {
    return "background" as const
  }

  /**
   * Sets the level's background, loading its texture first if it hasn't been
   * loaded yet (only the level's own background is preloaded, so switching to
   * a different one may need a fresh load).
   */
  private setBackground(key: Tool) {
    const url = images.URLs.Background[key]
    if (this.level.textures.exists(key)) {
      this.level.backgroundTileSprite.setTexture(key)
      return
    }

    this.level.load.svg(key, url, { width: TILE_WIDTH, height: TILE_HEIGHT })
    this.level.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.level.backgroundTileSprite.setTexture(key)
    })
    this.level.load.start()
  }

  private onReactSetVariable: Phaser.Events.ReactSetVariable = key => {
    if (key !== Variables.TOOLBOX) return

    const tool = this.tool
    if (tool !== null) this.setBackground(tool)
  }
}
