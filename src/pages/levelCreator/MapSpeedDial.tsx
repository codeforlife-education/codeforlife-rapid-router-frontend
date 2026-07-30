import {
  AddRoad as AddRoadIcon,
  Home as HomeIcon,
  RemoveRoad as RemoveRoadIcon,
  type SvgIconComponent,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material"
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  Tooltip,
  speedDialClasses,
} from "@mui/material"
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"
import type Phaser from "phaser"

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
  Phaser.Types.Scenes.Create.Toolbox.Map["tool"],
  { Icon: SvgIconComponent; title: string; backgroundColor: string }
>

export interface MapSpeedDialProps {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  selectedState: [
    Phaser.Types.Scenes.Create.Toolbox.Map["tool"],
    Dispatch<SetStateAction<Phaser.Types.Scenes.Create.Toolbox.Map["tool"]>>,
  ]
}

const MapSpeedDial: FC<MapSpeedDialProps> = ({
  openState: [open, setOpen],
  selectedState: [selected, setSelected],
}) => {
  const speedDialRef = useRef<HTMLDivElement>(null)
  const [fabElement, setFabElement] = useState<HTMLElement | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // The SpeedDial's root reserves vertical space for its (invisible) closed
  // actions, so it's much taller than the visible Fab button. Anchor the
  // Tooltip to the Fab itself instead of the whole root, otherwise it renders
  // too high up.
  useEffect(() => {
    setFabElement(
      speedDialRef.current?.querySelector<HTMLElement>(
        `.${speedDialClasses.fab}`,
      ) ?? null,
    )
  }, [])

  const { Icon, backgroundColor } = actions[selected]

  return (
    <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1 }}>
      <Tooltip
        title={"Click to " + (open ? "close" : "open")}
        placement="left"
        slotProps={{ popper: { anchorEl: fabElement ?? undefined } }}
        open={tooltipOpen}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
      >
        <SpeedDial
          ref={speedDialRef}
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
                onClick={() =>
                  setSelected(
                    tool as Phaser.Types.Scenes.Create.Toolbox.Map["tool"],
                  )
                }
              />
            ),
          )}
        </SpeedDial>
      </Tooltip>
    </Box>
  )
}

export default MapSpeedDial
