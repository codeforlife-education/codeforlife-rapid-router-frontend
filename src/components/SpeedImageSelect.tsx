import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Portal,
  Tooltip,
  imageListItemBarClasses,
} from "@mui/material"
import { type FC, Fragment, type JSX, useEffect, useState } from "react"

import MarqueeTitle from "./MarqueeTitle"
import { useBreakpoint } from "../app/hooks"

type Image = {
  key: string | number
  title: string
  src: string
  rotate?: number
}
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
  gap?: number
  fab?: { margin: number; size: number }
  categories: Categories
  lineHeight?: number
  titleScrollSpeed?: number
  image?: { size: number; padding?: number }
}

const Img: FC<{
  height: number
  src: string
  alt: string
  rotate?: number
}> = ({ height, ...props }) => (
  <Box
    component="img"
    {...props}
    width="100%"
    height={`${height}px`}
    sx={{
      objectFit: "contain",
      rotate: props.rotate ? `${props.rotate}deg` : undefined,
    }}
  />
)

const SpeedImageSelect = <Categories extends readonly Category[]>({
  ease = "cubic-bezier(0.4, 0, 0.2, 1)",
  lineHeight = 24,
  titleScrollSpeed,
  padding = 2,
  gap = 8,
  fab = { size: 64, margin: 2 },
  image = { size: 64 },
  categories,
  open,
  onClose,
  selected,
  onChange,
  onOpen,
}: SpeedImageSelectProps<Categories>): JSX.Element => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [scrollable, setScrollable] = useState(false)
  const breakpoint = useBreakpoint()

  // Reset whenever the catalogue closes so the next open starts fresh.
  useEffect(() => {
    if (!open) setScrollable(false)
  }, [open])

  // Calculate the number of rows and columns needed to display all items.
  const maxImagesLength = categories.reduce(
    (max, category) => Math.max(max, category.images.length),
    0,
  )
  let cols = {
    xs: 3,
    sm: 4,
    md: 5,
    lg: 6,
    xl: 7,
  }[breakpoint]
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
  const pxImageSize = image.size

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

  const ImageItem: FC<{ image: Image }> = ({ image }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    return (
      <Tooltip
        title={image.title}
        placement="bottom"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, lineHeight * -1.5],
                },
              },
            ],
          },
        }}
        open={tooltipOpen}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
      >
        <ImageListItem
          onClick={() => handleClose(image.key as ImageKey<Categories>)}
          sx={{
            cursor: "pointer",
            borderRadius: 1,
            padding: `${pxImagePadding}px`,
            outline: "2px solid",
            outlineOffset: "-2px",
            outlineColor: selected === image.key ? "green" : "transparent",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            minWidth: 0,
            maxWidth: `${pxImageSize + pxImagePadding * 2}px`,
          }}
        >
          <Img
            src={image.src}
            alt={image.title}
            rotate={image.rotate}
            height={pxImageSize}
          />
          <ImageListItemBar
            title={
              <MarqueeTitle
                title={image.title}
                lineHeight={lineHeight}
                speed={titleScrollSpeed}
              />
            }
            position="below"
            sx={{
              [`& .${imageListItemBarClasses.title}`]: {
                p: 0,
                m: 0,
                fontSize: "0.75rem",
                color: tooltipOpen ? "transparent" : "common.white",
                maxWidth: "100%",
              },
              [`& .${imageListItemBarClasses.titleWrap}`]: {
                p: 0,
                m: 0,
              },
            }}
          />
        </ImageListItem>
      </Tooltip>
    )
  }

  return (
    // Portal is used to render the catalogue outside of the normal DOM
    // hierarchy, allowing it to overlay other content.
    <Portal>
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
        title="Click to open"
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
            animation: open ? "none" : "pulse 1.5s ease-in-out infinite",
            cursor: "pointer",
            display: "flex",
            // flex-start avoids the classic centering bug where overflowing
            // content is clipped equally above/below and the top becomes
            // unreachable when scrolling; margin:auto on the child instead
            // provides "safe centering" when the content actually fits.
            alignItems: open ? "flex-start" : "center",
            justifyContent: open ? "flex-start" : "center",
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
              sx={{
                width: `${imageListWidth}px`,
                m: "auto",
                p: 0,
                userSelect: "none",
              }}
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
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {subheader}
                    </ListSubheader>
                  </ImageListItem>
                  {images.map(image => (
                    <ImageItem
                      key={`${categoryKey}-${image.key}`}
                      image={image}
                    />
                  ))}
                </Fragment>
              ))}
            </ImageList>
          ) : (
            <Img
              src={selectedImage.src}
              alt={selectedImage.title}
              rotate={selectedImage.rotate}
              height={fab.size * 0.65}
            />
          )}
        </Box>
      </Tooltip>
    </Portal>
  )
}

export default SpeedImageSelect
