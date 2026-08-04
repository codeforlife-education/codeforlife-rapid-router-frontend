import * as building from "./building"
import * as nature from "./nature"
import * as other from "./other"

export { type ID, IDs } from "./scenery"

export default [...building.default, ...nature.default, ...other.default]
export { building, nature, other }
