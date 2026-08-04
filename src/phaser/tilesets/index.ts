import * as endpoints from "./endpoints"
import * as environment from "./environment"
import * as road from "./road"
import * as scenery from "./scenery"

export { type ID, IDs, type Tileset } from "./tilesets"

export default [
  ...endpoints.default,
  ...environment.default,
  ...road.default,
  ...scenery.default,
]
export { endpoints, environment, road, scenery }
