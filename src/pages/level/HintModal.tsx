import { Button, Typography } from "@mui/material"
import { type FC } from "react"

import type { Level } from "../../api/level"
import LevelModal from "./LevelModal"

export const PLACEHOLDER_HINT =
  "This is a placeholder hint to help you if you get stuck."

export interface HintModalProps {
  open: boolean
  onClose: () => void
  level: Pick<Level, "hint">
}

const HintModal: FC<HintModalProps> = ({ open, onClose, level }) => (
  <LevelModal
    open={open}
    onClose={onClose}
    title="Hint"
    actions={<Button onClick={onClose}>Close</Button>}
  >
    <Typography>{level.hint || PLACEHOLDER_HINT}</Typography>
  </LevelModal>
)

export default HintModal
