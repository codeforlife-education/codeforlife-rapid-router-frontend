import type { FC } from "react"

import { default as Counter, type CounterProps } from "./Counter"
import { default as ImageSelect, type ImageSelectProps } from "./ImageSelect"

export interface ControlsProps extends CounterProps, ImageSelectProps {}

export const Controls: FC<ControlsProps> = props => (
  <>
    <Counter />
    <ImageSelect {...props} />
  </>
)

export default Controls
