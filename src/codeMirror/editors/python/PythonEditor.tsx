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

import { autocomplete, readOnlyPrefix } from "../../extensions"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useConsoleLogContext,
  useGameCommandIndex,
  usePhaserGameContext,
  usePythonEditorContext,
} from "../../../app/hooks"
import BaseEditableEditor from "../BaseEditableEditor"
import BaseNonEditableEditor from "../BaseNonEditableEditor"
import type { CharacterCommand } from "../../../app/character"
import PYTHON_STARTER_CODE from "./starterCode.py?raw"
import type { PythonEditorRef } from "./PythonEditorContext"
import { setGameCommands } from "../../../app/slices"
import { usePyodideRunner } from "./usePyodideRunner"

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const EditablePythonEditor: FC<{
  ref: RefObject<PythonEditorRef | null>
  levelId: number
  commands?: CharacterCommand[]
}> = ({ ref, levelId, commands }) => {
  const dispatch = useAppDispatch()
  const gameCommandIndex = useGameCommandIndex()
  const { run, ready } = usePyodideRunner()
  const [lineNos, setLineNos] = useState<(number | undefined)[]>([])
  const consoleLogContext = useConsoleLogContext()
  const { setPhase } = usePhaserGameContext()

  // Interpret the given code using Pyodide.
  const handleInterpret = async (code: string) => {
    consoleLogContext?.setLogs([])
    dispatch(setGameCommands([]))
    setLineNos([])
    const result = await run(code, levelId)
    if (result.ok) {
      dispatch(setGameCommands(result.commands.map(c => c.command)))
      setLineNos(result.commands.map(c => c.lineNo))
    } else {
      setPhase("idle")
      consoleLogContext?.setLogs([
        { message: result.message, severity: "error" },
      ])
    }
    return result.ok
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
        <BaseEditableEditor
          ref={ref}
          starterCode={PYTHON_STARTER_CODE}
          lineNo={lineNos[gameCommandIndex]}
          extensions={[
            python(),
            readOnlyPrefix(PYTHON_STARTER_CODE),
            autocomplete(
              pythonLanguage,
              /my_van\.\w*/,
              "my_van.",
              (commands ?? []).map(command => ({
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

/** Mode "blocklyAndPython" - a read-only view of the code generated from
 * the current Blockly blocks; the player can't type into it directly, but
 * it highlights whichever line produced the command currently being
 * animated (see `mapBlocksToPythonLines` for how that line is determined
 * without ever executing this code). */
const NonEditablePythonEditor: FC = () => {
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const gameCommandIndex = useGameCommandIndex()

  return (
    <BaseNonEditableEditor
      value={blocklyWorkspaceContext?.generatedCode.code ?? PYTHON_STARTER_CODE}
      lineNo={blocklyWorkspaceContext?.generatedCode.lineNos[gameCommandIndex]}
      extensions={[python()]}
    />
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
