import type Phaser from "phaser"

import BaseToolboxManager from "./BaseToolboxManager"

export default class extends BaseToolboxManager<
  Phaser.Types.Scenes.Create.Toolbox.Background["tool"]
> {
  protected get box() {
    return "background" as const
  }
}
