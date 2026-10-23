import { type FC, type RefObject, useState } from "react"
import { python, pythonLanguage } from "@codemirror/lang-python"

import BaseEditor, {
  type ReadOnlyEditorProps,
  type WriteableEditorProps,
  type WriteableEditorRef,
} from "../BaseEditor"
import type {
  ExportedOrthogonalTilemap,
  TilemapGroup,
} from "../../../phaser/tilemaps"
import { autocomplete, readOnlyPrefix } from "../../extensions"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useConsoleLogContext,
  useGameCommandIndex,
  usePythonEditorContext,
} from "../../../app/hooks"
import type { CharacterCommand } from "../../../app/character"
import PYTHON_STARTER_CODE from "./starterCode.py?raw"
import { setGameCommands } from "../../../app/slices"
import { usePyodideRunner } from "./usePyodideRunner"

type BasePythonEditorProps =
  | ({ mode: "read" } & Omit<ReadOnlyEditorProps, "language">)
  | ({ mode: "write" } & Omit<WriteableEditorProps, "language">)

const BasePythonEditor: FC<BasePythonEditorProps> = ({
  extensions,
  ...props
}) => (
  <BaseEditor
    language="Python"
    extensions={[python(), ...extensions]}
    {...props}
  />
)

export type WriteablePythonEditorProps = {
  ref: RefObject<WriteableEditorRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** The `my_van` commands relevant to this level for autocomplete. */
  commands: readonly CharacterCommand[]
} & (
  | { tilemapGroup: TilemapGroup; tilemap: undefined }
  | { tilemapGroup: undefined; tilemap: ExportedOrthogonalTilemap }
)

/** Mode "python" - a real editor whose code runs via Pyodide to drive the game. */
const WriteablePythonEditor: FC<WriteablePythonEditorProps> = ({
  ref,
  levelId,
  commands,
  tilemapGroup,
  tilemap,
}) => {
  const dispatch = useAppDispatch()
  const gameCommandIndex = useGameCommandIndex()
  const { run, ready } = usePyodideRunner()
  const [lineNos, setLineNos] = useState<(number | undefined)[]>([])
  const [errorLineNo, setErrorLineNo] = useState<number | undefined>()
  const consoleLogContext = useConsoleLogContext()

  // Interpret the given code using Pyodide.
  const handleInterpret = async (code: string) => {
    consoleLogContext?.setLogs([])
    dispatch(setGameCommands([]))
    setLineNos([])
    setErrorLineNo(undefined)
    const result = await run({ code, levelId, tilemapGroup, tilemap })
    if (result.ok) {
      setLineNos(result.commands.map(c => c.lineNo))
      return result.commands.map(c => c.command)
    }
    setErrorLineNo(result.lineNo)
    consoleLogContext?.setLogs([{ message: result.message, severity: "error" }])
    return undefined
  }

  return (
    <BasePythonEditor
      mode="write"
      ref={ref}
      starterCode={PYTHON_STARTER_CODE}
      levelId={levelId}
      ready={ready}
      lineNo={errorLineNo ?? lineNos[gameCommandIndex]}
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
  const generatedCode = blocklyWorkspaceContext?.generatedCode

  return (
    <BasePythonEditor
      mode="read"
      value={generatedCode?.code ?? PYTHON_STARTER_CODE}
      lineNo={
        generatedCode?.errorLineNo ?? generatedCode?.lineNos[gameCommandIndex]
      }
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
    <WriteablePythonEditor {...pythonEditorContext} />
  ) : (
    <ReadOnlyPythonEditor />
  )
}

export default PythonEditor
