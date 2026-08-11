import {
  AddRoad as AddRoadIcon,
  RemoveRoad as RemoveRoadIcon,
} from "@mui/icons-material"
import { type Dispatch, type FC, type SetStateAction } from "react"
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material"

type Value = "add" | "delete"

export interface ToggleButtonGroupProps {
  valueState: [Value, Dispatch<SetStateAction<Value>>]
}

const ToggleButtonGroup: FC<ToggleButtonGroupProps> = ({
  valueState: [value, setValue],
}) => (
  <MuiToggleButtonGroup
    value={value}
    exclusive
    onChange={(_, newValue) => {
      if (newValue !== null) setValue(newValue as Value)
    }}
    sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1 }}
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
