import Box from "@mui/material/Box"
import { Close as CloseIcon } from "@mui/icons-material"
import { type FC } from "react"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

export interface DescriptionModalProps {
  open: boolean
  onClose: () => void
}

const DescriptionModal: FC<DescriptionModalProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3">Description</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          Give this level a subtitle, a description of what to do within this
          level and a hint for its players.
        </Typography>
        <Typography>
          Players will see this subtitle and description when starting this
          level so make sure they are useful to them.
        </Typography>
        <TextField
          fullWidth
          multiline
          label="Subtitle"
          rows={6}
          sx={{ mb: 2 }}
          placeholder="What is the subtitle for this level?"
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          rows={6}
          sx={{ mb: 2 }}
          placeholder="What do players have to do to complete this level?"
        />
        <Typography>
          Players will have the option to view a hint when they have made an
          unsuccessful attempt, or by clicking the hint button whilst playing.
        </Typography>
        <TextField
          fullWidth
          multiline
          label="Hint"
          rows={6}
          placeholder="What advice do you want to give for this level?"
        />
      </Box>
    </Modal>
  )
}

export default DescriptionModal
