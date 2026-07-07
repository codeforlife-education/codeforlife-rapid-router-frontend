import { type FC, useState } from "react"
import Select, { type SelectChangeEvent } from "@mui/material/Select"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import Drawer from "@mui/material/Drawer"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

export interface SubControlsProps {
  open: boolean
}

const SubControls: FC<SubControlsProps> = ({ open }) => {
  const [language, setLanguage] = useState("")

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
  }

  const [checked, setChecked] = useState([true, false])

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked])
  }

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]])
  }

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked])
  }

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="Child 1"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Child 2"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  )

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        zIndex: theme => theme.zIndex.drawer - 1,
        "& .MuiDrawer-paper": { left: 240 },
      }}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h3">Code</Typography>
        <Typography>
          Here you can select the code you can use while playing your new level!
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            labelId="language-label"
            id="language-select"
            label="Language"
            value={language}
            onChange={handleChange}
          >
            <MenuItem value="blockly">Blockly</MenuItem>
            <MenuItem value="blocklyWithPythonView">
              Blockly with Python view
            </MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          label="Select all"
          control={
            <Checkbox
              checked={checked[0] && checked[1]}
              indeterminate={checked[0] !== checked[1]}
              onChange={handleChange1}
            />
          }
        />
        {children}
      </Box>
    </Drawer>
  )
}

export default SubControls
