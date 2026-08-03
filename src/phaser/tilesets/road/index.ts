import * as asphalt from "./asphalt"
import * as dirt from "./dirt"

export { type ID, IDs } from "./road"

export default [...asphalt.default, ...dirt.default]
export { asphalt, dirt }
