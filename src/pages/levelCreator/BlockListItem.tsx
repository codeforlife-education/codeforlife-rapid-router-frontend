import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material"
import { type FC, useCallback } from "react"

import { type BlockDefinition } from "../../blockly/utils"
import { BlockPreview } from "../../blockly"
import { type BlockType } from "../../blockly/blocks"

/** The number of instances of a block a player can use, or unlimited. */
export type BlockCount = number | "infinite"

const BLOCK_COUNT_OPTIONS: BlockCount[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "infinite",
]

export interface BlockListItemProps {
  block: BlockDefinition<BlockType>
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  count: BlockCount
  onCountChange: (count: BlockCount) => void
  /** Width of the slot reserved for the block preview, so previews of
   * different sizes don't push the count selector out of alignment. */
  previewSlotWidth?: number
  /** Called with the block's natural preview width once it's measured. */
  onPreviewWidth?: (width: number) => void
}

const BlockListItem: FC<BlockListItemProps> = ({
  block,
  enabled,
  onEnabledChange,
  count,
  onCountChange,
  previewSlotWidth,
  onPreviewWidth,
}) => {
  const labelId = `block-count-label-${block.type}`

  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target
    onCountChange(value === "infinite" ? "infinite" : Number(value))
  }

  const handlePreviewSize = useCallback(
    (size: { width: number; height: number }) => {
      onPreviewWidth?.(size.width)
    },
    [onPreviewWidth],
  )

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Checkbox
        checked={enabled}
        onChange={event => onEnabledChange(event.target.checked)}
      />
      <Box
        sx={{
          width: previewSlotWidth,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <BlockPreview blockType={block.type} onSize={handlePreviewSize} />
      </Box>
      <FormControl
        size="small"
        disabled={!enabled}
        sx={{ ml: "auto", minWidth: 80 }}
      >
        <InputLabel id={labelId}>Count</InputLabel>
        <Select
          labelId={labelId}
          label="Count"
          value={String(count)}
          onChange={handleChange}
        >
          {BLOCK_COUNT_OPTIONS.map(option => (
            <MenuItem key={option} value={option}>
              {option === "infinite" ? "∞" : option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default BlockListItem
