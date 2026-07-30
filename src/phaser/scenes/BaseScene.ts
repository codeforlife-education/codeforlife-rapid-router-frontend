import Phaser from "phaser"
import type { SvgIcon } from "@mui/material"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import "../gameObjects" // Register custom game objects.
import {
  Events,
  type SceneKey,
  TILE_HEIGHT,
  TILE_WIDTH,
  type Variable,
} from "../globals"

type IconProps = Partial<{ width: number; height: number; color: string }>
const DEFAULT_ICON_WIDTH = TILE_WIDTH / 2
const DEFAULT_ICON_HEIGHT = TILE_HEIGHT / 2

export default class BaseScene<
  Data extends object | undefined = undefined,
> extends Phaser.Scene {
  static KEY: SceneKey

  initData!: Data
  private activityListenersRegistered = false

  constructor() {
    super(new.target.KEY)
  }

  init(data: Data) {
    this.initData = data

    this.registerActivityListeners()
  }

  private registerActivityListeners() {
    if (this.activityListenersRegistered) return
    this.activityListenersRegistered = true

    // Listen for scene activity changes broadcast by each scene.
    const emitActivity = (isActive: boolean) => () =>
      this.game.events.emit(
        Events.SCENE_ACTIVITY_CHANGED,
        this.scene.key as SceneKey,
        isActive,
      )

    this.events.on(Phaser.Scenes.Events.CREATE, emitActivity(true))
    this.events.on(Phaser.Scenes.Events.RESUME, emitActivity(true))
    this.events.on(Phaser.Scenes.Events.WAKE, emitActivity(true))
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, emitActivity(false))
    this.events.on(Phaser.Scenes.Events.PAUSE, emitActivity(false))
    this.events.on(Phaser.Scenes.Events.SLEEP, emitActivity(false))
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

  /** Gets a variable from the Phaser registry. */
  getVariable<T>(key: Variable): T | undefined
  getVariable<T>(key: Variable, defaultValue: T): T
  getVariable<T>(key: Variable, defaultValue?: T) {
    return (this.game.registry.get(key) as T | undefined) ?? defaultValue
  }

  /** Sets a variable in the Phaser registry and emits an event. */
  setVariable(key: Variable, value: any) {
    this.registry.set(key, value)
    this.events.emit(Events.PHASER_SET_VARIABLE, key)
  }
}
