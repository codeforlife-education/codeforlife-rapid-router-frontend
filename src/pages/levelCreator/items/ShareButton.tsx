import { type FC } from "react"
import { People as PeopleIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface ShareButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const ShareButton: FC<ShareButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Share"
      icon={<PeopleIcon />}
    />
  )
}

export default ShareButton
