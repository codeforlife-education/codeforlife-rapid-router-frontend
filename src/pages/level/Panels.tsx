import { type FC, type ReactNode, useCallback } from "react"
import {
  Panel,
  Group as _Group,
  type GroupProps as _GroupProps,
  Separator as _Separator,
} from "react-resizable-panels"
import { type Theme, styled } from "@mui/material/styles"
import { type Breakpoint } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

import type {
  ExportedOrthogonalTilemap,
  TilemapGroup,
} from "../../phaser/tilemaps"
import type {
  PanelLayout,
  ThreePanelLayout,
  TwoPanelLayout,
} from "../../app/slices"
import {
  type ScreenOrientation,
  useBlocklyWorkspaceContext,
  useBreakpoint,
  useScreenOrientation,
  useSettings,
} from "../../app/hooks"
import { BlocklyWorkspace } from "../../blockly"
import { ConsoleLog } from "../../codeMirror"
import type { Level } from "../../api/level"
import { PhaserGame } from "../../phaser"
import { PythonEditor } from "../../codeMirror/editors/python"

type PanelProps = { defaultSize: string }

/** Identifies which tilemap to load - a predefined group+id pair (dynamically
 * imported), or an already-fetched custom level's exported tilemap. */
type TilemapProps =
  | { tilemapGroup: TilemapGroup; tilemap: undefined }
  | { tilemapGroup: undefined; tilemap: ExportedOrthogonalTilemap }

type AutoPanelLayout<PL extends PanelLayout> = Record<
  ScreenOrientation,
  Record<Breakpoint, PL>
>

