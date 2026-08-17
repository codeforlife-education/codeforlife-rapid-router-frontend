import { Description as DescriptionIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface DescriptionButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const DescriptionButton: FC<DescriptionButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Description"
      icon={<DescriptionIcon />}
    />
  )
}

export default DescriptionButton
