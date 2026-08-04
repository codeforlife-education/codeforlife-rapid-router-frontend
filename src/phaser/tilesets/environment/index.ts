import * as animal from "./animal"
import * as trafficLight from "./trafficLight"

export { type ID, IDs } from "./environment"

export default [...animal.default, ...trafficLight.default]
export { animal, trafficLight }
