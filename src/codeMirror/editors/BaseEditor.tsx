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

import { dispatchHighlightedLine, highlightLine } from "../extensions"
import type { GameCommand } from "../../app/slices"
import { usePhaserGameContext } from "../../app/hooks"

type EditorProps = {
  value: string
  editable: boolean
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
  lineNo,
  extensions,
  onChange,
}) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    dispatchHighlightedLine(view, lineNo ?? null)
  }, [lineNo])

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

type ReadOnlyEditorProps = Pick<EditorProps, "value" | "lineNo" | "extensions">

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

type WriteableEditorProps = Pick<EditorProps, "lineNo" | "extensions"> & {
  ref: RefObject<WriteableEditorRef | null>
  starterCode: string
  interpret: (code: string) => Promise<GameCommand[] | undefined>
}

const WriteableEditor: FC<WriteableEditorProps> = ({
  ref,
  starterCode,
  interpret,
  ...props
}) => {
  const { phase } = usePhaserGameContext()
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

  return (
    <Editor
      {...props}
      value={code}
      editable={phase === "idle" || phase === "finished" || phase === "crashed"}
      onChange={setCode}
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
