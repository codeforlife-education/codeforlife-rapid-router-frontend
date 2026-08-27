import {
  AddRoad as AddRoadIcon,
  EditRoad as EditRoadIcon,
  RemoveRoad as RemoveRoadIcon,
} from "@mui/icons-material"
import { type FC, useEffect, useState } from "react"
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material"
import type Phaser from "phaser"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import { usePhaserGameContext } from "../../../app/hooks"

type Tool = Phaser.Types.Scenes.Create.Toolbox.Road["tool"]

export interface RoadButtonProps extends Pick<ButtonItemProps, "isDrawerOpen"> {
  tool?: Tool
  setTool: (tool: Tool) => void
}

const RoadButton: FC<RoadButtonProps> = ({ isDrawerOpen, tool, setTool }) => {
  const [_tool, _setTool] = useState<Tool>("add")
  const { activeSceneKeys } = usePhaserGameContext()

  useEffect(() => {
    if (tool && tool !== _tool) setTool(_tool)
  }, [_tool, tool, setTool])

  return (
    <>
      {activeSceneKeys.includes("Create.LEVEL") && tool && (
        <ToggleButtonGroup
          value={tool}
          exclusive
          onChange={(_, newValue) => {
            if (newValue !== null) _setTool(newValue as Tool)
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
        </ToggleButtonGroup>
      )}
      <ButtonItem
        id="road"
        isDrawerOpen={isDrawerOpen}
        selected={tool !== undefined}
        text="Road"
        icon={<EditRoadIcon />}
        onClick={() => setTool(_tool)}
      />
    </>
  )
}

export default RoadButton
