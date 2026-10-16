import { Box, Button, Modal, Typography } from "@mui/material"
import { type FC, useState } from "react"
import { PlayCircle as PlayCircleIcon } from "@mui/icons-material"

export interface DescriptionModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle: string
  description: string
  // Direct URL to an mp4 video file.
  video?: string
}

// Renders a video that starts playing (with native controls) once clicked.
const VideoEmbed: FC<{ src: string }> = ({ src }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        bgcolor: "common.black",
        cursor: playing ? "default" : "pointer",
      }}
      onClick={() => setPlaying(true)}
    >
      <Box
        component="video"
        src={src}
        controls={playing}
        autoPlay={playing}
        preload="metadata"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {!playing && (
        <PlayCircleIcon
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 64,
            color: "common.white",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  )
}

const DescriptionModal: FC<DescriptionModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  description,
  video,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", lg: 1400 },
        maxHeight: "90%",
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h6">{subtitle}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2,
          mt: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography>{description}</Typography>
        </Box>
        {video && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <VideoEmbed src={video} />
          </Box>
        )}
      </Box>
      <Button
        type="button"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onClose}
      >
        Play
      </Button>
    </Box>
  </Modal>
)

export default DescriptionModal
