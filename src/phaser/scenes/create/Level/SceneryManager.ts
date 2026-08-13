import * as objects from "../../../layers/objectGroup/objects"
import type * as tilesets from "../../../tilesets"
import BaseFreeObjectManager from "./BaseFreeObjectManager"
import type { default as Level } from "."

export default class extends BaseFreeObjectManager<
  objects.scenery.Name,
  tilesets.scenery.ID,
  ""
> {
  constructor(level: Level) {
    super(level)

    level.setVariable("sceneryObjectCount", this.placedObjects.length)
    level.setVariable("maxSceneryObjectCount", this.maxLength)
  }

  protected get box() {
    return "scenery" as const
  }

  protected get layerName() {
    return "ObjectGroup.SCENERY" as const
  }

  /** The maximum number of scenery objects that can be added to the level. */
  protected get maxLength() {
    return 50
  }

  protected getFactory(id: tilesets.scenery.ID) {
    return objects.getFactory<
      objects.scenery.Name,
      tilesets.scenery.ID,
      "" // TODO: support rotating scenery objects by adding variants.
    >(id)
  }

  protected onPlacedCountChange() {
    this.level.setVariable("sceneryObjectCount", this.placedObjects.length)
  }
}
