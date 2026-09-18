import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Typography,
} from "@mui/material"
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import {
  type FC,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { python } from "@codemirror/lang-python"

import {
  PYTHON_STARTER_CODE,
  type PythonWorkspaceRef,
  usePyodideRunner,
} from "../../pyodide"
import { appendGameCommand, setGameCommands } from "../../app/slices"
import {
  dispatchHighlightedLine,
  highlightLineExtension,
} from "./pythonLineHighlight"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameCommandIndex,
  useGameCommandLines,
  useGameHasFinishedEarly,
  useGameInPlay,
  usePlayIntervalContext,
  usePythonWorkspaceContext,
} from "../../app/hooks"

const localStorageKey = (levelId: number) => `python-code-${levelId}`

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const EditablePythonEditor: FC<{
  ref: RefObject<PythonWorkspaceRef | null>
  levelId: number
}> = ({ ref, levelId }) => {
  const dispatch = useAppDispatch()
  const { run, ready } = usePyodideRunner()
  const gameInPlay = useGameInPlay()
  const gameHasFinishedEarly = useGameHasFinishedEarly()
  const gameCommandIndex = useGameCommandIndex()
  const commandLines = useGameCommandLines()
  const playIntervalContext = usePlayIntervalContext()
  if (!playIntervalContext)
    throw new ReferenceError("Play interval context not provided.")
  const [, setPlayInterval, clearPlayInterval] = playIntervalContext
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  // `localStorage` isn't available during SSR - start with the starter code
  // and swap in any saved code once mounted in the browser (see below).
  const [code, setCode] = useState(PYTHON_STARTER_CODE)
  const [error, setError] = useState<string | null>(null)
  const [commandsOpen, setCommandsOpen] = useState(false)

  // Runs the current code through Pyodide, streaming fresh commands - only
  // invoked when the player presses Play/Run Program, never automatically
  // on edit.
  const codeRef = useRef(code)
  codeRef.current = code
  const runRef = useRef(() => {})
  runRef.current = () => {
    const nextCode = codeRef.current
    localStorage.setItem(localStorageKey(levelId), nextCode)
    setError(null)
    dispatch(setGameCommands({ commands: [], lines: [] }))
    void run(nextCode, levelId, (command, line, block) => {
      dispatch(appendGameCommand({ command, line, block }))
    }).then(result => {
      if (!result.ok) setError(result.message)
    })
  }

  // Expose an imperative "clear"/"run" for the Controls panel.
  useImperativeHandle(
    ref,
    () => ({
      clear: () => setCode(PYTHON_STARTER_CODE),
      run: () => runRef.current(),
    }),
    [],
  )

  // Load any saved code from localStorage once mounted (client-only).
  useEffect(() => {
    const savedCode = localStorage.getItem(localStorageKey(levelId))
    if (savedCode !== null) setCode(savedCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Highlight the line of code whose command is currently being animated,
  // and scroll it into view for long scripts.
  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    const line =
      (gameInPlay || gameHasFinishedEarly) && commandLines[gameCommandIndex]
    dispatchHighlightedLine(view, line || null)
  }, [gameCommandIndex, gameInPlay, gameHasFinishedEarly, commandLines])

  const onChange = (nextCode: string) => {
    setCode(nextCode)
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
          onClick={() => setCommandsOpen(true)}
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
        <CodeMirror
          ref={editorRef}
          value={code}
          extensions={[python(), highlightLineExtension]}
          onChange={onChange}
          height="100%"
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
            if (!clearPlayInterval()) {
              runRef.current()
              setPlayInterval()
            }
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
      <Dialog open={commandsOpen} onClose={() => setCommandsOpen(false)}>
        <DialogTitle>Commands</DialogTitle>
      </Dialog>
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

const PythonEditor: FC = () => {
  const pythonWorkspaceContext = usePythonWorkspaceContext()
  if (!pythonWorkspaceContext)
    throw new ReferenceError("Python workspace context not provided.")

  return pythonWorkspaceContext.mode === "python" ? (
    <EditablePythonEditor
      ref={pythonWorkspaceContext.ref}
      levelId={pythonWorkspaceContext.levelId}
    />
  ) : (
    <ReadOnlyPythonEditor />
  )
}

export default PythonEditor
