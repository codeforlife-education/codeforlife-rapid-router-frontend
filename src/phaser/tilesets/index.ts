import * as endpoints from "./endpoints"
import * as obstacles from "./obstacles"
import * as road from "./road"
import * as scenery from "./scenery"

export { type ID, IDs, type Tileset, getTileset } from "./tilesets"

export default [
  ...endpoints.default,
  ...obstacles.default,
  ...road.default,
  ...scenery.default,
]
export { endpoints, obstacles, road, scenery }
