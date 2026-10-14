import {
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { type FC, type RefObject, useState } from "react"
import { python, pythonLanguage } from "@codemirror/lang-python"
import { InfoOutline as InfoOutlineIcon } from "@mui/icons-material"

import BaseEditor, {
  type BaseEditorProps,
  type WriteableEditorRef,
} from "../BaseEditor"
import { autocomplete, readOnlyPrefix } from "../../extensions"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useConsoleLogContext,
  useGameCommandIndex,
  usePhaserGameContext,
  usePythonEditorContext,
} from "../../../app/hooks"
import type { CharacterCommand } from "../../../app/character"
import PYTHON_STARTER_CODE from "./starterCode.py?raw"
import { setGameCommands } from "../../../app/slices"
import { usePyodideRunner } from "./usePyodideRunner"

type BasePythonEditorProps = BaseEditorProps

const BasePythonEditor: FC<BasePythonEditorProps> = ({
  extensions,
  ...props
}) => <BaseEditor extensions={[python(), ...extensions]} {...props} />

export type WriteablePythonEditorProps = {
  ref: RefObject<WriteableEditorRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** The `my_van` commands relevant to this level for autocomplete. */
  commands: CharacterCommand[]
}

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const WriteablePythonEditor: FC<WriteablePythonEditorProps> = ({
  ref,
  levelId,
  commands,
}) => {
  const dispatch = useAppDispatch()
  const gameCommandIndex = useGameCommandIndex()
  const { run, ready } = usePyodideRunner()
  const [lineNos, setLineNos] = useState<(number | undefined)[]>([])
  const [errorLineNo, setErrorLineNo] = useState<number | undefined>()
  const consoleLogContext = useConsoleLogContext()
  const { phase, setPhase } = usePhaserGameContext()

  // Interpret the given code using Pyodide.
  const handleInterpret = async (code: string) => {
    consoleLogContext?.setLogs([])
    dispatch(setGameCommands([]))
    setLineNos([])
    setErrorLineNo(undefined)
    const result = await run(code, levelId)
    if (result.ok) {
      const commands = result.commands.map(c => c.command)
      dispatch(setGameCommands(commands))
      setLineNos(result.commands.map(c => c.lineNo))
      return commands
    }
    setPhase("crashed")
    setErrorLineNo(result.lineNo)
    consoleLogContext?.setLogs([{ message: result.message, severity: "error" }])
    return undefined
  }

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center" spacing={1} p={1}>
        <Typography variant="h6">Python Program</Typography>
        <Tooltip title="Use the Python editor below to design your program, then click Play to try it out!">
          <InfoOutlineIcon fontSize="small" />
        </Tooltip>
      </Stack>
      <Divider />
      {ready ? (
        <BasePythonEditor
          mode="write"
          ref={ref}
          starterCode={PYTHON_STARTER_CODE}
          lineNo={errorLineNo ?? lineNos[gameCommandIndex]}
          error={phase === "crashed"}
          onEdit={() => {
            setLineNos([])
            setErrorLineNo(undefined)
          }}
          extensions={[
            readOnlyPrefix(PYTHON_STARTER_CODE),
            autocomplete(
              pythonLanguage,
              /my_van\.\w*/,
              "my_van.",
              commands.map(command => ({
                label: command,
                type: "method",
                apply: `${command}()`,
              })),
            ),
          ]}
          interpret={handleInterpret}
        />
      ) : (
        <Stack direction="row" spacing={1} p={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2">Loading Python...</Typography>
        </Stack>
      )}
    </Stack>
  )
}

export type ReadOnlyPythonEditorProps = {}

/** Mode "blocklyAndPython" - a read-only view of the code generated from
 * the current Blockly blocks; the player can't type into it directly, but
 * it highlights whichever line produced the command currently being
 * animated (see `mapBlocksToPythonLines` for how that line is determined
 * without ever executing this code). */
const ReadOnlyPythonEditor: FC<ReadOnlyPythonEditorProps> = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const gameCommandIndex = useGameCommandIndex()
  const { phase } = usePhaserGameContext()
  const generatedCode = blocklyWorkspaceContext?.generatedCode

  return (
    <BasePythonEditor
      mode="read"
      value={generatedCode?.code ?? PYTHON_STARTER_CODE}
      lineNo={
        generatedCode?.errorLineNo ?? generatedCode?.lineNos[gameCommandIndex]
      }
      error={phase === "crashed"}
      extensions={[]}
    />
  )
}

export interface PythonEditorProps {}

const PythonEditor: FC<PythonEditorProps> = () => {
  const pythonEditorContext = usePythonEditorContext()
  if (!pythonEditorContext)
    throw new ReferenceError("Python workspace context not provided.")

  return pythonEditorContext.mode === "write" ? (
    <WriteablePythonEditor
      ref={pythonEditorContext.ref}
      levelId={pythonEditorContext.levelId}
      commands={pythonEditorContext.commands}
    />
  ) : (
    <ReadOnlyPythonEditor />
  )
}

export default PythonEditor
