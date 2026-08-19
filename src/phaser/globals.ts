import {
  type DeepStringsOf,
  createIdRegistry,
  createPathStrings,
} from "codeforlife/utils/object"

// Define the dimensions of the tilemap. These constants ensure that all layers
// and tilesets are created with consistent dimensions, which is crucial for
// proper rendering and interaction in the game.
export const COLS = 10
export const ROWS = 8
export const TILE_WIDTH = 64
export const TILE_HEIGHT = 64
export const MAP_WIDTH = COLS * TILE_WIDTH
export const MAP_HEIGHT = ROWS * TILE_HEIGHT

export const Events = createIdRegistry({
  "add-road": "ADD_ROAD",
  "delete-road": "DELETE_ROAD",
  "zoom-in": "ZOOM_IN",
  "zoom-out": "ZOOM_OUT",
  "scene-activity-changed": "SCENE_ACTIVITY_CHANGED",
  "add-endpoint": "ADD_ENDPOINT",
  "phaser-set-variable": "PHASER_SET_VARIABLE",
  "react-set-variable": "REACT_SET_VARIABLE",
} as const)
export type Event = (typeof Events)[keyof typeof Events]

export const Variables = createIdRegistry({
  commands: "COMMANDS",
  levelId: "LEVEL_ID",
  toolbox: "TOOLBOX",
  maxSceneryObjectCount: "MAX_SCENERY_OBJECT_COUNT",
  sceneryObjectCount: "SCENERY_OBJECT_COUNT",
} as const)
export type Variable = (typeof Variables)[keyof typeof Variables]

export const SceneKeys = createPathStrings({
  Create: ["BOOT", "PRELOADER", "LEVEL"],
  Play: ["BOOT", "PRELOADER", "LEVEL", "HUD"],
} as const)
export type SceneKey = DeepStringsOf<typeof SceneKeys>
