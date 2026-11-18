import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { type FC, useRef, useState } from "react"
import { PlayCircle as PlayCircleIcon } from "@mui/icons-material"

import type { Level } from "../../api/level"
import LevelModal from "./LevelModal"

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
    <LevelModal
      open={open}
      onClose={() => setOpen(false)}
      title={`Level ${level.id}`}
      actions={<Button onClick={() => setOpen(false)}>Play</Button>}
    >
      <Typography variant="h6">{level.name || "Level Subtitle"}</Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Typography>
          {level.description ||
            "This is a placeholder description explaining what to do in this level."}
        </Typography>
        {video && <VideoEmbed src={video} />}
      </Stack>
    </LevelModal>
  )
}

export default DescriptionModal
