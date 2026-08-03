import { path as _ } from "codeforlife/utils/router"

const paths = _("", {
  level: _("/level", {
    id: _("/:id", {
      1: _({ id: "1" }),
      2: _({ id: "2" }),
      3: _({ id: "3" }),
      4: _({ id: "4" }),
      5: _({ id: "5" }),
      6: _({ id: "6" }),
      7: _({ id: "7" }),
      8: _({ id: "8" }),
      9: _({ id: "9" }),
      10: _({ id: "10" }),
      11: _({ id: "11" }),
      12: _({ id: "12" }),
    }),
    creator: _("/creator"),
  }),
})

export default paths
