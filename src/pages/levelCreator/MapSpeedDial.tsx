import {
  AddRoad as AddRoadIcon,
  Home as HomeIcon,
  RemoveRoad as RemoveRoadIcon,
  type SvgIconComponent,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material"
import { Box, SpeedDial, SpeedDialAction } from "@mui/material"
import { type FC, useEffect, useState } from "react"

import type { MapToolbox } from "../../phaser/scenes/create/Level"
import { usePhaserGameContext } from "../../app/hooks"

const actions = {
  "mark-start": {
    Icon: WarehouseIcon,
    title: "Mark Start",
    backgroundColor: "green",
  },
  "delete-house": {
    Icon: HomeIcon,
    title: "Delete House",
    backgroundColor: "red",
  },
  "add-house": {
    Icon: HomeIcon,
    title: "Add House",
    backgroundColor: "green",
  },
  "delete-road": {
    Icon: RemoveRoadIcon,
    title: "Delete Road",
    backgroundColor: "red",
  },
  "add-road": {
    Icon: AddRoadIcon,
    title: "Add Road",
    backgroundColor: "green",
  },
} as const satisfies Record<
  MapToolbox["tool"],
  { Icon: SvgIconComponent; title: string; backgroundColor: string }
>

export interface MapSpeedDialProps {}

const MapSpeedDial: FC<MapSpeedDialProps> = () => {
  const [tool, setTool] = useState<MapToolbox["tool"]>("add-road")
  const [open, setOpen] = useState(true)
  const phaserGameContext = usePhaserGameContext()

  // Update the Phaser game tool whenever the selected tool changes.
  useEffect(() => {
    if (!phaserGameContext?.isInitialized) return
    phaserGameContext.ref.current?.setCreateToolbox({ box: "map", tool })
  }, [phaserGameContext?.isInitialized, phaserGameContext?.ref, tool])

  const { Icon, backgroundColor } = actions[tool]

  return (
    <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1 }}>
      <SpeedDial
        ariaLabel="Map SpeedDial"
        FabProps={{
          sx: {
            backgroundColor,
            animation: "fabPulse 1.5s ease-in-out infinite",
          },
        }}
        icon={<Icon />}
        onClose={(_, reason) => {
          if (reason === "toggle") setOpen(false)
        }}
        onOpen={(_, reason) => {
          if (reason === "toggle") setOpen(true)
        }}
        open={open}
      >
        {Object.entries(actions).map(
          ([tool, { title, Icon, backgroundColor }]) => (
            <SpeedDialAction
              key={tool}
              icon={<Icon color="white" />}
              slotProps={{
                fab: { sx: { backgroundColor } },
                tooltip: { open: true, title },
                staticTooltipLabel: { sx: { whiteSpace: "nowrap" } },
              }}
              onClick={() => setTool(tool as MapToolbox["tool"])}
            />
          ),
        )}
      </SpeedDial>
    </Box>
  )
}

export default MapSpeedDial
