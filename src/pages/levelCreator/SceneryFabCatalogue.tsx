import {
  Box,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Portal,
  Tooltip,
  Typography,
} from "@mui/material"
import { type FC, useState } from "react"
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

// ─── Dimensions & easing ──────────────────────────────────────────────────────

const FAB_SIZE = 56
const FAB_MARGIN = 16
// ImageList width (240) + p:2 padding on each side (16×2 = 32)
const CATALOGUE_WIDTH = 276
// 2-row grid (~88px/row + 8px gap) + title (~28px) + top/bottom padding (32px)
const CATALOGUE_HEIGHT = 260
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)"

// ─── Component ────────────────────────────────────────────────────────────────

export interface SceneryFabCatalogueProps {}

const SceneryFabCatalogue: FC<SceneryFabCatalogueProps> = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SceneryItemKey | null>(null)

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
        {/* ── Click-away backdrop ── */}
        {open && (
          <Box
            sx={{ position: "fixed", inset: 0, zIndex: 1 }}
            onClick={() => setOpen(false)}
          />
        )}

        {/* ── Morphing container ──────────────────────────────────────────────
            Pinned at right/bottom so it always grows upward and to the left.
            overflow:hidden clips both background layers and catalogue content
            to the current shape during the transition. */}
        <Box
          sx={{
            position: "fixed",
            right: FAB_MARGIN,
            bottom: FAB_MARGIN,
            zIndex: 2,
            // Shape morphs between FAB circle and catalogue rectangle.
            width: open
              ? `min(${CATALOGUE_WIDTH}px, calc(100vw - ${FAB_MARGIN * 2}px))`
              : `${FAB_SIZE}px`,
            height: open
              ? `min(${CATALOGUE_HEIGHT}px, calc(100vh - ${FAB_MARGIN * 2}px))`
              : `${FAB_SIZE}px`,
            borderRadius: open ? "16px" : "50%",
            overflow: "hidden",
            transition: [
              `width 0.35s ${EASE}`,
              `height 0.35s ${EASE}`,
              `border-radius 0.35s ${EASE}`,
            ].join(", "),
            // Pulse when the FAB is visible and no item is selected yet.
            animation:
              !open && !selected
                ? "sceneryFabPulse 1.5s ease-in-out infinite"
                : "none",
            "@keyframes sceneryFabPulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 1)" },
              "70%": { boxShadow: "0 0 0 14px rgba(255, 235, 59, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 0)" },
            },
          }}
        >
          {/* ── Background layer 1: green FAB (fades out as catalogue opens) ── */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "success.main",
              opacity: open ? 0 : 1,
              transition: "opacity 0.2s",
              pointerEvents: "none",
            }}
          />

          {/* ── Background layer 2: dark catalogue (fades in as FAB closes) ── */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(18, 18, 30, 0.95)",
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s",
              pointerEvents: "none",
            }}
          />

          {/* ── FAB face: icon centred over the green circle ──────────────────
              Uses Fab so we get the ripple on click. border-radius: inherit
              follows the morphing container so the ripple stays clipped to the
              current shape. Fades out / becomes non-interactive when catalogue
              is open. */}
          <Tooltip
            title={
              selectedItem
                ? `Placing: ${selectedItem.label} — click the map`
                : "Choose a scenery object"
            }
            placement="left"
            disableHoverListener={open}
            disableFocusListener={open}
            disableTouchListener={open}
          >
            <Fab
              color="success"
              onClick={() => !open && setOpen(true)}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                minHeight: "unset",
                borderRadius: "inherit",
                boxShadow: "none",
                bgcolor: "transparent",
                "&:hover": { bgcolor: "transparent" },
                opacity: open ? 0 : 1,
                transition: "opacity 0.15s",
                pointerEvents: open ? "none" : "auto",
                zIndex: 2,
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

          {/* ── Catalogue content: fades in after the shape has grown ────────
              Delayed fade-in (0.2 s) so content appears once the container is
              large enough to hold it comfortably. Scrollable for small screens. */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              overflow: "auto",
              color: "common.white",
              opacity: open ? 1 : 0,
              transition: `opacity 0.2s ${open ? "0.2s" : "0s"}`,
              pointerEvents: open ? "auto" : "none",
              zIndex: 3,
            }}
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
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
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
                          color: "common.white",
                        },
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Box>
        </Box>
      </>
    </Portal>
  )
}

export default SceneryFabCatalogue
