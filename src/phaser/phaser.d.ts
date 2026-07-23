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
