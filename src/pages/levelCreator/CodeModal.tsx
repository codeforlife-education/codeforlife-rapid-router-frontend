import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { type FC, useCallback, useEffect, useState } from "react"
import { Close as CloseIcon } from "@mui/icons-material"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

import BlockListItem, { type BlockCount } from "./BlockListItem"
import {
  DELETABLE_CUSTOM_BLOCKS,
  type DeletableBlockType,
} from "../../blockly/blocks"

const LANGUAGE_OPTIONS = {
  Blockly: "Solve your level using Blockly blocks only.",
  "Blockly with Python view":
    "As you play your level with Blockly, you will see the equivalent Python translation in a code editor.",
  Python: "Solve your level using Python code only.",
} as const satisfies Record<string, string>
type Language = keyof typeof LANGUAGE_OPTIONS

export interface Code {
  language: Language
  maxMoves: number
  blocks: Record<DeletableBlockType, { count: BlockCount; enabled: boolean }>
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
const BLOCK_ROWS_TWO_COLUMNS = Math.ceil(DELETABLE_CUSTOM_BLOCKS.length / 2)
const BLOCK_ROWS_THREE_COLUMNS = Math.ceil(DELETABLE_CUSTOM_BLOCKS.length / 3)

export interface CodeModalProps {
  open: boolean
  value: Code
  onClose: () => void
  onSubmit: (value: Code) => void
}

const CodeModal: FC<CodeModalProps> = ({ open, value, onClose, onSubmit }) => {
  const [code, setCode] = useState(value)

  // Discard any unsaved edits and restore the last saved values whenever the
  // modal is (re)opened.
  useEffect(() => {
    if (open) setCode(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Track the widest rendered block preview so every row reserves the same
  // width for its preview, keeping the count selectors aligned regardless
  // of how wide/narrow any individual block's preview is.
  const [previewSlotWidth, setPreviewSlotWidth] = useState(0)

  const handlePreviewWidth = useCallback((width: number) => {
    setPreviewSlotWidth(prev => Math.max(prev, width))
  }, [])

  const enabledCount = Object.values(code.blocks).filter(
    ({ enabled }) => enabled,
  ).length
  const allEnabled = enabledCount === DELETABLE_CUSTOM_BLOCKS.length
  const someEnabled = enabledCount > 0 && !allEnabled

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked: enabled } = event.target
    setCode(prev => ({
      ...prev,
      blocks: Object.fromEntries(
        DELETABLE_CUSTOM_BLOCKS.map(({ type }) => [
          type,
          { ...prev.blocks[type], enabled },
        ]),
      ) as Code["blocks"],
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(code)
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
              value={code.language}
              onChange={event =>
                setCode(prev => ({ ...prev, language: event.target.value }))
              }
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
            value={code.maxMoves}
            onChange={event => {
              const value = Number(event.target.value)
              if (Number.isNaN(value)) return
              setCode(prev => ({
                ...prev,
                maxMoves: Math.min(100, Math.max(1, value)),
              }))
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
        {code.language !== "Python" && (
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
                  xs: `repeat(${DELETABLE_CUSTOM_BLOCKS.length}, auto)`,
                  md: `repeat(${BLOCK_ROWS_TWO_COLUMNS}, auto)`,
                  lg: `repeat(${BLOCK_ROWS_THREE_COLUMNS}, auto)`,
                },
                gridAutoFlow: "column",
                rowGap: 1.5,
                columnGap: 4,
              }}
            >
              {DELETABLE_CUSTOM_BLOCKS.map(block => (
                <BlockListItem
                  key={block.type}
                  block={block}
                  enabled={code.blocks[block.type].enabled}
                  onEnabledChange={enabled =>
                    setCode(prev => ({
                      ...prev,
                      blocks: {
                        ...prev.blocks,
                        [block.type]: { ...prev.blocks[block.type], enabled },
                      },
                    }))
                  }
                  count={code.blocks[block.type].count}
                  onCountChange={count =>
                    setCode(prev => ({
                      ...prev,
                      blocks: {
                        ...prev.blocks,
                        [block.type]: { ...prev.blocks[block.type], count },
                      },
                    }))
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
