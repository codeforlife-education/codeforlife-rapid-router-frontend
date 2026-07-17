import {
  Box,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  Typography,
  imageListItemBarClasses,
} from "@mui/material"
import { type JSX } from "react"

type SpeedImageListItem = { key: string; title: string; src: string }

export interface SpeedImageListProps<
  Items extends readonly SpeedImageListItem[],
> {
  open: boolean
  onOpen: () => void
  onClose: () => void
  selectedKey: Items[number]["key"]
  onChange: (key: Items[number]["key"]) => void
  ease?: string
  padding?: number
  cols?: number
  gap?: number
  fab: { margin: number; size: number }
  image: {
    size: number
    padding?: number
    bar?: { lineHeight?: number; marginBottom?: number }
  }
  title: { text: string; lineHeight?: number; marginBottom?: number }
  items: Items
}

const SelectFab = <Items extends readonly SpeedImageListItem[]>({
  open,
  onOpen,
  selectedKey,
  items,
}: Pick<
  SpeedImageListProps<Items>,
  "open" | "onOpen" | "selectedKey" | "items"
>): JSX.Element => {
  const selectedItem = items.find(({ key }) => key === selectedKey)!

  return (
    <Tooltip
      title={
        selectedItem
          ? `Placing: ${selectedItem.title} — click the map`
          : "Choose a scenery object"
      }
      placement="left"
      disableHoverListener={open}
      disableFocusListener={open}
      disableTouchListener={open}
    >
      <Fab
        color="success"
        onClick={() => !open && onOpen()}
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
        <Box
          component="img"
          src={selectedItem.src}
          alt={selectedItem.title}
          sx={{ width: "65%", height: "65%", objectFit: "contain" }}
        />
      </Fab>
    </Tooltip>
  )
}
const SelectImageList = <Items extends readonly SpeedImageListItem[]>({
  open,
  cols,
  gap,
  items,
  selectedKey,
  onChange,
  onClose,
  width,
  padding,
  image,
  title,
}: Pick<
  SpeedImageListProps<Items>,
  "open" | "cols" | "gap" | "items" | "onChange" | "onClose" | "selectedKey"
> & {
  width: string
  padding: string
  image: {
    size: string
    padding: string
    bar: { lineHeight: string; marginBottom: string }
  }
  title: { text: string; lineHeight: string; marginBottom: string }
}): JSX.Element => (
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
    <Box sx={{ padding }}>
      <Typography
        variant="subtitle2"
        gutterBottom
        lineHeight={title.lineHeight}
        mb={title.marginBottom}
      >
        {title.text}
      </Typography>
      <ImageList cols={cols} gap={gap} sx={{ width, m: 0 }}>
        {items.map(({ key, title, src }) => (
          <ImageListItem
            key={key}
            onClick={() => {
              onChange(key)
              onClose()
            }}
            sx={{
              cursor: "pointer",
              borderRadius: 1,
              padding: image.padding,
              outline: "2px solid",
              outlineOffset: "-2px",
              outlineColor:
                selectedKey === key ? "success.main" : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Box
              component="img"
              src={src}
              alt={title}
              sx={{
                width: "100%",
                height: image.size,
                objectFit: "contain",
              }}
            />
            <ImageListItemBar
              title={title}
              position="below"
              sx={{
                [`& .${imageListItemBarClasses.title}`]: {
                  lineHeight: image.bar.lineHeight,
                  marginBottom: image.bar.marginBottom,
                  fontSize: "0.75rem",
                  textAlign: "center",
                  color: "common.white",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                [`& .${imageListItemBarClasses.titleWrap}`]: {
                  padding: 0,
                },
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  </Box>
)

const SpeedImageList = <Items extends readonly SpeedImageListItem[]>({
  open,
  onOpen,
  onClose,
  selectedKey,
  onChange,
  ease = "cubic-bezier(0.4, 0, 0.2, 1)",
  padding = 2,
  cols = 3,
  gap = 8,
  fab,
  image,
  title,
  items,
}: SpeedImageListProps<Items>): JSX.Element => {
  const rows = Math.ceil(items.length / cols)

  // Resolve defaults and convert MUI spacing units → px.
  const spacing = 8
  const pxPadding = padding * spacing
  const pxFabMargin = fab.margin * spacing
  const titleLineHeight = title.lineHeight ?? 24
  const pxTitleMb = (title.marginBottom ?? 1) * spacing
  const pxImagePadding = (image.padding ?? 0.5) * spacing
  const imageBarLineHeight = image.bar?.lineHeight ?? 24
  const pxImageBarMb = (image.bar?.marginBottom ?? 0) * spacing

  // Calculate the width.
  const imageWidth = image.size + pxImagePadding * 2 // left & right padding
  const imageListWidth = imageWidth * cols + gap * (cols - 1)
  const width = imageListWidth + pxPadding * 2 // left & right padding

  // Calculate the height.
  const titleHeight = titleLineHeight + pxTitleMb
  const imageHeight = image.size + pxImagePadding * 2 // top & bottom padding
  const imageBarHeight = imageBarLineHeight + pxImageBarMb
  const imageListHeight =
    titleHeight + (imageHeight + imageBarHeight) * rows + gap * (rows - 1)
  const height = imageListHeight + pxPadding * 2 // top & bottom padding

  return (
    <>
      {/* Click-away backdrop */}
      {open && (
        <Box
          sx={{ position: "fixed", inset: 0, zIndex: 1 }}
          onClick={onClose}
        />
      )}
      {/*
      Morphing container pinned at right/bottom so it always grows upward and to
      the left. overflow:hidden clips both background layers and catalogue
      content to the current shape during the transition.
      */}
      <Box
        sx={{
          position: "fixed",
          right: `${pxFabMargin}px`,
          bottom: `${pxFabMargin}px`,
          zIndex: 2,
          // Shape morphs between FAB circle and catalogue rectangle.
          width: open
            ? `min(${width}px, calc(100vw - ${pxFabMargin * 2}px))`
            : `${fab.size}px`,
          height: open
            ? `min(${height}px, calc(100vh - ${pxFabMargin * 2}px))`
            : `${fab.size}px`,
          borderRadius: open ? "16px" : "50%",
          overflow: "hidden",
          transition: [
            `width 0.35s ${ease}`,
            `height 0.35s ${ease}`,
            `border-radius 0.35s ${ease}`,
          ].join(", "),
          // Pulse when the FAB is visible and no item is selected yet.
          animation: !open
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
        <SelectFab
          open={open}
          onOpen={onOpen}
          items={items}
          selectedKey={selectedKey}
        />

        {/* ── Catalogue content: fades in after the shape has grown ────────
              Delayed fade-in (0.2 s) so content appears once the container is
              large enough to hold it comfortably. Scrollable for small screens. */}
        <SelectImageList
          open={open}
          onClose={onClose}
          onChange={onChange}
          items={items}
          selectedKey={selectedKey}
          cols={cols}
          gap={gap}
          width={`${imageListWidth}px`}
          padding={`${pxPadding}px`}
          image={{
            size: `${image.size}px`,
            padding: `${pxImagePadding}px`,
            bar: {
              lineHeight: `${imageBarLineHeight}px`,
              marginBottom: `${pxImageBarMb}px`,
            },
          }}
          title={{
            text: title.text,
            lineHeight: `${titleLineHeight}px`,
            marginBottom: `${pxTitleMb}px`,
          }}
        />
      </Box>
    </>
  )
}

export default SpeedImageList
