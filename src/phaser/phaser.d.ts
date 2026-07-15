import type { SvgIcon } from "@mui/material"

declare module "phaser" {
  namespace GameObjects {
    namespace Graphics {
      type RequiredLineStyle = { width: number; color: number; alpha?: number }
      type RequiredFillStyle = { color: number; alpha?: number }
    }

    type Button = {
      bg: Phaser.GameObjects.Rectangle
      label: Phaser.GameObjects.Text
    }

    type FloatingActionButton = {
      isExpanded: boolean
      activeIndex: number
      setExpanded(state: boolean): void
      setActiveIndex(index: number): void
      destroy(): void
    }

    interface CustomGraphics extends Phaser.GameObjects.Graphics {
      arrow(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        headWidth: number,
        headHeight: number,
        shaftStyle?: RequiredLineStyle,
        headStyle?: RequiredFillStyle,
      ): this

      grid(
        cols: number,
        rows: number,
        cellWidth: number,
        cellHeight: number,
        style?: RequiredLineStyle,
      ): this
    }

    interface GameObjectFactory {
      button(
        x: number,
        y: number,
        width: number,
        height: number,
        labelText: string,
        labelStyle: Phaser.Types.GameObjects.Text.TextStyle,
        bgStyle: Phaser.Types.GameObjects.Graphics.FillStyle,
      ): Button

      customGraphics(): CustomGraphics

      floatingActionButton(
        x: number,
        y: number,
        radius: number,
        buttons: Array<{ icon: typeof SvgIcon; onClick: () => void }>,
        defaultButtonIndex?: number,
      ): FloatingActionButton
    }
  }
}
