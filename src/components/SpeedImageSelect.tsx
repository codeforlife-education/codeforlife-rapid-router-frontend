import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Tooltip,
  imageListItemBarClasses,
} from "@mui/material"
import { type FC, Fragment, type JSX, useEffect, useState } from "react"

type Image = { key: string | number; title: string; src: string }
type Category = { key: string; subheader: string; images: readonly Image[] }
type ImageKey<Categories extends readonly Category[]> = {
  [C in Categories[number] as C["key"]]: C["images"][number]["key"]
}[Categories[number]["key"]]

export interface SpeedImageSelectProps<Categories extends readonly Category[]> {
  open: boolean
  onOpen: () => void
  onClose: () => void
  selected: ImageKey<Categories>
  onChange: (key: ImageKey<Categories>) => void
  ease?: string
  padding?: number
  cols: number
  gap?: number
  fab: { margin: number; size: number }
  categories: Categories
  lineHeight?: number
  image: { size: number; padding?: number }
}

const Img: FC<{ height: number; src: string; alt: string }> = ({
  height,
  ...props
}) => (
  <Box
    component="img"
    {...props}
    width="100%"
    height={`${height}px`}
    sx={{ objectFit: "contain" }}
  />
)

const SpeedImageSelect = <Categories extends readonly Category[]>({
  ease = "cubic-bezier(0.4, 0, 0.2, 1)",
  lineHeight = 24,
  padding = 2,
  gap = 8,
  cols,
  fab,
  image,
  categories,
  open,
  onClose,
  selected,
  onChange,
  onOpen,
}: SpeedImageSelectProps<Categories>): JSX.Element => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [scrollable, setScrollable] = useState(false)

  // Reset whenever the catalogue closes so the next open starts fresh.
  useEffect(() => {
    if (!open) setScrollable(false)
  }, [open])

  // Calculate the number of rows and columns needed to display all items.
  const maxImagesLength = categories.reduce(
    (max, category) => Math.max(max, category.images.length),
    0,
  )
  cols = cols <= maxImagesLength ? cols : maxImagesLength
  const rows = categories.reduce(
    (sum, category) => sum + Math.ceil(category.images.length / cols),
    0,
  )

  // Resolve defaults and convert MUI spacing units → px.
  const spacing = 8
  const pxPadding = padding * spacing
  const pxFabMargin = fab.margin * spacing
  const pxImagePadding = (image.padding ?? 0.5) * spacing

  // Calculate the width.
  const imageListWidth =
    cols * // total width of image rows
      (image.size + // image width
        pxImagePadding * 2) + // left & right image padding
    gap * (cols - 1) // total width of gaps between image columns
  const width = imageListWidth + pxPadding * 2 // left & right padding

  // Calculate the height.
  const imageListHeight =
    lineHeight * categories.length + // total height of subheaders
    rows * // total height of image rows
      (image.size + // image height
        pxImagePadding * 2 + // top & bottom image padding
        lineHeight) + // image bar height
    gap * // total height of gaps
      (rows + categories.length - 1) // gaps between image rows and subheaders
  const height = imageListHeight + pxPadding * 2 // top & bottom padding

  // Find the selected image object based on the selected key.
  const selectedImage = categories
    .flatMap(({ images }) => images)
    .find(({ key }) => key === selected)!

  function handleClose(key?: ImageKey<Categories>) {
    setScrollable(false)
    if (key) onChange(key)
    onClose()
  }

  return (
    <>
      {/* Click-away backdrop */}
      {open && (
        <Box
          sx={{ position: "fixed", inset: 0, zIndex: 1 }}
          onClick={() => handleClose()}
        />
      )}
      {/*
      Morphing container pinned at right/bottom so it always grows upward and to
      the left.
      */}
      <Tooltip
        title={`Placing: ${selectedImage.title} — click the map`}
        placement="left"
        disableHoverListener={open}
        disableFocusListener={open}
        disableTouchListener={open}
        open={tooltipOpen}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
      >
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
            bgcolor: open ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 128, 0, 1)",
            padding: open ? `${pxPadding}px` : 0,
            overflow: open && scrollable ? "auto" : "hidden",
            transition: [
              `width 0.3s ${ease}`,
              `height 0.3s ${ease}`,
              `border-radius 0.3s ${ease}`,
              `background-color 0.3s ${ease}`,
              `padding 0.3s ${ease}`,
            ].join(", "),
            animation: open ? "none" : "fabPulse 1.5s ease-in-out infinite",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            if (open) return
            onOpen()
            setTooltipOpen(false)
          }}
          onTransitionEnd={() => {
            if (open) setScrollable(true)
          }}
        >
          {open ? (
            <ImageList
              cols={cols}
              gap={gap}
              sx={{ width: `${imageListWidth}px`, m: 0, p: 0 }}
            >
              {categories.map(({ key: categoryKey, subheader, images }) => (
                <Fragment key={categoryKey}>
                  <ImageListItem cols={cols} sx={{ p: 0, m: 0 }}>
                    <ListSubheader
                      component="div"
                      sx={{
                        backgroundColor: "transparent",
                        color: "common.white",
                        p: 0,
                        lineHeight: `${lineHeight}px`,
                      }}
                    >
                      {subheader}
                    </ListSubheader>
                  </ImageListItem>
                  {images.map(({ key: imageKey, title, src }) => (
                    <ImageListItem
                      key={`${categoryKey}-${imageKey}`}
                      onClick={() =>
                        handleClose(imageKey as ImageKey<Categories>)
                      }
                      sx={{
                        cursor: "pointer",
                        borderRadius: 1,
                        padding: `${pxImagePadding}px`,
                        outline: "2px solid",
                        outlineOffset: "-2px",
                        outlineColor:
                          selected === imageKey ? "green" : "transparent",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                      }}
                    >
                      <Img src={src} alt={title} height={image.size} />
                      <ImageListItemBar
                        title={title}
                        position="below"
                        sx={{
                          [`& .${imageListItemBarClasses.title}`]: {
                            lineHeight: `${lineHeight}px`,
                            p: 0,
                            m: 0,
                            fontSize: "0.75rem",
                            textAlign: "center",
                            color: "common.white",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                          [`& .${imageListItemBarClasses.titleWrap}`]: {
                            p: 0,
                            m: 0,
                          },
                        }}
                      />
                    </ImageListItem>
                  ))}
                </Fragment>
              ))}
            </ImageList>
          ) : (
            <Img
              src={selectedImage.src}
              alt={selectedImage.title}
              height={fab.size * 0.65}
            />
          )}
        </Box>
      </Tooltip>
    </>
  )
}

export default SpeedImageSelect
