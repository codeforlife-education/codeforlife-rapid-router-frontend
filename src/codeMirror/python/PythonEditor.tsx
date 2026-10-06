import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material"
import { type FC, type RefObject, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"

import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  usePlayIntervalContext,
  usePythonEditorContext,
} from "../../app/hooks"
import BaseEditor from "../BaseEditor"
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
  const playIntervalContext = usePlayIntervalContext()
  if (!playIntervalContext)
    throw new ReferenceError("Play interval context not provided.")
  const [, setPlayInterval, clearPlayInterval] = playIntervalContext
  const [error, setError] = useState<string | null>(null)
  const [commandsModalOpen, setCommandsModalOpen] = useState(false)

  // Runs the given code through Pyodide - only invoked when the player
  // presses Play/Run Program, never automatically on edit. The editor is
  // locked (see `editable` below) for the whole time the game is in play,
  // so playback only starts once the full command list is ready.
  const handleRun = (code: string) => {
    setError(null)
    dispatch(setGameCommands([]))
    void run(code, levelId).then(result => {
      if (result.ok) {
        dispatch(
          setGameCommands(
            result.commands.map((command, i) => ({
              command,
              lineNo: result.commandLines[i],
            })),
          ),
        )
        setPlayInterval()
      } else {
        setError(result.message)
      }
    })
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
        <BaseEditor
          ref={ref}
          starterCode={PYTHON_STARTER_CODE}
          extensions={[python()]}
          onRun={handleRun}
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
 * the current Blockly blocks; the player can't type into it directly. */
const ReadOnlyPythonEditor: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <CodeMirror
        value={blocklyWorkspaceContext?.pythonCode ?? PYTHON_STARTER_CODE}
        extensions={[python()]}
        editable={false}
        height="100%"
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
    <ReadOnlyPythonEditor />
  )
}

export default PythonEditor
