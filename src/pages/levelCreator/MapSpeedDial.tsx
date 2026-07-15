import {
  AddRoad as AddRoadIcon,
  Home as HomeIcon,
  RemoveRoad as RemoveRoadIcon,
  type SvgIconComponent,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material"
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { type FC, useState } from "react"

const actions: {
  Icon: SvgIconComponent
  title: string
  backgroundColor: string
}[] = [
  { Icon: WarehouseIcon, title: "Mark Start", backgroundColor: "green" },
  { Icon: HomeIcon, title: "Delete House", backgroundColor: "red" },
  { Icon: HomeIcon, title: "Add House", backgroundColor: "green" },
  { Icon: RemoveRoadIcon, title: "Delete Road", backgroundColor: "red" },
  { Icon: AddRoadIcon, title: "Add Road", backgroundColor: "green" },
]

export interface MapSpeedDialProps {}

const MapSpeedDial: FC<MapSpeedDialProps> = () => {
  const [open, setOpen] = useState(true)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1 }}>
        <SpeedDial
          ariaLabel="Create Map SpeedDial"
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map(({ title, Icon, backgroundColor }) => (
            <SpeedDialAction
              key={title}
              icon={<Icon color="white" />}
              slotProps={{
                fab: { sx: { backgroundColor } },
                tooltip: { open: true, title },
                staticTooltipLabel: { sx: { whiteSpace: "nowrap" } },
              }}
              onClick={handleClose}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  )
}

export default MapSpeedDial
