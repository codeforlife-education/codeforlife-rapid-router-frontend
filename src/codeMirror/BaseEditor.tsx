import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view"
import { type Extension, StateEffect, StateField } from "@codemirror/state"
import { type FC, useEffect, useRef } from "react"

import { useCurrentGameCommand } from "../app/hooks"

/** Set to a 1-indexed line number to highlight it, or `null` to clear. */
const setHighlightedLine = StateEffect.define<number | null>()

const highlightedLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, transaction) {
    for (const effect of transaction.effects) {
      if (!effect.is(setHighlightedLine)) continue
      if (effect.value == null) return Decoration.none
      // Lines can shift/disappear on read-only content changes; clamp to
      // the document's current line count to avoid an out-of-range access.
      const lineNumber = Math.min(effect.value, transaction.state.doc.lines)
      const line = transaction.state.doc.line(lineNumber)
      return Decoration.set([
        Decoration.line({ class: "cm-highlighted-line" }).range(line.from),
      ])
    }
    return decorations.map(transaction.changes)
  },
  provide: field => EditorView.decorations.from(field),
})

const highlightedLineTheme = EditorView.baseTheme({
  ".cm-highlighted-line": { backgroundColor: "rgba(46, 204, 64, 0.35)" },
})

/** Highlights a single line, updated via `setHighlightedLine` effects. */
const highlightLineExtension = [highlightedLineField, highlightedLineTheme]

/** Highlight the given 1-indexed line (or clear it if `null`) and, if set,
 * scroll it into view. */
function dispatchHighlightedLine(view: EditorView, line: number | null) {
  if (line == null) {
    view.dispatch({ effects: setHighlightedLine.of(null) })
    return
  }
  const pos = view.state.doc.line(Math.min(line, view.state.doc.lines)).from
  view.dispatch({
    effects: [setHighlightedLine.of(line), EditorView.scrollIntoView(pos)],
  })
}

export interface BaseEditorProps {
  value: string
  editable: boolean
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
  extensions,
  onChange,
}) => {
  const currentGameCommand = useCurrentGameCommand()
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    dispatchHighlightedLine(view, currentGameCommand?.lineNo ?? null)
  }, [currentGameCommand])

  return (
    <CodeMirror
      ref={editorRef}
      value={value}
      editable={editable}
      extensions={[...extensions, highlightLineExtension]}
      onChange={onChange}
      height="100%"
    />
  )
}

export default BaseEditor
