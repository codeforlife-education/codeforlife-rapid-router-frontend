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

  /**
   * How many canvas pixels there are per CSS pixel. The canvas is rendered at
   * the screen's pixel density (see `PhaserGame`) and then scaled down to its
   * CSS size, by a zoom of `1 / pixelRatio`. Anything sized in CSS pixels that
   * isn't scaled by a camera's zoom (e.g. the HUD) must be scaled up by this.
   */
  get pixelRatio() {
    return 1 / this.scale.zoom
  }

  /**
   * Calls the callback whenever the game canvas is resized (e.g. when its
   * container is resized), until this scene shuts down. The scene's cameras
   * have already been resized to the new size when the callback is called.
   */
  onResize(callback: (width: number, height: number) => void) {
    const onScaleResize = (gameSize: Phaser.Structs.Size) => {
      // Phaser only resizes a camera if its size exactly matches the canvas's
      // previous size, so one that ever drifts out of sync (e.g. through
      // rounding while a device is rotated) is never resized again - leaving
      // part of the canvas blank. Our cameras always fill the whole canvas, so
      // resize them all explicitly.
      this.cameras.resize(gameSize.width, gameSize.height)
      callback(gameSize.width, gameSize.height)
    }

    this.scale.on(Phaser.Scale.Events.RESIZE, onScaleResize)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, onScaleResize)
    })
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
    this.game.events.emit(Events.PHASER_SET_VARIABLE, key)
  }
}
