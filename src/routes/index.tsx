import general from "./general"
import pythonDen from "./pythonDen"
import rapidRouter from "./rapidRouter"

const routes = (
  <>
    {general}
    {rapidRouter}
    {pythonDen}
  </>
)

export default routes
export { default as paths } from "./paths"
