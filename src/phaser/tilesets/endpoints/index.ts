import * as cfc from "./cfc"
import * as house from "./house"

export { type ID, IDs } from "./endpoints"

export default [...cfc.default, ...house.default]
export { cfc, house }
