import { type FC, useLayoutEffect, useRef } from "react"
import Box from "@mui/material/Box"

import { initializeBlockPreview } from "./utils"

export interface BlockPreviewProps {
  blockType: string
  /** Called with the block's rendered size once it's been measured. */
  onSize?: (size: { width: number; height: number }) => void
}

const BlockPreview: FC<BlockPreviewProps> = ({ blockType, onSize }) => {
  const divRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!divRef.current) return

    const { workspace, size } = initializeBlockPreview(
      divRef.current,
      blockType,
    )

    onSize?.(size)

    return () => workspace.dispose()
  }, [blockType, onSize])

  return (
    <Box
      ref={divRef}
      sx={{
        flexShrink: 0,
        pointerEvents: "none",
      }}
    />
  )
}

export default BlockPreview
