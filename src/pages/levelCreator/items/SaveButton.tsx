import { type FC, useEffect, useState } from "react"
import { Save as SaveIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import { usePhaserGameContext } from "../../../app/hooks"

export interface SaveButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const SaveButton: FC<SaveButtonProps> = ({ isDrawerOpen }) => {
  const [levelTiledJson, setLevelTiledJson] = useState<string>()
  const {
    ref: { current: phaserGame },
  } = usePhaserGameContext()

  useEffect(() => {
    if (phaserGame)
      return phaserGame.getVariable("levelTiledJson", setLevelTiledJson)
  }, [phaserGame])

  useEffect(() => {
    if (!levelTiledJson) return
    // TODO: Save the levelTiledJson to a file or server when it changes.
    console.log(levelTiledJson)
  }, [levelTiledJson])

  return (
    <ButtonItem
      isDrawerOpen={isDrawerOpen}
      text="Save"
      icon={<SaveIcon />}
      onClick={phaserGame?.exportLevel}
    />
  )
}

export default SaveButton
