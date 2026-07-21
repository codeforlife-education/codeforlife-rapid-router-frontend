import Level, {
  type MapToolbox,
  type SceneryToolbox,
  type Toolbox,
} from "./Level"
import Boot from "./Boot"
import Preloader from "./Preloader"

export default [Boot, Preloader, Level]

export type { MapToolbox, SceneryToolbox, Toolbox }
