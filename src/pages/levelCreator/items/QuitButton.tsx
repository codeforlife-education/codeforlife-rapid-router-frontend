import { ExitToApp as ExitToAppIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface QuitButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const QuitButton: FC<QuitButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Quit"
      icon={<ExitToAppIcon />}
    />
  )
}

export default QuitButton
