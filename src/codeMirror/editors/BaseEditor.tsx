import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { type FC, useEffect, useRef } from "react"
import type { Extension } from "@codemirror/state"

import { dispatchHighlightedLine, highlightLine } from "../extensions"

export interface BaseEditorProps {
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
const BaseEditor: FC<BaseEditorProps> = ({
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

export default BaseEditor
