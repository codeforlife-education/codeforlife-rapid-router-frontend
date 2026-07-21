import Phaser from "phaser"
import type { SvgIcon } from "@mui/material"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import "../gameObjects" // Register custom game objects.
import { TILE_HEIGHT, TILE_WIDTH } from "../globals"

type IconProps = Partial<{ width: number; height: number; color: string }>
const DEFAULT_ICON_WIDTH = TILE_WIDTH / 2
const DEFAULT_ICON_HEIGHT = TILE_HEIGHT / 2

export default class BaseScene<
  Data extends object | undefined = undefined,
> extends Phaser.Scene {
  static KEY: string

  initData!: Data

  constructor() {
    super(new.target.KEY)
  }

  init(data: Data) {
    this.initData = data
  }

  /** Converts a MUI icon to a data-URI string. */
  muiIconToDataUriString(
    icon: typeof SvgIcon,
    {
      width = DEFAULT_ICON_WIDTH,
      height = DEFAULT_ICON_HEIGHT,
      color = "white",
    }: IconProps = {},
  ) {
    const svg = renderToStaticMarkup(
      createElement(icon, {
        xmlns: "http://www.w3.org/2000/svg",
        width,
        height,
        fill: color,
      }),
    )

    const bytes = new TextEncoder().encode(svg)
    const binary = Array.from(bytes, b => String.fromCharCode(b)).join("")
    return `data:image/svg+xml;base64,${btoa(binary)}`
  }

  /** Converts a MUI icon to a CSS URL string. */
  muiIconToUrl(
    icon: typeof SvgIcon,
    {
      width = DEFAULT_ICON_WIDTH,
      height = DEFAULT_ICON_HEIGHT,
      ...iconProps
    }: IconProps = {},
  ) {
    const dataUri = this.muiIconToDataUriString(icon, {
      width,
      height,
      ...iconProps,
    })
    return `url('${dataUri}') ${width / 2} ${height / 2}, auto`
  }

  /** Loads a MUI icon as an SVG. */
  loadMuiIcon(key: string, icon: typeof SvgIcon, iconProps?: IconProps) {
    return this.load.svg(key, this.muiIconToDataUriString(icon, iconProps))
  }
}
