import {
  Box,
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  Tooltip,
  type TooltipProps,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { type FC, type ReactNode } from "react"

export interface MiniDrawerProps {
  open: boolean
  children: ReactNode
  onToggle: () => void
  onOpened?: () => void
  onClosed?: () => void
  width?: number
  tooltipProps?: Omit<TooltipProps, "title" | "placement">
}

const MiniDrawer: FC<MiniDrawerProps> = ({
  open,
  onToggle,
  onOpened,
  onClosed,
  children,
  width = 240,
  tooltipProps = {},
}) => (
  <Drawer
    variant="permanent"
    open={open}
    slotProps={{
      paper: { onTransitionEnd: () => (open ? onOpened : onClosed)?.() },
    }}
    sx={theme => {
      const base: CSSObject = {
        width,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflowX: "hidden",
      }

      const opened: CSSObject = {
        width,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }

      const closed: CSSObject = {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
        overflowX: "hidden",
      }

      return open
        ? { ...base, ...opened, "& .MuiDrawer-paper": opened }
        : { ...base, ...closed, "& .MuiDrawer-paper": closed }
    }}
  >
    <Box sx={theme => ({ width: "100%", ...theme.mixins.toolbar })}>
      <Tooltip
        placement="right"
        title={open ? "Close" : "Open"}
        {...tooltipProps}
      >
        <IconButton sx={{ width: "100%", height: "100%" }} onClick={onToggle}>
          {open ? (
            <ChevronLeftIcon />
          ) : (
            <MenuIcon
              sx={{
                "--pulse-color-start": "rgba(192, 192, 192, 1)",
                "--pulse-color-end": "rgba(192, 192, 192, 0)",
                animation: open ? "none" : "pulse 1.5s ease-in-out infinite",
              }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Box>
    <Divider />
    <List>{children}</List>
  </Drawer>
)

export default MiniDrawer
