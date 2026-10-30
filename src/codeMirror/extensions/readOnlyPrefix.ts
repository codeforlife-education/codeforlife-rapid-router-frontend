import { Decoration, type DecorationSet, EditorView } from "@codemirror/view"
import {
  EditorState,
  type Extension,
  StateField,
  type Text,
} from "@codemirror/state"
import { ExternalChange } from "@uiw/react-codemirror"

const readOnlyPrefixTheme = EditorView.baseTheme({
  ".cm-readonly-prefix-line": { opacity: 0.6 },
})

/** How many characters of `doc`'s start match the known prefix content, or
 * `undefined` if `doc` doesn't actually start with it (e.g. a loaded
 * solution that doesn't share the starter code's boilerplate), so callers
 * can gracefully skip protecting/styling anything in that case. */
function getMatchedPrefixLength(doc: Text, prefixContent: string) {
  if (doc.length < prefixContent.length) return undefined
  return doc.sliceString(0, prefixContent.length) === prefixContent
    ? prefixContent.length
    : undefined
}

/** Dims every line within the document's read-only prefix (see
 * `readOnlyPrefix`), recomputed from the live document on every change
 * rather than remapped through it - a wholesale document replacement (e.g.
 * loading a level's solution) can't otherwise be tracked reliably, since
 * every one of the prefix's line positions falls inside the replaced range. */
function readOnlyPrefixField(prefixContent: string) {
  function buildDecorations(doc: Text) {
    const contentLength = getMatchedPrefixLength(doc, prefixContent)
    if (contentLength === undefined) return Decoration.none

    const lastLine = doc.lineAt(contentLength).number
    const lines = []
    for (let i = 1; i <= lastLine; i++) {
      lines.push(
        Decoration.line({ class: "cm-readonly-prefix-line" }).range(
          doc.line(i).from,
        ),
      )
    }
    return Decoration.set(lines)
  }

  return StateField.define<DecorationSet>({
    create: state => buildDecorations(state.doc),
    update: (decorations, tr) =>
      tr.docChanged ? buildDecorations(tr.state.doc) : decorations,
    provide: field => EditorView.decorations.from(field),
  })
}

/** Rejects any transaction that would change a character before the
 * document's current read-only prefix (see `getMatchedPrefixLength`) - the
 * whole line (including appending to its end) stays protected; only the
 * following line onward can be edited. Programmatic resets of the
 * controlled `value` prop (e.g. the "Clear"/"Solve" buttons) are exempt,
 * since those replace the whole document rather than making a targeted
 * edit. */
function readOnlyPrefixFilter(prefixContent: string) {
  return EditorState.changeFilter.of(tr => {
    if (tr.annotation(ExternalChange)) return true
    const contentLength = getMatchedPrefixLength(
      tr.startState.doc,
      prefixContent,
    )
    if (contentLength === undefined) return true
    // +1 includes the content's own trailing newline, so edits can only ever
    // land on a genuinely new line - not appended to the last protected
    // line's end (which would otherwise render greyed-out but stay editable).
    const protectedLength = contentLength + 1
    let ok = true
    tr.changes.iterChangedRanges(fromA => {
      if (fromA < protectedLength) ok = false
    })
    return ok
  })
}

/** Makes `prefix`'s content immutable and visually dimmed - e.g. to keep a
 * starter-code preamble permanent - while leaving any trailing blank lines
 * (and everything after them) fully editable and undecorated. Re-evaluated
 * against the live document on every change, including a wholesale
 * replacement (e.g. loading a level's solution), so it only protects/styles
 * the prefix while the document still actually starts with it. */
export default function readOnlyPrefix(prefix: string): Extension {
  const prefixContent = prefix.replace(/\n+$/, "")
  return [
    readOnlyPrefixFilter(prefixContent),
    readOnlyPrefixField(prefixContent),
    readOnlyPrefixTheme,
  ]
}
