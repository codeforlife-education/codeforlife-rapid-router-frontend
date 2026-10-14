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

import { type GameCommand, setGameCommands } from "../../app/slices"
import { dispatchHighlightedLine, highlightLine } from "../extensions"
import { useAppDispatch, usePhaserGameContext } from "../../app/hooks"

type EditorProps = {
  value: string
  editable: boolean
  /** The source line (1-indexed) currently being animated, or `undefined` to
   * clear the highlight - resolved by the caller, which owns whatever
   * mapping of command index to line applies to its own mode. */
  lineNo?: number
  /** Highlights `lineNo` in red (e.g. to point at a runtime error) instead of
   * the default "currently animating" colour. */
  error?: boolean
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
  lineNo,
  error,
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
      error,
    )
  }, [lineNo, error, phase])

  return (
    <CodeMirror
      ref={editorRef}
      value={value}
      editable={editable}
      extensions={[...extensions, highlightLine]}
      onChange={onChange}
      height="100%"
    />
  )
}

type ReadOnlyEditorProps = Pick<
  EditorProps,
  "value" | "lineNo" | "error" | "extensions"
>

const ReadOnlyEditor: FC<ReadOnlyEditorProps> = props => (
  <Editor {...props} editable={false} />
)

export type WriteableEditorRef = {
  /** Resets the editor back to its starter code. */
  clear: () => void
  /** Interprets the editor's current code and returns a promise that
   * resolves to the interpreted commands, or `undefined` on failure.
   */
  interpret: () => Promise<GameCommand[] | undefined>
}

type WriteableEditorProps = Pick<
  EditorProps,
  "lineNo" | "error" | "extensions"
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
  const { phase } = usePhaserGameContext()
  const dispatch = useAppDispatch()
  const [code, setCode] = useState(starterCode)

  // Avoids a stale closure in the imperative `interpret` below.
  const codeRef = useRef(code)
  codeRef.current = code

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setCode(starterCode),
      interpret: () => interpret(codeRef.current),
    }),
    [starterCode, interpret],
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
