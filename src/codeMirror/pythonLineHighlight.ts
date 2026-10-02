import { Decoration, type DecorationSet, EditorView } from "@codemirror/view"
import { StateEffect, StateField } from "@codemirror/state"

/** Set to a 1-indexed line number to highlight it, or `null` to clear. */
export const setHighlightedLine = StateEffect.define<number | null>()

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
export const highlightLineExtension = [
  highlightedLineField,
  highlightedLineTheme,
]

/** Highlight the given 1-indexed line (or clear it if `null`) and, if set,
 * scroll it into view. */
export function dispatchHighlightedLine(view: EditorView, line: number | null) {
  if (line == null) {
    view.dispatch({ effects: setHighlightedLine.of(null) })
    return
  }
  const pos = view.state.doc.line(Math.min(line, view.state.doc.lines)).from
  view.dispatch({
    effects: [setHighlightedLine.of(line), EditorView.scrollIntoView(pos)],
  })
}
