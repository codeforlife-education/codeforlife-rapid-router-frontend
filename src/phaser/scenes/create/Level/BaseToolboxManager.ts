import type Phaser from "phaser"

import type Level from "."

export default abstract class BaseToolboxManager<
  Tool extends string | number = string | number,
> {
  /** The level this manager belongs to. */
  protected readonly level: Level

  /** Whether this manager currently has an active drag in progress. */
  private dragging = false

  constructor(level: Level) {
    this.level = level
  }

  /** Whether this manager currently has an active drag in progress. */
  get isDragging() {
    return this.dragging
  }

  /** Marks whether this manager currently has an active drag in progress. */
  protected setIsDragging(isDragging: boolean) {
    this.dragging = isDragging
  }

  /** The box (toolbox category) this manager owns, e.g. `"obstacles"`. */
  protected abstract get box(): Phaser.Types.Scenes.Create.Toolbox.Any["box"]

  /** The tool currently selected in this manager's own box, or `null`. */
  protected get tool(): Tool | null {
    return this.level.toolbox?.box === this.box
      ? (this.level.toolbox.tool as Tool)
      : null
  }

  /**
   * Switches the active toolbox to this manager's own box (if it isn't
   * already), so React mirrors the change and other managers deactivate.
   */
  protected claimToolbox(tool: Tool) {
    if (this.tool === null)
      this.level.setVariable("toolbox", { box: this.box, tool })
  }
}
