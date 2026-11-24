import { ExitToApp as ExitToAppIcon } from "@mui/icons-material"
import { type FC } from "react"
import { useNavigate } from "react-router"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import { paths } from "../../../routes"

export interface ExitButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const ExitButton: FC<ExitButtonProps> = ({ isDrawerOpen }) => {
  const navigate = useNavigate()

  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Exit"
      icon={<ExitToAppIcon />}
      onClick={() => void navigate(paths._)}
    />
  )
}

export default ExitButton
