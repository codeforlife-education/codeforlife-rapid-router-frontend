import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material"
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
  type VanMethod,
  usePyodideRunner,
} from "."
import {
  dispatchHighlightedLine,
  highlightLineExtension,
} from "./lineHighlight"
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
import CommandsModal from "./CommandsModal"
import { setGameCommands } from "../../app/slices"

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const EditablePythonEditor: FC<{
  ref: RefObject<PythonWorkspaceRef | null>
  levelId: number
  commands?: VanMethod[]
}> = ({ ref, levelId, commands }) => {
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
  const [code, setCode] = useState(PYTHON_STARTER_CODE)
  const [error, setError] = useState<string | null>(null)
  const [commandsOpen, setCommandsOpen] = useState(false)

  // Runs the current code through Pyodide - only invoked when the player
  // presses Play/Run Program, never automatically on edit. The editor is
  // locked (see `editable` below) for the whole time the game is in play,
  // so playback only starts once the full command list is ready.
  const codeRef = useRef(code)
  codeRef.current = code
  const runRef = useRef(() => {})
  runRef.current = () => {
    const nextCode = codeRef.current
    setError(null)
    dispatch(setGameCommands({ commands: [], lines: [] }))
    void run(nextCode, levelId).then(result => {
      if (result.ok) {
        dispatch(
          setGameCommands({
            commands: result.commands,
            lines: result.commandLines,
          }),
        )
        setPlayInterval()
      } else {
        setError(result.message)
      }
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
          editable={!gameInPlay}
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
            if (!clearPlayInterval()) runRef.current()
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
        open={commandsOpen}
        commands={commands ?? []}
        onClose={() => setCommandsOpen(false)}
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

const PythonEditor: FC = () => {
  const pythonWorkspaceContext = usePythonWorkspaceContext()
  if (!pythonWorkspaceContext)
    throw new ReferenceError("Python workspace context not provided.")

  return pythonWorkspaceContext.mode === "python" ? (
    <EditablePythonEditor
      ref={pythonWorkspaceContext.ref}
      levelId={pythonWorkspaceContext.levelId}
      commands={pythonWorkspaceContext.commands}
    />
  ) : (
    <ReadOnlyPythonEditor />
  )
}

export default PythonEditor