const AUTO_TWO_PANEL_LAYOUTS: AutoPanelLayout<TwoPanelLayout> = {
  landscape: {
    xs: "vertical",
    sm: "vertical",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
  portrait: {
    xs: "horizontal",
    sm: "horizontal",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
}

const AUTO_THREE_PANEL_LAYOUTS: AutoPanelLayout<ThreePanelLayout> = {
  landscape: {
    xs: "verticalWithLeftHorizontal",
    sm: "verticalWithLeftHorizontal",
    md: "verticalWithLeftHorizontal",
    lg: "verticalWithLeftHorizontal",
    xl: "verticalWithLeftHorizontal",
  },
  portrait: {
    xs: "horizontal",
    sm: "horizontal",
    md: "vertical",
    lg: "vertical",
    xl: "vertical",
  },
}

const BlocklyPanel: FC<PanelProps> = ({ defaultSize }) => {
  return (
    <Panel id="blockly-panel" defaultSize={defaultSize} minSize="20%">
      <BlocklyWorkspace />
    </Panel>
  )
}

const PythonEditorPanel: FC<PanelProps> = ({ defaultSize }) => (
  <Panel id="python-editor-panel" defaultSize={defaultSize} minSize="20%">
    <PythonEditor />
  </Panel>
)

const ConsoleLogPanel: FC<PanelProps> = ({ defaultSize }) => (
  <Panel id="console-log-panel" defaultSize={defaultSize} minSize="20%">
    <ConsoleLog />
  </Panel>
)

const StyledSeparator = styled(_Separator)(({ theme }: { theme: Theme }) => ({
  alignItems: "center",
  backgroundColor: theme.palette.divider,
  display: "flex",
  justifyContent: "center",
  "&[data-separator='hover']": {
    backgroundColor: theme.palette.action.hover,
  },
  "&[data-separator='active'], &[data-separator='focus']": {
    backgroundColor: theme.palette.primary.main,
  },
}))

const Separator: FC<Pick<GroupProps, "orientation">> = ({ orientation }) => (
  <StyledSeparator>
    <DragIndicatorIcon
      sx={{
        fontSize: 15,
        ...(orientation === "vertical" ? { transform: "rotate(90deg)" } : {}),
      }}
    />
  </StyledSeparator>
)

const PhaserGamePanel: FC<
  PanelProps & { levelId: Level["id"]; maxFuel?: number } & TilemapProps
> = ({ defaultSize, levelId, ...tilemapProps }) => (
  <Panel id="phaser-game-panel" defaultSize={defaultSize} minSize="20%">
    <PhaserGame mode="play" levelId={levelId} {...tilemapProps} />
  </Panel>
)

type GroupProps = Omit<_GroupProps, "orientation" | "children"> & {
  orientation: "horizontal" | "vertical"
  panels: ReactNode[]
}

const Group: FC<GroupProps> = ({ panels, orientation, ...groupProps }) => (
  <_Group orientation={orientation} {...groupProps}>
    {...panels.flatMap((panel, index) =>
      index === panels.length - 1
        ? [panel]
        : [
            panel,
            <Separator key={`separator-${index}`} orientation={orientation} />,
          ],
    )}
  </_Group>
)

const BlocklyGroup: FC<Omit<GroupProps, "onLayoutChanged">> = props => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const resizeBlocklyWorkspace = useCallback(() => {
    blocklyWorkspaceContext?.ref.current?.resize()
  }, [blocklyWorkspaceContext])

  return <Group onLayoutChanged={resizeBlocklyWorkspace} {...props} />
}

const BlocklyPanelLayout: FC<
  Pick<GroupProps, "orientation"> & {
    reverseOrder?: boolean
    levelId: Level["id"]
    maxFuel?: number
  } & TilemapProps
> = ({ orientation, reverseOrder = false, levelId, ...tilemapProps }) => {
  const panels = [
    <BlocklyPanel key="blockly-panel" defaultSize="50%" />,
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize="50%"
      levelId={levelId}
      {...tilemapProps}
    />,
  ]
  if (reverseOrder) panels.reverse()
  return <BlocklyGroup orientation={orientation} panels={panels} />
}

const Flat3PanelLayout: FC<
  Pick<GroupProps, "orientation"> & {
    reverseOrder?: boolean
    level: Pick<Level, "id"> & {
      mode: "blocklyAndPython" | "python"
      maxFuel?: number
    } & TilemapProps
  }
> = ({ orientation, reverseOrder = false, level }) => {
  const { id, mode, ...tilemapProps } = level
  const panels = [
    ...(mode === "blocklyAndPython"
      ? [
          <BlocklyPanel key="blockly-panel" defaultSize="34%" />,
          <PythonEditorPanel key="python-editor-panel" defaultSize="33%" />,
        ]
      : [
          <PythonEditorPanel key="python-editor-panel" defaultSize="34%" />,
          <ConsoleLogPanel key="console-log-panel" defaultSize="33%" />,
        ]),
    <PhaserGamePanel
      key="phaser-game-panel"
      defaultSize="33%"
      levelId={id}
      {...tilemapProps}
    />,
  ]
  if (reverseOrder) panels.reverse()
  return (mode === "blocklyAndPython" ? BlocklyGroup : Group)({
    orientation,
    panels,
  })
}

const Nested3PanelLayout: FC<{
  level: Pick<Level, "id"> & {
    mode: "blocklyAndPython" | "python"
    maxFuel?: number
  } & TilemapProps
}> = ({ level }) => {
  const { id, mode, ...tilemapProps } = level
  let _Group: FC<GroupProps>
  let nestedPanels: GroupProps["panels"]
  if (mode === "blocklyAndPython") {
    _Group = BlocklyGroup
    nestedPanels = [
      <BlocklyPanel key="blockly-panel" defaultSize="50%" />,
      <PythonEditorPanel key="python-editor-panel" defaultSize="50%" />,
    ]
  } else {
    _Group = Group
    nestedPanels = [
      <PythonEditorPanel key="python-editor-panel" defaultSize="50%" />,
      <ConsoleLogPanel key="console-log-panel" defaultSize="50%" />,
    ]
  }

  return (
    <_Group
      orientation="horizontal"
      panels={[
        <Panel key="nested-panels" defaultSize="50%" minSize="20%">
          <_Group orientation="vertical" panels={nestedPanels} />
        </Panel>,
        <PhaserGamePanel
          key="phaser-game-panel"
          defaultSize="50%"
          levelId={id}
          {...tilemapProps}
        />,
      ]}
    />
  )
}

export interface PanelsProps {
  level: Pick<Level, "id" | "mode"> & { maxFuel?: number } & TilemapProps
}

const Panels: FC<PanelsProps> = ({ level: { id, mode, ...tilemapProps } }) => {
  const settings = useSettings()
  const screenOrientation = useScreenOrientation()
  const breakpoint = useBreakpoint()

  // Blockly mode only has 2 panel layouts.
  if (mode === "blockly") {
    let orientation =
      settings.twoPanelLayout ??
      AUTO_TWO_PANEL_LAYOUTS[screenOrientation][breakpoint] ??
      "vertical"
    orientation = orientation === "vertical" ? "horizontal" : "vertical"
    return (
      <BlocklyPanelLayout
        reverseOrder={orientation === "vertical"}
        orientation={orientation}
        levelId={id}
        {...tilemapProps}
      />
    )
  }

  switch (
    settings.threePanelLayout ??
    AUTO_THREE_PANEL_LAYOUTS[screenOrientation][breakpoint]
  ) {
    case "verticalWithLeftHorizontal":
      return <Nested3PanelLayout level={{ id, mode, ...tilemapProps }} />
    case "horizontal":
      return (
        <Flat3PanelLayout
          orientation="vertical"
          reverseOrder
          level={{ id, mode, ...tilemapProps }}
        />
      )
    case "vertical":
    default:
      return (
        <Flat3PanelLayout
          orientation="horizontal"
          level={{ id, mode, ...tilemapProps }}
        />
      )
  }
}

export default Panels
