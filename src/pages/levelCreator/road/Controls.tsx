import type { FC } from "react"

import ToggleButtonGroup, {
  type ToggleButtonGroupProps,
} from "./ToggleButtonGroup"

export interface ControlsProps extends ToggleButtonGroupProps {}

export const Controls: FC<ControlsProps> = props => (
  <ToggleButtonGroup {...props} />
)

export default Controls
