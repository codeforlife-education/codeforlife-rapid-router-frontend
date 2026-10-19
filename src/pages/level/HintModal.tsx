import { Box, Button, Modal, Typography } from "@mui/material"
import { type FC } from "react"

export interface HintModalProps {
  open: boolean
  onClose: () => void
  hint: string
}

const HintModal: FC<HintModalProps> = ({ open, onClose, hint }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 700 },
        maxHeight: "90%",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
      }}
    >
      <Typography variant="h3">Hint</Typography>
      <Typography sx={{ mt: 1 }}>{hint}</Typography>
      <Button
        type="button"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onClose}
      >
        Close
      </Button>
    </Box>
  </Modal>
)

export default HintModal
