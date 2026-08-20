import { type FC, useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { Close as CloseIcon } from "@mui/icons-material"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

export interface DescriptionSettings {
  subtitle: string
  description: string
  hint: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_DESCRIPTION_SETTINGS: DescriptionSettings = {
  subtitle: "",
  description: "",
  hint: "",
}

export interface DescriptionModalProps {
  open: boolean
  value: DescriptionSettings
  onClose: () => void
  onSubmit: (value: DescriptionSettings) => void
}

const DescriptionModal: FC<DescriptionModalProps> = ({
  open,
  value,
  onClose,
  onSubmit,
}) => {
  const [subtitle, setSubtitle] = useState(value.subtitle)
  const [description, setDescription] = useState(value.description)
  const [hint, setHint] = useState(value.hint)

  // Discard any unsaved edits and restore the last saved values whenever the
  // modal is (re)opened.
  useEffect(() => {
    if (open) {
      setSubtitle(value.subtitle)
      setDescription(value.description)
      setHint(value.hint)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ subtitle, description, hint })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "90%",
          overflowY: "auto",
          bgcolor: "background.paper",
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
          <IconButton onClick={onClose} size="small" type="button">
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
          label="Subtitle"
          sx={{ mb: 2 }}
          placeholder="What is the subtitle for this level?"
          value={subtitle}
          onChange={event => setSubtitle(event.target.value)}
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          rows={6}
          sx={{ mb: 2, "& textarea": { resize: "vertical" } }}
          placeholder="What do players have to do to complete this level?"
          slotProps={{ input: { inputComponent: "textarea" } }}
          value={description}
          onChange={event => setDescription(event.target.value)}
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
          sx={{ "& textarea": { resize: "vertical" } }}
          placeholder="What advice do you want to give for this level?"
          slotProps={{ input: { inputComponent: "textarea" } }}
          value={hint}
          onChange={event => setHint(event.target.value)}
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DescriptionModal
