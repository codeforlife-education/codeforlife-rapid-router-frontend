import { CloudDownload as CloudDownloadIcon } from "@mui/icons-material"
import { type FC } from "react"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"

export interface LoadButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const LoadButton: FC<LoadButtonProps> = ({ isDrawerOpen }) => {
  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Load"
      icon={<CloudDownloadIcon />}
    />
  )
}

export default LoadButton
