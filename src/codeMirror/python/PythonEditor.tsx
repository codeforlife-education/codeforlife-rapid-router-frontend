import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material"
import { type FC, type RefObject, useState } from "react"
import { python } from "@codemirror/lang-python"

import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  usePythonEditorContext,
} from "../../app/hooks"
import BaseEditableEditor from "../BaseEditableEditor"
import BaseNonEditableEditor from "../BaseNonEditableEditor"
import type { CharacterCommand } from "../../app/character"
import CommandsModal from "../CommandsModal"
import PYTHON_STARTER_CODE from "./starterCode.py?raw"
import type { PythonEditorRef } from "./PythonEditorContext"
import { setGameCommands } from "../../app/slices"
import { usePyodideRunner } from "./usePyodideRunner"

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const EditablePythonEditor: FC<{
  ref: RefObject<PythonEditorRef | null>
  levelId: number
  commands?: CharacterCommand[]
}> = ({ ref, levelId, commands }) => {
  const dispatch = useAppDispatch()
  const { run, ready } = usePyodideRunner()
  const [error, setError] = useState<string | null>(null)
  const [commandsModalOpen, setCommandsModalOpen] = useState(false)

  // Interpret the given code using Pyodide.
  const handleInterpret = async (code: string) => {
    setError(null)
    dispatch(setGameCommands([]))
    const result = await run(code, levelId)
    if (result.ok) dispatch(setGameCommands(result.commands))
    else setError(result.message)
    return result.ok
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" sx={{ px: 1, pt: 1 }}>
        Python Program
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 1,
          pb: 1,
        }}
      >
        <Typography variant="body2">
          Use the Python editor below to design your program, then click Play to
          try it out!
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ flexShrink: 0 }}
          onClick={() => setCommandsModalOpen(true)}
        >
          Commands
        </Button>
      </Box>
      {!ready && (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, pb: 1 }}
        >
          <CircularProgress size={16} />
          <Typography variant="body2">Loading Python...</Typography>
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <BaseEditableEditor
          ref={ref}
          starterCode={PYTHON_STARTER_CODE}
          extensions={[python()]}
          interpret={handleInterpret}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: "grey.900",
          px: 1,
          py: 0.5,
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (!clearPlayInterval()) ref.current?.run()
          }}
        >
          Run Program
        </Button>
      </Box>
      <Typography variant="h6" sx={{ px: 1, pt: 1 }}>
        Console Log
      </Typography>
      <Box sx={{ flexShrink: 0, maxHeight: "20%", overflow: "auto", p: 1 }}>
        {error && (
          <Alert severity="error" sx={{ whiteSpace: "pre-wrap" }}>
            {error}
          </Alert>
        )}
      </Box>
      <CommandsModal
        open={commandsModalOpen}
        language="Python"
        commands={commands ?? []}
        getSignature={command => `my_van.${command}()`}
        onClose={() => setCommandsModalOpen(false)}
      />
    </Box>
  )
}

/** Mode "blocklyAndPython" - a read-only view of the code generated from
 * the current Blockly blocks; the player can't type into it directly, but
 * it highlights whichever line produced the command currently being
 * animated (see `mapBlocksToPythonLines` for how that line is determined
 * without ever executing this code). */
const NonEditablePythonEditor: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <BaseNonEditableEditor
        value={blocklyWorkspaceContext?.code ?? PYTHON_STARTER_CODE}
        extensions={[python()]}
      />
    </Box>
  )
}

export interface PythonEditorProps {}

const PythonEditor: FC<PythonEditorProps> = () => {
  const pythonEditorContext = usePythonEditorContext()
  if (!pythonEditorContext)
    throw new ReferenceError("Python workspace context not provided.")

  return pythonEditorContext.editable ? (
    <EditablePythonEditor
      ref={pythonEditorContext.ref}
      levelId={pythonEditorContext.levelId}
      commands={pythonEditorContext.commands}
    />
  ) : (
    <NonEditablePythonEditor />
  )
}

export default PythonEditor
