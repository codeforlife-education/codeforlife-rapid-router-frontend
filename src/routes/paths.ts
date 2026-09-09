import { type Path, path as _ } from "codeforlife/utils/router"

const LEVEL_COUNT = 79

const levelIdPaths: Record<string, Path> = {}
for (let id = 1; id <= LEVEL_COUNT; id++) levelIdPaths[id] = _({ id: `${id}` })

const paths = _("", {
  level: _("/level", {
    id: _("/:id", levelIdPaths),
    creator: _("/creator"),
  }),
})

export default paths
