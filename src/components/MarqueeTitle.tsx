import { type FC, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Box } from "@mui/material"
import { keyframes } from "@emotion/react"

export interface MarqueeTitleProps {
  title: string
  lineHeight: number
  speed?: number
}

// Scrolls right to reveal the end of an overflowing title, pauses, then
// scrolls back to the start and pauses again, looping forever — similar to
// how music players (e.g. Spotify) handle long titles.
const MarqueeTitle: FC<MarqueeTitleProps> = ({
  title,
  lineHeight,
  speed = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)

  // Measure how much the text overflows its container so we know whether to
  // scroll at all, and how far to scroll. Bounding rects (rather than
  // scrollWidth/clientWidth) give sub-pixel precision, so the animation
  // stops with the last character landing exactly on the container's right
  // edge instead of over- or undershooting it.
  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const measure = () => {
      const overflow =
        text.getBoundingClientRect().width -
        container.getBoundingClientRect().width
      setDistance(overflow > 0 ? overflow : 0)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(text)
    return () => observer.disconnect()
  }, [title])

  const scrolling = distance > 0
  // Roughly constant scroll speed regardless of overflow distance, with a
  // minimum duration so short overflows aren't jarringly fast.
  const duration = Math.max(4, distance / speed + 2)
  // Bake the exact measured distance into the keyframes themselves (rather
  // than a CSS variable) so the scroll always ends precisely at the edge.
  const marquee = useMemo(
    () => keyframes`
      0%, 10% { transform: translateX(0); }
      45%, 55% { transform: translateX(${-distance}px); }
      90%, 100% { transform: translateX(0); }
    `,
    [distance],
  )

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        justifyContent: scrolling ? "flex-start" : "center",
        overflow: "hidden",
        maxWidth: "100%",
        lineHeight: `${lineHeight}px`,
      }}
    >
      <Box
        component="span"
        ref={textRef}
        sx={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: scrolling
            ? `${marquee} ${duration}s linear infinite`
            : "none",
        }}
      >
        {title}
      </Box>
    </Box>
  )
}

export default MarqueeTitle
