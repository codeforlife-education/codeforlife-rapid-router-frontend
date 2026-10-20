import {
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
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
import type { Extension } from "@codemirror/state"
import { InfoOutline as InfoOutlineIcon } from "@mui/icons-material"

import { type GameCommand, setGameCommands } from "../../app/slices"
import { dispatchHighlightedLine, highlightLine } from "../extensions"
import { useAppDispatch, usePhaserGameContext } from "../../app/hooks"

type EditorProps = {
  value: string
  editable: boolean
  /** Whether the editor is ready to be displayed. */
  ready: boolean
  /** The programming language of the editor (e.g. "Python"). */
  language: string
  /** The source line (1-indexed) currently being animated, or `undefined` to
   * clear the highlight - resolved by the caller, which owns whatever
   * mapping of command index to line applies to its own mode. */
  lineNo?: number
  /** Language-specific CodeMirror extensions (e.g. `python()`). */
  extensions: Extension[]
  onChange?: (value: string) => void
}

/**
 * The CodeMirror instance shared by every code-editing/viewing mode,
 * editable or not - highlights whichever line produced the command
 * currently being animated, scrolling it into view.
 */
const Editor: FC<EditorProps> = ({
  value,
  editable,
  ready,
  language,
  lineNo,
  extensions,
  onChange,
}) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const { phase } = usePhaserGameContext()

  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    dispatchHighlightedLine(
      view,
      phase === "idle" ? null : (lineNo ?? null),
      phase === "crashed",
    )
  }, [lineNo, phase])

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center" spacing={1} p={1}>
        <Typography variant="h6">{language} Program</Typography>
        {editable && (
          <Tooltip
            title={
              `Use the ${language} editor below to design your program, then` +
              " click Play to try it out!"
            }
          >
            <InfoOutlineIcon fontSize="small" />
          </Tooltip>
        )}
      </Stack>
      <Divider />
      {ready ? (
        <CodeMirror
          ref={editorRef}
          value={value}
          editable={editable}
          extensions={[...extensions, highlightLine]}
          onChange={onChange}
          height="100%"
        />
      ) : (
        <Stack direction="row" spacing={1} p={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography variant="body2">Loading {language}...</Typography>
        </Stack>
      )}
    </Stack>
  )
}

export type ReadOnlyEditorProps = Pick<
  EditorProps,
  "value" | "lineNo" | "extensions" | "language"
>

const ReadOnlyEditor: FC<ReadOnlyEditorProps> = props => (
  <Editor {...props} editable={false} ready={true} />
)

export type WriteableEditorRef = {
  /** Resets the editor back to its starter code. */
  clear: () => void
  /** Replaces the editor's current code (e.g. with a level's solution). */
  load: (code: string) => void
  /** Interprets the editor's current code and returns a promise that
   * resolves to the interpreted commands, or `undefined` on failure.
   */
  interpret: () => Promise<GameCommand[] | undefined>
}

export type WriteableEditorProps = Pick<
  EditorProps,
  "lineNo" | "extensions" | "language" | "ready"
> & {
  ref: RefObject<WriteableEditorRef | null>
  starterCode: string
  interpret: (code: string) => Promise<GameCommand[] | undefined>
  /** Called whenever the code is edited, in addition to the generic game-
   * command reset below - for mode-specific state (e.g. line highlights)
   * that's similarly invalidated by the edit. */
  onEdit?: () => void
}

const WriteableEditor: FC<WriteableEditorProps> = ({
  ref,
  starterCode,
  interpret,
  onEdit,
  ...props
}) => {
  const { phase, setPhase } = usePhaserGameContext()
  const dispatch = useAppDispatch()
  const [code, setCode] = useState(starterCode)

  // Avoids a stale closure in the imperative `interpret` below.
  const codeRef = useRef(code)
  codeRef.current = code

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setCode(starterCode),
      load: (code: string) => setCode(code),
      interpret: () =>
        interpret(codeRef.current).then(commands => {
          if (commands === undefined) setPhase("crashed")
          else dispatch(setGameCommands(commands))
          return commands
        }),
    }),
    [starterCode, interpret, setPhase, dispatch],
  )

  // Any edit invalidates the last interpretation, same as a Blockly edit.
  const handleChange = (value: string) => {
    setCode(value)
    dispatch(setGameCommands([]))
    onEdit?.()
  }

  return (
    <Editor
      {...props}
      value={code}
      editable={phase === "idle" || phase === "finished" || phase === "crashed"}
      onChange={handleChange}
    />
  )
}

export type BaseEditorProps =
  | ({ mode: "read" } & ReadOnlyEditorProps)
  | ({ mode: "write" } & WriteableEditorProps)

const BaseEditor: FC<BaseEditorProps> = props =>
  props.mode === "write" ? (
    <WriteableEditor {...props} />
  ) : (
    <ReadOnlyEditor {...props} />
  )

export default BaseEditor
