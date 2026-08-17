import { type FC } from "react"
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface CharacterButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const CharacterButton: FC<CharacterButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Character"
      icon={<LocalShippingIcon />}
    />
  )
}

export default CharacterButton
