import {
  AddRoad as AddRoadIcon,
  Home as HomeIcon,
  RemoveRoad as RemoveRoadIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material"
import { Box, SpeedDial, SpeedDialAction } from "@mui/material"
import { type FC, useState } from "react"

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
} as const
type Action = keyof typeof actions

export interface MapSpeedDialProps {}

const MapSpeedDial: FC<MapSpeedDialProps> = () => {
  const [action, setAction] = useState<Action>("add-road")
  const [open, setOpen] = useState(true)

  const { Icon, backgroundColor } = actions[action]

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
          ([key, { title, Icon, backgroundColor }]) => (
            <SpeedDialAction
              key={key}
              icon={<Icon color="white" />}
              slotProps={{
                fab: { sx: { backgroundColor } },
                tooltip: { open: true, title },
                staticTooltipLabel: { sx: { whiteSpace: "nowrap" } },
              }}
              onClick={() => setAction(key as Action)}
            />
          ),
        )}
      </SpeedDial>
    </Box>
  )
}

export default MapSpeedDial
