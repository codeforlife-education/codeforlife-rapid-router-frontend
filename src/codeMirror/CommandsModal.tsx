import { Box, Button, IconButton, Modal, Typography } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { type FC } from "react"

import type { CommandName } from "./PythonWorkspaceContext"

type CommandCategory = "Movement" | "Position" | "Animals"

const COMMANDS: Record<
  CommandName,
  { category: CommandCategory; signature: string }
> = {
  move_forwards: { category: "Movement", signature: "my_van.move_forwards()" },
  turn_left: { category: "Movement", signature: "my_van.turn_left()" },
  turn_right: { category: "Movement", signature: "my_van.turn_right()" },
  turn_around: { category: "Movement", signature: "my_van.turn_around()" },
  wait: { category: "Movement", signature: "my_van.wait()" },
  deliver: { category: "Movement", signature: "my_van.deliver()" },
  at_dead_end: { category: "Position", signature: "my_van.at_dead_end()" },
  at_destination: {
    category: "Position",
    signature: "my_van.at_destination()",
  },
  at_red_traffic_light: {
    category: "Position",
    signature: "my_van.at_red_traffic_light()",
  },
  is_road_forward: {
    category: "Position",
    signature: "my_van.is_road_forward()",
  },
  is_road_left: { category: "Position", signature: "my_van.is_road_left()" },
  is_road_right: {
    category: "Position",
    signature: "my_van.is_road_right()",
  },
  is_animal_crossing: {
    category: "Animals",
    signature: "my_van.is_animal_crossing()",
  },
  sound_horn: { category: "Animals", signature: "my_van.sound_horn()" },
}

const CATEGORY_ORDER: readonly CommandCategory[] = [
  "Movement",
  "Position",
  "Animals",
]

/** Groups the given commands by category, in a fixed display order, for
 * rendering in the Commands modal. */
function groupCommandsByCategory(
  commands: readonly CommandName[],
): { category: CommandCategory; commands: CommandName[] }[] {
  return CATEGORY_ORDER.map(category => ({
    category,
    commands: commands.filter(
      commandName => COMMANDS[commandName].category === category,
    ),
  })).filter(group => group.commands.length > 0)
}

export interface CommandsModalProps {
  open: boolean
  commands: CommandName[]
  onClose: () => void
}

const CommandsModal: FC<CommandsModalProps> = ({ open, commands, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        maxWidth: 1200,
        maxHeight: "85vh",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3">Python Commands</Typography>
        <IconButton onClick={onClose} size="small" type="button">
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography sx={{ mb: 4 }}>
        Run the following commands on the van object v, e.g.
        my_van.move_forwards()
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 6,
        }}
      >
        {groupCommandsByCategory(commands).map(
          ({ category, commands: categoryCommands }) => (
            <Box key={category} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {category}
              </Typography>
              {categoryCommands.map(commandName => (
                <Typography
                  key={commandName}
                  component="code"
                  variant="h6"
                  sx={{ display: "block", fontFamily: "monospace", mb: 1.5 }}
                >
                  {COMMANDS[commandName].signature}
                </Typography>
              ))}
            </Box>
          ),
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
        <Button type="button" variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  </Modal>
)

export default CommandsModal
