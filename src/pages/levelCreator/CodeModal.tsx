import { type FC, useCallback, useEffect, useState } from "react"
import { Select, type SelectChangeEvent } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import { Close as CloseIcon } from "@mui/icons-material"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import BlockListItem, { type BlockCount } from "./BlockListItem"
import { CUSTOM_BLOCKS, START_BLOCK_TYPES } from "../../blockly/blocks"

// The start block isn't an optional, player-selectable block like the others -
// it's always present, so it's excluded from this list.
const BLOCKS = CUSTOM_BLOCKS.filter(
  block => !(START_BLOCK_TYPES as readonly string[]).includes(block.type),
)

export interface CodeSettings {
  language: string
  maxMoves: number
  blockCounts: Record<string, BlockCount>
  blockEnabled: Record<string, boolean>
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_CODE_SETTINGS: CodeSettings = {
  language: "Blockly",
  maxMoves: 50,
  blockCounts: Object.fromEntries(
    BLOCKS.map(block => [block.type, "infinite"]),
  ),
  blockEnabled: Object.fromEntries(BLOCKS.map(block => [block.type, true])),
}

const LANGUAGE_OPTIONS: Record<string, string> = {
  Blockly: "Solve your level using Blockly blocks only.",
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
  value: CodeSettings
  onClose: () => void
  onSubmit: (value: CodeSettings) => void
}

const CodeModal: FC<CodeModalProps> = ({ open, value, onClose, onSubmit }) => {
  const [language, setLanguage] = useState(value.language)

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
  }

  const [maxMoves, setMaxMoves] = useState(value.maxMoves)

  const [blockCounts, setBlockCounts] = useState(value.blockCounts)

  const handleBlockCountChange = (type: string, count: BlockCount) => {
    setBlockCounts(prev => ({ ...prev, [type]: count }))
  }

  const [blockEnabled, setBlockEnabled] = useState(value.blockEnabled)

  // Discard any unsaved edits and restore the last saved values whenever the
  // modal is (re)opened.
  useEffect(() => {
    if (open) {
      setLanguage(value.language)
      setMaxMoves(value.maxMoves)
      setBlockCounts(value.blockCounts)
      setBlockEnabled(value.blockEnabled)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ language, maxMoves, blockCounts, blockEnabled })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
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
          <IconButton onClick={onClose} size="small" type="button">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>
          Here you can select the code you can use while playing your new level!
        </Typography>
        <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "flex-start" }}>
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
          <TextField
            type="number"
            label="Max steps"
            variant="outlined"
            size="medium"
            value={maxMoves}
            onChange={event => {
              const value = Number(event.target.value)
              if (!Number.isNaN(value)) {
                setMaxMoves(Math.min(100, Math.max(1, value)))
              }
            }}
            slotProps={{ htmlInput: { min: 1, max: 100, size: 4 } }}
            sx={{
              width: "fit-content",
              // The shared theme forces a black border onto the filled
              // variant's root, which conflicts with this field's outlined
              // fieldset border, so it needs to be removed here.
              "& .MuiOutlinedInput-root": { border: "none !important" },
            }}
          />
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
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gridTemplateRows: {
                  xs: `repeat(${BLOCKS.length}, auto)`,
                  md: `repeat(${BLOCK_ROWS_TWO_COLUMNS}, auto)`,
                  lg: `repeat(${BLOCK_ROWS_THREE_COLUMNS}, auto)`,
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
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Button type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CodeModal
