import { type FC } from "react"
import { Help as HelpIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface HelpButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const HelpButton: FC<HelpButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem isDrawerOpen={isDrawerOpen} text="Help" icon={<HelpIcon />} />
  )
}

export default HelpButton
