import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material"
import { type FC, useRef, useState } from "react"
import { PlayCircle as PlayCircleIcon } from "@mui/icons-material"

import type { Level } from "../../api/level"

export interface DescriptionModalProps {
  level: Pick<Level, "id" | "name" | "description">
  // Direct URL to an mp4 video file.
  video?: string
}

// Renders a video that starts playing (with native controls) once clicked.
const VideoEmbed: FC<{ src: string }> = ({ src }) => {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const play = () => {
    setPlaying(true)
    void videoRef.current?.play()
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        aspectRatio: "16 / 9",
        bgcolor: "common.black",
        cursor: playing ? "default" : "pointer",
      }}
      onClick={play}
    >
      <Box
        ref={videoRef}
        component="video"
        src={src}
        controls={playing}
        autoPlay={playing}
        preload="metadata"
        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {!playing && (
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "common.white",
          }}
          onClick={play}
        >
          <PlayCircleIcon sx={{ fontSize: 64 }} />
        </IconButton>
      )}
    </Box>
  )
}

const DescriptionModal: FC<DescriptionModalProps> = ({ level, video }) => {
  const [open, setOpen] = useState(true)

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
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
          <Typography variant="h3">{`Level ${level.id}`}</Typography>
          <Typography variant="h6">{level.name || "Level Subtitle"}</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Typography>
              {level.description ||
                "This is a placeholder description explaining what to do in this level."}
            </Typography>
            {video && <VideoEmbed src={video} />}
          </Stack>
          <Button sx={{ ml: "auto", mt: 2 }} onClick={() => setOpen(false)}>
            Play
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default DescriptionModal
