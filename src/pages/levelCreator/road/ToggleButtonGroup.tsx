import {
  AddRoad as AddRoadIcon,
  RemoveRoad as RemoveRoadIcon,
} from "@mui/icons-material"
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material"
import { type FC } from "react"
import type Phaser from "phaser"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Road["tool"]

export interface ToggleButtonGroupProps {
  tool: Tool
  setTool: (tool: Tool) => void
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = ({ tool, setTool }) => (
  <MuiToggleButtonGroup
    value={tool}
    exclusive
    onChange={(_, newValue) => {
      if (newValue !== null) setTool(newValue as Tool)
    }}
    sx={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 1,
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    <Tooltip title="Add Road" placement="top" arrow>
      <ToggleButton
        value="add"
        sx={{
          backgroundColor: "rgba(0, 128, 0, 0.25) !important",
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 128, 0, 1) !important",
          },
        }}
      >
        <AddRoadIcon htmlColor="white" />
      </ToggleButton>
    </Tooltip>
    <Tooltip title="Delete Road" placement="top" arrow>
      <ToggleButton
        value="delete"
        sx={{
          backgroundColor: "rgba(255, 0, 0, 0.25) !important",
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 0, 0, 1) !important",
          },
        }}
      >
        <RemoveRoadIcon htmlColor="white" />
      </ToggleButton>
    </Tooltip>
  </MuiToggleButtonGroup>
)

export default ToggleButtonGroup
