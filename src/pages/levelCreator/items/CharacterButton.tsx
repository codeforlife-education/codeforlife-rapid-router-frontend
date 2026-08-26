import { type FC } from "react"
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface CharacterButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen" | "onClick"> {}

const CharacterButton: FC<CharacterButtonProps> = props => {
  return <ButtonItem text="Character" icon={<LocalShippingIcon />} {...props} />
}

export default CharacterButton
