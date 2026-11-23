import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayCircle as PlayCircleIcon,
} from "@mui/icons-material"
import { type FC, useRef, useState } from "react"
import { Link } from "react-router"

import type { Level } from "../../api/level"
import LevelModal from "./LevelModal"
import type { TilemapGroup } from "../../phaser/tilemaps"
import { getLevelPath } from "./levelPaths"
import { setGameCommands } from "../../app/slices"
import { useAppDispatch } from "../../app/hooks"

export interface DescriptionModalProps {
  level: Pick<Level, "id" | "name" | "description"> & {
    tilemapGroup?: TilemapGroup
  }
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

/** A button linking to a neighbouring level. */
const LevelLinkButton: FC<{
  path: string
  direction: "previous" | "next"
}> = ({ path, direction }) => {
  const dispatch = useAppDispatch()

  return (
    <Button
      component={Link}
      to={path}
      variant="outlined"
      // Don't carry this level's program over to the other one.
      onClick={() => dispatch(setGameCommands([]))}
      {...(direction === "previous"
        ? { startIcon: <ChevronLeftIcon /> }
        : { endIcon: <ChevronRightIcon /> })}
    >
      {direction === "previous" ? "Previous level" : "Next level"}
    </Button>
  )
}

const DescriptionModal: FC<DescriptionModalProps> = ({ level, video }) => {
  const [open, setOpen] = useState(true)
  const previousPath = getLevelPath(level.id - 1, level.tilemapGroup)
  const nextPath = getLevelPath(level.id + 1, level.tilemapGroup)

  return (
    <LevelModal
      open={open}
      onClose={() => setOpen(false)}
      title={`Level ${level.id}`}
      fullWidthActions
      actions={
        // Previous on the left, Play in the centre and Next on the right, like
        // the legacy game. On small screens, they're stacked in a single
        // column of full-width buttons, with Play first. Each button is pinned
        // to its own column, so Play stays centred even when there's no
        // previous/next level.
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
            gap: 1,
            alignItems: "center",
            "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } },
          }}
        >
          <Box sx={{ gridColumn: { sm: 2 }, gridRow: { sm: 1 } }}>
            <Button onClick={() => setOpen(false)}>Play</Button>
          </Box>
          {previousPath && (
            <Box
              sx={{
                gridColumn: { sm: 1 },
                gridRow: { sm: 1 },
                justifySelf: { sm: "start" },
              }}
            >
              <LevelLinkButton direction="previous" path={previousPath} />
            </Box>
          )}
          {nextPath && (
            <Box
              sx={{
                gridColumn: { sm: 3 },
                gridRow: { sm: 1 },
                justifySelf: { sm: "end" },
              }}
            >
              <LevelLinkButton direction="next" path={nextPath} />
            </Box>
          )}
        </Box>
      }
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
