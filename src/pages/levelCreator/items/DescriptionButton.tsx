import { Description as DescriptionIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface DescriptionButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen" | "onClick"> {}

const DescriptionButton: FC<DescriptionButtonProps> = props => {
  return <ButtonItem {...props} text="Description" icon={<DescriptionIcon />} />
}

export default DescriptionButton
