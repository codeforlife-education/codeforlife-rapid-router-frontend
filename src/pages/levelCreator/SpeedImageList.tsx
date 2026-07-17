import {
  Box,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Tooltip,
  imageListItemBarClasses,
} from "@mui/material"
import { Fragment, type JSX } from "react"

type Image = { key: string; title: string; src: string }
type Category = { key: string; subheader: string; images: readonly Image[] }

export type Key<Categories extends readonly Category[]> = {
  [C in Categories[number] as C["key"]]: `${C["key"]}-${C["images"][number]["key"]}`
}[Categories[number]["key"]]

export interface SpeedImageListProps<Categories extends readonly Category[]> {
  open: boolean
  onOpen: () => void
  onClose: () => void
  selectedKey: Key<Categories>
  onChangeKey: (key: Key<Categories>) => void
  ease?: string
  padding?: number
  cols: number
  gap?: number
  fab: { margin: number; size: number }
  image: {
    size: number
    padding?: number
    bar?: { lineHeight?: number; marginBottom?: number }
  }
  title?: { lineHeight?: number }
  categories: Categories
}

const SelectFab = <Categories extends readonly Category[]>({
  open,
  onOpen,
  selectedKey,
  categories,
}: Pick<
  SpeedImageListProps<Categories>,
  "open" | "onOpen" | "selectedKey" | "categories"
>): JSX.Element => {
  const selectedImage = categories
    .flatMap(({ key: categoryKey, images }) =>
      images.map(({ key: imageKey, ...image }) => ({
        key: `${categoryKey}-${imageKey}` as Key<Categories>,
        ...image,
      })),
    )
    .find(({ key }) => key === selectedKey)!

  return (
    <Tooltip
      title={
        selectedImage
          ? `Placing: ${selectedImage.title} — click the map`
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
          src={selectedImage.src}
          alt={selectedImage.title}
          sx={{ width: "65%", height: "65%", objectFit: "contain" }}
        />
      </Fab>
    </Tooltip>
  )
}
const SelectImageList = <Categories extends readonly Category[]>({
  cols,
  gap,
  selectedKey,
  onChangeKey,
  onClose,
  categories,
  open,
  padding,
  width,
  image,
  title,
}: Pick<
  SpeedImageListProps<Categories>,
  | "cols"
  | "gap"
  | "onChangeKey"
  | "selectedKey"
  | "onClose"
  | "categories"
  | "open"
> & {
  padding: string
  width: string
  image: {
    size: string
    padding: string
    bar: { lineHeight: string; marginBottom: string }
  }
  title: { lineHeight: string }
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
      <ImageList cols={cols} gap={gap} sx={{ width, m: 0 }}>
        {categories.map(({ key: categoryKey, subheader, images }) => (
          <Fragment key={categoryKey}>
            <ImageListItem cols={cols} sx={{ p: 0, m: 0 }}>
              <ListSubheader
                component="div"
                sx={{
                  backgroundColor: "transparent",
                  color: "common.white",
                  p: 0,
                  lineHeight: title.lineHeight,
                }}
              >
                {subheader}
              </ListSubheader>
            </ImageListItem>
            {images.map(({ key: imageKey, title, src }) => {
              const key = `${categoryKey}-${imageKey}`

              return (
                <ImageListItem
                  key={key}
                  onClick={() => {
                    onChangeKey(key as Key<Categories>)
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
              )
            })}
          </Fragment>
        ))}
      </ImageList>
    </Box>
  </Box>
)

const SpeedImageList = <Categories extends readonly Category[]>({
  ease = "cubic-bezier(0.4, 0, 0.2, 1)",
  padding = 2,
  gap = 8,
  cols,
  fab,
  title,
  image,
  categories,
  open,
  onClose,
  ...props
}: SpeedImageListProps<Categories>): JSX.Element => {
  // Calculate the number of rows and columns needed to display all items.
  const maxItemsLength = categories.reduce(
    (max, category) => Math.max(max, category.images.length),
    0,
  )
  cols = cols <= maxItemsLength ? cols : maxItemsLength
  const totalItemsLength = categories.reduce(
    (sum, category) => sum + category.images.length,
    0,
  )
  const rows = Math.ceil(totalItemsLength / cols)

  // Resolve defaults and convert MUI spacing units → px.
  const spacing = 8
  const pxPadding = padding * spacing
  const pxFabMargin = fab.margin * spacing
  const titleLineHeight = title?.lineHeight ?? 24
  const pxImagePadding = (image.padding ?? 0.5) * spacing
  const imageBarLineHeight = image.bar?.lineHeight ?? 24
  const pxImageBarMb = (image.bar?.marginBottom ?? 0) * spacing

  // Calculate the width.
  const imageWidth = image.size + pxImagePadding * 2 // left & right padding
  const imageListWidth = imageWidth * cols + gap * (cols - 1)
  const width = imageListWidth + pxPadding * 2 // left & right padding

  // Calculate the height.
  const titleHeight = titleLineHeight
  const imageHeight = image.size + pxImagePadding * 2 // top & bottom padding
  const imageBarHeight = imageBarLineHeight + pxImageBarMb
  const imageListHeight =
    titleHeight + (imageHeight + imageBarHeight) * rows + gap * rows
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
        <SelectFab open={open} categories={categories} {...props} />

        {/* ── Catalogue content: fades in after the shape has grown ────────
              Delayed fade-in (0.2 s) so content appears once the container is
              large enough to hold it comfortably. Scrollable for small screens. */}
        <SelectImageList
          {...props}
          categories={categories}
          open={open}
          onClose={onClose}
          gap={gap}
          cols={cols}
          padding={`${pxPadding}px`}
          width={`${imageListWidth}px`}
          image={{
            size: `${image.size}px`,
            padding: `${pxImagePadding}px`,
            bar: {
              lineHeight: `${imageBarLineHeight}px`,
              marginBottom: `${pxImageBarMb}px`,
            },
          }}
          title={{ lineHeight: `${titleLineHeight}px` }}
        />
      </Box>
    </>
  )
}

export default SpeedImageList
