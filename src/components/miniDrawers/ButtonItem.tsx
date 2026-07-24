import { type FC, type ReactNode, useEffect, useState } from "react"
import {
  ListItem,
  ListItemButton,
  type ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Tooltip,
  type TooltipProps,
} from "@mui/material"

export type ButtonItemProps = ListItemButtonProps & {
  isDrawerOpen: boolean
  icon: ReactNode
  text: string
  tooltipProps?: Omit<
    TooltipProps,
    | "title"
    | "children"
    | "open"
    | "onOpen"
    | "onClose"
    | "placement"
    | "disableHoverListener"
    | "disableFocusListener"
    | "disableTouchListener"
  >
}

const ButtonItem: FC<ButtonItemProps> = ({
  isDrawerOpen,
  icon,
  text,
  tooltipProps = {},
  children,
  ...listItemButtonProps
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  useEffect(() => {
    if (isDrawerOpen) setTooltipOpen(false)
  }, [isDrawerOpen])

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Tooltip
        placement="right"
        title={text}
        open={tooltipOpen}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        disableHoverListener={isDrawerOpen}
        disableFocusListener={isDrawerOpen}
        disableTouchListener={isDrawerOpen}
        {...tooltipProps}
      >
        <ListItemButton
          {...listItemButtonProps}
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: isDrawerOpen ? "initial" : "center",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              mr: isDrawerOpen ? 1 : "auto",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={text}
            sx={{
              opacity: isDrawerOpen ? 1 : 0,
              "& span": { marginBottom: "auto" },
            }}
          />
          {children}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}

export default ButtonItem
