import { Fab, Stack, Tooltip } from "@mui/material"
import { type FC } from "react"

import ZoomInSvg from "./images/hud/zoom/in.svg"
import ZoomOutSvg from "./images/hud/zoom/out.svg"
import { usePhaserGameContext } from "../app/hooks"

export interface ZoomControlsProps {}

const ZoomControls: FC<ZoomControlsProps> = () => {
  const {
    ref: { current: phaserGame },
  } = usePhaserGameContext()

  const enterDelay = 2000
  const enterNextDelay = enterDelay

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ position: "fixed", top: 16, right: 16, zIndex: 1 }}
    >
      <Tooltip
        title="Zoom out"
        enterDelay={enterDelay}
        enterNextDelay={enterNextDelay}
      >
        <Fab size="small" onClick={() => phaserGame?.zoomOut()}>
          <img src={ZoomOutSvg} alt="Zoom out" width="100%" height="100%" />
        </Fab>
      </Tooltip>
      <Tooltip
        title="Zoom in"
        enterDelay={enterDelay}
        enterNextDelay={enterNextDelay}
      >
        <Fab size="small" onClick={() => phaserGame?.zoomIn()}>
          <img src={ZoomInSvg} alt="Zoom in" width="100%" height="100%" />
        </Fab>
      </Tooltip>
    </Stack>
  )
}

export default ZoomControls
