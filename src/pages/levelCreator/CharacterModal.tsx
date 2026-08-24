import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import { type FC, useEffect, useState } from "react"
import { Close as CloseIcon } from "@mui/icons-material"

import deeImage from "../../images/characters/front_view/Dee.svg"
import electricVanImage from "../../images/characters/front_view/Electric_van.svg"
import kirstyImage from "../../images/characters/front_view/Kirsty.svg"
import nigelImage from "../../images/characters/front_view/Nigel.svg"
import philImage from "../../images/characters/front_view/Phil.svg"
import vanImage from "../../images/characters/front_view/Van.svg"
import wesImage from "../../images/characters/front_view/Wes.svg"

interface CharacterOption {
  value: string
  name: string
  image: string
}

const CHARACTER_OPTIONS: CharacterOption[] = [
  { value: "van", name: "Van", image: vanImage },
  { value: "dee", name: "Dee", image: deeImage },
  { value: "electric_van", name: "Electric Van", image: electricVanImage },
  { value: "kirsty", name: "Kirsty", image: kirstyImage },
  { value: "nigel", name: "Nigel", image: nigelImage },
  { value: "phil", name: "Phil", image: philImage },
  { value: "wes", name: "Wes", image: wesImage },
]

export interface CharacterSettings {
  character: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_CHARACTER_SETTINGS: CharacterSettings = {
  character: CHARACTER_OPTIONS[0].value,
}

export interface CharacterModalProps {
  open: boolean
  value: CharacterSettings
  onClose: () => void
  onSubmit: (value: CharacterSettings) => void
}

const CharacterModal: FC<CharacterModalProps> = ({
  open,
  value,
  onClose,
  onSubmit,
}) => {
  const [character, setCharacter] = useState(value.character)

  // Discard any unsaved edits and restore the last saved values whenever the
  // modal is (re)opened.
  useEffect(() => {
    if (open) setCharacter(value.character)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ character })
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
          <Typography variant="h3">Character</Typography>
          <IconButton onClick={onClose} size="small" type="button">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          Here you can choose your character. Who will you play as?
        </Typography>
        <RadioGroup
          value={character}
          onChange={event => setCharacter(event.target.value)}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 1,
            mt: 2,
          }}
        >
          {CHARACTER_OPTIONS.map(option => (
            <Box
              key={option.value}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                component="img"
                src={option.image}
                alt={option.name}
                onClick={() => setCharacter(option.value)}
                sx={{ width: 200, height: 200, cursor: "pointer" }}
              />
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.name}
                sx={{ m: 0 }}
              />
            </Box>
          ))}
        </RadioGroup>
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

export default CharacterModal
