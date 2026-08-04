import { type FC, useCallback, useState } from "react"
import Select, { type SelectChangeEvent } from "@mui/material/Select"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import { Close as CloseIcon } from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Modal from "@mui/material/Modal"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import BlockListItem, { type BlockCount } from "./BlockListItem"
import {
  CUSTOM_BLOCKS,
  START_BLOCK_TYPES,
  type StartBlockType,
} from "../../blockly/blocks"

// The start block isn't an optional, player-selectable block like the others -
// it's always present, so it's excluded from this list.
const BLOCKS = CUSTOM_BLOCKS.filter(
  ({ type }) => !START_BLOCK_TYPES.includes(type as StartBlockType),
)

const LANGUAGE_OPTIONS: Record<string, string> = {
  Blockly:
    "Solve your level using Blockly blocks only. Select which ones below.",
  "Blockly with Python view":
    "As you play your level with Blockly, you will see the equivalent Python translation in a code editor.",
  Python: "Solve your level using Python code only.",
}

const LanguageOptionLabel: FC<{ label: string; tooltip: string }> = ({
  label,
  tooltip,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1,
      width: "100%",
    }}
  >
    {label}
    <Tooltip title={tooltip}>
      <InfoOutlinedIcon
        fontSize="small"
        sx={{ color: "text.secondary" }}
        onMouseDown={event => event.stopPropagation()}
      />
    </Tooltip>
  </Box>
)

// Used to fill the multi-column grid layouts column-by-column (top to
// bottom in the first column, then top to bottom in the next, and so on)
// instead of the grid's default row-by-row fill order.
const BLOCK_ROWS_TWO_COLUMNS = Math.ceil(BLOCKS.length / 2)
const BLOCK_ROWS_THREE_COLUMNS = Math.ceil(BLOCKS.length / 3)

export interface CodeModalProps {
  open: boolean
  onClose: () => void
}

const CodeModal: FC<CodeModalProps> = ({ open, onClose }) => {
  const [language, setLanguage] = useState("Blockly")

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
  }

  const [blockCounts, setBlockCounts] = useState<Record<string, BlockCount>>(
    () => Object.fromEntries(BLOCKS.map(block => [block.type, "infinite"])),
  )

  const handleBlockCountChange = (type: string, count: BlockCount) => {
    setBlockCounts(prev => ({ ...prev, [type]: count }))
  }

  const [blockEnabled, setBlockEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(BLOCKS.map(block => [block.type, true])),
  )

  const handleBlockEnabledChange = (type: string, enabled: boolean) => {
    setBlockEnabled(prev => ({ ...prev, [type]: enabled }))
  }

  // Track the widest rendered block preview so every row reserves the same
  // width for its preview, keeping the count selectors aligned regardless
  // of how wide/narrow any individual block's preview is.
  const [previewSlotWidth, setPreviewSlotWidth] = useState(0)

  const handlePreviewWidth = useCallback((width: number) => {
    setPreviewSlotWidth(prev => Math.max(prev, width))
  }, [])

  const enabledCount = Object.values(blockEnabled).filter(Boolean).length
  const allEnabled = enabledCount === BLOCKS.length
  const someEnabled = enabledCount > 0 && !allEnabled

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = event.target
    setBlockEnabled(
      Object.fromEntries(BLOCKS.map(block => [block.type, checked])),
    )
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "90%",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3">Code</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          Here you can select the code you can use while playing your new level!
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControl>
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              id="language-select"
              label="Language"
              value={language}
              onChange={handleChange}
              MenuProps={{
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
                transformOrigin: { vertical: "top", horizontal: "left" },
              }}
              renderValue={value => (
                <LanguageOptionLabel
                  label={value}
                  tooltip={LANGUAGE_OPTIONS[value]}
                />
              )}
            >
              {Object.entries(LANGUAGE_OPTIONS).map(([label, tooltip]) => (
                <MenuItem key={label} value={label}>
                  <LanguageOptionLabel label={label} tooltip={tooltip} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {language !== "Python" && (
          <>
            <Typography variant="h6">Blocks</Typography>
            <FormControlLabel
              label="Select all"
              control={
                <Checkbox
                  checked={allEnabled}
                  indeterminate={someEnabled}
                  onChange={handleSelectAllChange}
                />
              }
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                },
                gridTemplateRows: {
                  xs: `repeat(${BLOCKS.length}, auto)`,
                  lg: `repeat(${BLOCK_ROWS_TWO_COLUMNS}, auto)`,
                  xl: `repeat(${BLOCK_ROWS_THREE_COLUMNS}, auto)`,
                },
                gridAutoFlow: "column",
                rowGap: 1.5,
                columnGap: 4,
              }}
            >
              {BLOCKS.map(block => (
                <BlockListItem
                  key={block.type}
                  block={block}
                  enabled={blockEnabled[block.type]}
                  onEnabledChange={(enabled: boolean) =>
                    handleBlockEnabledChange(block.type, enabled)
                  }
                  count={blockCounts[block.type]}
                  onCountChange={count =>
                    handleBlockCountChange(block.type, count)
                  }
                  previewSlotWidth={previewSlotWidth || undefined}
                  onPreviewWidth={handlePreviewWidth}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default CodeModal
