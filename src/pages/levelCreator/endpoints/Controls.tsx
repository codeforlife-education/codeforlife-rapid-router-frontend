import type { FC } from "react"

import ImageSelect, { type ImageSelectProps } from "./ImageSelect"

export interface ControlsProps extends ImageSelectProps {}

export const Controls: FC<ControlsProps> = props => <ImageSelect {...props} />

export default Controls
