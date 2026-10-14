import { Decoration, type DecorationSet, EditorView } from "@codemirror/view"
import { StateEffect, StateField } from "@codemirror/state"

/** Set to highlight a 1-indexed line, optionally as an error, or `null` to clear. */
const setHighlightedLine = StateEffect.define<{
  line: number
  error: boolean
} | null>()

const highlightedLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, transaction) {
    for (const effect of transaction.effects) {
      if (!effect.is(setHighlightedLine)) continue
      if (effect.value == null) return Decoration.none
      // Lines can shift/disappear on read-only content changes; clamp to
      // the document's current line count to avoid an out-of-range access.
      const lineNumber = Math.min(
        effect.value.line,
        transaction.state.doc.lines,
      )
      const line = transaction.state.doc.line(lineNumber)
      const className = effect.value.error
        ? "cm-highlighted-line-error"
        : "cm-highlighted-line"
      return Decoration.set([
        Decoration.line({ class: className }).range(line.from),
      ])
    }
    return decorations.map(transaction.changes)
  },
  provide: field => EditorView.decorations.from(field),
})

const highlightedLineTheme = EditorView.baseTheme({
  ".cm-highlighted-line": { backgroundColor: "rgba(46, 204, 64, 0.35)" },
  ".cm-highlighted-line-error": { backgroundColor: "rgba(255, 0, 0, 0.35)" },
})

/** Highlight the given 1-indexed line (or clear it if `null`), optionally as
 * an error, and, if set, scroll it into view. */
export function dispatchHighlightedLine(
  view: EditorView,
  line: number | null,
  error = false,
) {
  if (line == null) {
    view.dispatch({ effects: setHighlightedLine.of(null) })
    return
  }
  const pos = view.state.doc.line(Math.min(line, view.state.doc.lines)).from
  view.dispatch({
    effects: [
      setHighlightedLine.of({ line, error }),
      EditorView.scrollIntoView(pos),
    ],
  })
}

/** Highlights a single line, updated via `setHighlightedLine` effects. */
const highlightLine = [highlightedLineField, highlightedLineTheme]
export default highlightLine
