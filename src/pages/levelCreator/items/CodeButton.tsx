import { Extension as ExtensionIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface CodeButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen" | "onClick"> {}

const CodeButton: FC<CodeButtonProps> = props => {
  return <ButtonItem {...props} text="Code" icon={<ExtensionIcon />} />
}

export default CodeButton
