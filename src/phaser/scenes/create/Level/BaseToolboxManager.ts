import type Level from "."

export default abstract class BaseToolboxManager {
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
}
