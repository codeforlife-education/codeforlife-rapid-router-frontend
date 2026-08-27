import { type FC, useEffect, useState } from "react"
import { Save as SaveIcon } from "@mui/icons-material"

import {
  ButtonItem,
  type ButtonItemProps,
} from "../../../components/miniDrawers"
import type { ExportedOrthogonalTilemap } from "../../../phaser/tilemaps"
import { usePhaserGameContext } from "../../../app/hooks"

export interface SaveButtonProps
  extends Pick<ButtonItemProps, "isDrawerOpen"> {}

const SaveButton: FC<SaveButtonProps> = ({ isDrawerOpen }) => {
  const [exportedLevel, setExportedLevel] =
    useState<ExportedOrthogonalTilemap>()
  const {
    ref: { current: phaserGame },
  } = usePhaserGameContext()

  useEffect(() => {
    if (phaserGame)
      return phaserGame.getVariable("exportedLevel", setExportedLevel)
  }, [phaserGame])

  useEffect(() => {
    if (!exportedLevel) return
    // TODO: Save the exportedLevel to a file or server when it changes.
    console.log(exportedLevel)
  }, [exportedLevel])

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
