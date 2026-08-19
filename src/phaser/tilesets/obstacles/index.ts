import * as animal from "./animal"
import * as trafficLight from "./trafficLight"

export { type ID, IDs, type Properties } from "./obstacles"

export default [...animal.default, ...trafficLight.default]
export { animal, trafficLight }
