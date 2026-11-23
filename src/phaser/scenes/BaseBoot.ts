import * as images from "../images"
import { LOGO_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../globals"
import BaseScene from "./BaseScene"
import type { TilemapGroup } from "../tilemaps"
import pythonDenLogo from "../../images/logos/pd.svg?url"
import rapidRouterLogo from "../../images/logos/rr.svg?url"

export default class BaseBoot<
  Data extends object | undefined = undefined,
> extends BaseScene<Data> {
  preload() {
    // Load any assets required for the Preloader Scene here.

    // The logo shown above the loading bar - Python Den's for its levels, and
    // Rapid Router's otherwise (including custom levels and the level
    // creator). The level's group is set before any scene starts.
    // Each SVG's size comes from its viewBox; it's rendered at LOGO_WIDTH so
    // it stays sharp.
    const { url, width, height } =
      this.getVariable<TilemapGroup>("tilemapGroup") === "pythonDen"
        ? { url: pythonDenLogo, width: 157.44, height: 112.02 }
        : { url: rapidRouterLogo, width: 180, height: 120 }
    const scale = LOGO_WIDTH / width
    this.load.svg("logo", url, {
      width: width * scale,
      height: height * scale,
    })

    const background = images.URLs.Background.GRASS
    this.load.svg(background, background, {
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
    })
  }
}
