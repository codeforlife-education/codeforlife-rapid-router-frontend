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

    interface FloatingActionButton extends Phaser.GameObjects.Container {
      radius: number
      backgroundColorOut: number
      backgroundColorOver: number

      background: Phaser.GameObjects.Arc
      icon: Phaser.GameObjects.Image

      onPointerOver: Phaser.Input.Events.Listeners.GameObjectPointerOver
      onPointerOut: Phaser.Input.Events.Listeners.GameObjectPointerOut

      setInteractive(
        config?: Phaser.Types.Input.InputConfigurationWithoutHitArea,
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

      fab(
        x: number,
        y: number,
        iconTexture: string,
        backgroundColorOut: number,
        backgroundColorOver: number,
        options?: Phaser.Types.GameObjects.FloatingActionButton.Options,
      ): FloatingActionButton
    }
  }

  namespace Types {
    namespace GameObjects {
      namespace FloatingActionButton {
        type Options = { depth?: number; iconMargin?: number }
      }
    }

    namespace Input {
      type InputConfigurationWithoutHitArea = Omit<
        Phaser.Types.Input.InputConfiguration,
        "hitArea" | "hitAreaCallback"
      >
    }
  }

  namespace Input {
    namespace Events {
      namespace Listeners {
        // https://docs.phaser.io/api-documentation/event/input-events#pointer_down
        type PointerDown<
          Obj extends
            Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject,
        > = (pointer: Phaser.Input.Pointer, currentlyOver: Obj[]) => void

        // https://docs.phaser.io/api-documentation/event/input-events#pointer_move
        type PointerMove<
          Obj extends
            Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject,
        > = (pointer: Phaser.Input.Pointer, currentlyOver: Obj[]) => void

        // https://docs.phaser.io/api-documentation/event/input-events#pointer_up
        type PointerUp<
          Obj extends
            Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject,
        > = (pointer: Phaser.Input.Pointer, currentlyOver: Obj[]) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_drag_start
        type GameObjectDragStart = (
          pointer: Phaser.Input.Pointer,
          dragX: number,
          dragY: number,
        ) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_drag
        type GameObjectDrag = (
          pointer: Phaser.Input.Pointer,
          dragX: number,
          dragY: number,
        ) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_drag_end
        type GameObjectDragEnd = (
          pointer: Phaser.Input.Pointer,
          dragX: number,
          dragY: number,
          dropped: boolean,
        ) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_pointer_over
        type GameObjectPointerOver = (
          pointer: Phaser.Input.Pointer,
          localX: number,
          localY: number,
          event: Phaser.Types.Input.EventData,
        ) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_pointer_out
        type GameObjectPointerOut = (
          pointer: Phaser.Input.Pointer,
          event: Phaser.Types.Input.EventData,
        ) => void

        // https://docs.phaser.io/api-documentation/event/input-events#gameobject_pointer_up
        type GameObjectPointerUp = (
          pointer: Phaser.Input.Pointer,
          localX: number,
          localY: number,
          event: Phaser.Types.Input.EventData,
        ) => void
      }
    }
  }
}
