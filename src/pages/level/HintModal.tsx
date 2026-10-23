import { Box, Button, Modal, Stack, Typography } from "@mui/material"
import { type FC } from "react"

import type { Level } from "../../api/level"

export interface HintModalProps {
  open: boolean
  onClose: () => void
  level: Pick<Level, "hint">
}

const HintModal: FC<HintModalProps> = ({ open, onClose, level }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxHeight: "90%",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
      }}
    >
      <Stack>
        <Typography variant="h3">Hint</Typography>
        <Typography>
          {level.hint ||
            "This is a placeholder hint to help you if you get stuck."}
        </Typography>
        <Button sx={{ ml: "auto" }} onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Box>
  </Modal>
)

export default HintModal
