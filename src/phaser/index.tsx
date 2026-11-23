// WARN: Do not import Phaser or any file that statically imports Phaser as it
// will be imported by our SSR code and break the build!
export {
  Events,
  type Event,
  type SceneKey,
  type Variable,
  SceneKeys,
  Variables,
} from "./globals"
export {
  default as PhaserGameContext,
  type GamePhase,
  type LevelResult,
  type LevelResultFailure,
  type PhaserGameContextValue,
  type PhaserGameRef,
} from "./PhaserGameContext"
export { default as PhaserGame, type PhaserGameProps } from "./PhaserGame"
export { default as ZoomControls, type ZoomControlsProps } from "./ZoomControls"
export {
  default as LevelSimulator,
  LevelStop,
  type Collision,
  type Destination,
  type AnimalKind,
  type FailureReason,
  type LevelFailure,
  type LevelOutcome,
  type Mistake,
  type StopReason,
  type SimulatorCommand,
} from "./LevelSimulator"
