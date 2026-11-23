import { Box, Modal, Stack, Typography } from "@mui/material"
import { type FC, type ReactNode } from "react"

export interface LevelModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  actions: ReactNode
}

const LevelModal: FC<LevelModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
}) => (
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
        <Typography variant="h3">{title}</Typography>
        {children}
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ mt: 2, justifyContent: "flex-end", flexWrap: "wrap" }}
        >
          {actions}
        </Stack>
      </Stack>
    </Box>
  </Modal>
)

export default LevelModal
