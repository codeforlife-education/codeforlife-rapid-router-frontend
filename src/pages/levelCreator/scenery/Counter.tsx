import { type FC, useEffect, useState } from "react"
import { Typography } from "@mui/material"

import { usePhaserGameContext } from "../../../app/hooks"

export interface CounterProps {}

const Counter: FC<CounterProps> = () => {
  const {
    ref: { current: phaserGame },
  } = usePhaserGameContext()
  const [sceneryObjectCount, setSceneryObjectCount] = useState(0)
  const [maxSceneryObjectCount, setMaxSceneryObjectCount] = useState<number>()

  useEffect(() => {
    if (!phaserGame) return

    const sceneryObjectCountCleanup = phaserGame.getVariable(
      "sceneryObjectCount",
      setSceneryObjectCount,
      0 as number,
    )
    const maxSceneryObjectCountCleanup = phaserGame.getVariable(
      "maxSceneryObjectCount",
      setMaxSceneryObjectCount,
    )

    return () => {
      sceneryObjectCountCleanup()
      maxSceneryObjectCountCleanup()
    }
  }, [phaserGame])

  if (!maxSceneryObjectCount) return <></>

  return (
    <Typography
      color={sceneryObjectCount >= maxSceneryObjectCount ? "error" : "white"}
      variant="h6"
      sx={{
        position: "fixed",
        top: 16,
        left: { xs: "16px", sm: "50%" },
        transform: { xs: "translateX(0)", sm: "translateX(-50%)" },
        userSelect: "none",
        zIndex: 1,
      }}
    >
      {sceneryObjectCount} / {maxSceneryObjectCount}
    </Typography>
  )
}

export default Counter
