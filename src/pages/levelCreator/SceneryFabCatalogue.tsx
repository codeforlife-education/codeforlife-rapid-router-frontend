import {
  Box,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Popover,
  Portal,
  Tooltip,
  Typography,
} from "@mui/material"
import { type FC, useRef, useState } from "react"
import { Park as ParkIcon } from "@mui/icons-material"

import * as tilesets from "../../phaser/tilesets"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SceneryItemKey = "bush" | "hay" | "pond" | "tree1" | "tree2"

/** Fired on `window` whenever the active scenery type changes. */
export type SceneryToolSelectedEvent = CustomEvent<SceneryItemKey>

// ─── Catalogue data ───────────────────────────────────────────────────────────

const ITEMS: { key: SceneryItemKey; label: string; image: string }[] = [
  { key: "bush", label: "Bush", image: tilesets.scenery.common.bush.image },
  { key: "hay", label: "Hay", image: tilesets.scenery.common.hay.image },
  { key: "pond", label: "Pond", image: tilesets.scenery.common.pond.image },
  { key: "tree1", label: "Tree", image: tilesets.scenery.common.tree1.image },
  {
    key: "tree2",
    label: "Pine Tree",
    image: tilesets.scenery.common.tree2.image,
  },
]

/** Event name dispatched on `window` when the user selects a scenery type. */
export const SCENERY_TOOL_SELECTED = "scenery-tool-selected"

// ─── Component ────────────────────────────────────────────────────────────────

export interface SceneryFabCatalogueProps {}

const SceneryFabCatalogue: FC<SceneryFabCatalogueProps> = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SceneryItemKey | null>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  const selectedItem = ITEMS.find(i => i.key === selected) ?? null

  const handleSelect = (key: SceneryItemKey) => {
    setSelected(key)
    setOpen(false)
    window.dispatchEvent(
      new CustomEvent<SceneryItemKey>(SCENERY_TOOL_SELECTED, { detail: key }),
    )
  }

  return (
    <Portal>
      <>
        {/* ── Floating action button ── */}
        <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1 }}>
          <Tooltip
            title={
              selectedItem
                ? `Placing: ${selectedItem.label} — click the map`
                : "Choose a scenery object"
            }
            placement="left"
          >
            <Fab
              ref={fabRef}
              color="success"
              onClick={() => setOpen(prev => !prev)}
              sx={{
                // Pulse yellow when nothing is selected to prompt the user.
                animation: selected
                  ? "none"
                  : "sceneryFabPulse 1.5s ease-in-out infinite",
                "@keyframes sceneryFabPulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 1)" },
                  "70%": { boxShadow: "0 0 0 14px rgba(255, 235, 59, 0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 0)" },
                },
              }}
            >
              {selectedItem ? (
                <Box
                  component="img"
                  src={selectedItem.image}
                  alt={selectedItem.label}
                  sx={{ width: "65%", height: "65%", objectFit: "contain" }}
                />
              ) : (
                <ParkIcon />
              )}
            </Fab>
          </Tooltip>
        </Box>

        {/* ── Catalogue popover ── */}
        <Popover
          open={open}
          anchorEl={fabRef.current}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{ paper: { sx: { borderRadius: 2 } } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Scenery Objects
            </Typography>
            <ImageList cols={3} gap={8} sx={{ width: 240, m: 0 }}>
              {ITEMS.map(({ key, label, image }) => (
                <ImageListItem
                  key={key}
                  onClick={() => handleSelect(key)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 1,
                    p: 0.5,
                    outline: "2px solid",
                    outlineColor:
                      selected === key ? "success.main" : "transparent",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={label}
                    sx={{ width: "100%", height: 64, objectFit: "contain" }}
                  />
                  <ImageListItemBar
                    title={label}
                    position="below"
                    sx={{
                      "& .MuiImageListItemBar-title": {
                        fontSize: "0.75rem",
                        textAlign: "center",
                      },
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </Popover>
      </>
    </Portal>
  )
}

export default SceneryFabCatalogue
