import { type FC, useState } from "react"
import Box from "@mui/material/Box"
import { Close as CloseIcon } from "@mui/icons-material"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

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
  { value: "dee", name: "Dee", image: deeImage },
  { value: "electric_van", name: "Electric Van", image: electricVanImage },
  { value: "kirsty", name: "Kirsty", image: kirstyImage },
  { value: "nigel", name: "Nigel", image: nigelImage },
  { value: "phil", name: "Phil", image: philImage },
  { value: "van", name: "Van", image: vanImage },
  { value: "wes", name: "Wes", image: wesImage },
]

export interface CharacterModalProps {
  open: boolean
  onClose: () => void
}

const getMaxMovesLabel = (character: string): string => {
  switch (character) {
    case "van":
      return "Max fuel"
    case "electric_van":
      return "Max battery"
    default:
      return "Max steps"
  }
}

const CharacterModal: FC<CharacterModalProps> = ({ open, onClose }) => {
  const [character, setCharacter] = useState(CHARACTER_OPTIONS[0].value)
  const [maxMoves, setMaxMoves] = useState(50)

  return (
    <Modal open={open} onClose={onClose}>
      <Box
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
          <IconButton onClick={onClose} size="small">
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
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 1,
            mt: 2,
          }}
        >
          {CHARACTER_OPTIONS.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              sx={{ m: 0, alignItems: "center" }}
              label={
                <Box
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
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography>{option.name}</Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
        <TextField
          type="number"
          label={getMaxMovesLabel(character)}
          value={maxMoves}
          onChange={event => {
            const value = Number(event.target.value)
            if (!Number.isNaN(value)) {
              setMaxMoves(Math.min(100, Math.max(1, value)))
            }
          }}
          slotProps={{ htmlInput: { min: 1, max: 100 } }}
          sx={{ mt: 2, width: 200 }}
        />
      </Box>
    </Modal>
  )
}

export default CharacterModal
