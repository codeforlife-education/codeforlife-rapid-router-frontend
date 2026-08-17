import { Extension as ExtensionIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface CodeButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const CodeButton: FC<CodeButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Code"
      icon={<ExtensionIcon />}
    />
  )
}

export default CodeButton
