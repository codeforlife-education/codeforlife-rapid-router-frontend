import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material"
import { type FC, useEffect, useState } from "react"
import { Close as CloseIcon } from "@mui/icons-material"

export interface Description {
  subtitle: string
  description: string
  hint: string
}

export interface DescriptionModalProps {
  open: boolean
  value: Description
  onClose: () => void
  onSubmit: (value: Description) => void
}

const DescriptionModal: FC<DescriptionModalProps> = ({
  open,
  value,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState(value)

  // Discard any unsaved edits and restore the last saved values whenever the
  // modal is (re)opened.
  useEffect(() => {
    if (open) setDescription(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(description)
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
          value={description.subtitle}
          onChange={event =>
            setDescription(prevDescription => ({
              ...prevDescription,
              subtitle: event.target.value,
            }))
          }
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          rows={6}
          sx={{ mb: 2, "& textarea": { resize: "vertical" } }}
          placeholder="What do players have to do to complete this level?"
          slotProps={{ input: { inputComponent: "textarea" } }}
          value={description.description}
          onChange={event =>
            setDescription(prevDescription => ({
              ...prevDescription,
              description: event.target.value,
            }))
          }
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
          value={description.hint}
          onChange={event =>
            setDescription(prevDescription => ({
              ...prevDescription,
              hint: event.target.value,
            }))
          }
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
