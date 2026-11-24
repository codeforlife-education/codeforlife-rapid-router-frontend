import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { type FC, type ReactNode } from "react"
import { Close as CloseIcon } from "@mui/icons-material"

export interface LevelModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  actions: ReactNode
  /**
   * Whether `actions` lays itself out across the modal's full width (e.g. to
   * spread its buttons out), rather than being right-aligned in a row.
   */
  fullWidthActions?: boolean
}

const LevelModal: FC<LevelModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  fullWidthActions = false,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "lg",
        maxHeight: "90%",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Stack>
        {/* Leave room for the close button. */}
        <Typography variant="h3" sx={{ pr: 5 }}>
          {title}
        </Typography>
        {children}
        {fullWidthActions ? (
          <Box sx={{ mt: 2 }}>{actions}</Box>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ mt: 2, justifyContent: "flex-end", flexWrap: "wrap" }}
          >
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  </Modal>
)

export default LevelModal
