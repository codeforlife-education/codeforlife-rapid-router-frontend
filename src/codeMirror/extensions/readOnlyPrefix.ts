import { Decoration, type DecorationSet, EditorView } from "@codemirror/view"
import { EditorState, type Extension, StateField } from "@codemirror/state"
import { ExternalChange } from "@uiw/react-codemirror"

const readOnlyPrefixTheme = EditorView.baseTheme({
  ".cm-readonly-prefix-line": { opacity: 0.6 },
})

/** Dims every line within the document's read-only prefix (see
 * `readOnlyPrefix`) - the covered positions never shift once created, since
 * the change filter below guarantees that range never changes, so `update`
 * only needs to remap through later, unrelated edits. */
function readOnlyPrefixField(contentLength: number) {
  return StateField.define<DecorationSet>({
    create(state) {
      const lastLine = state.doc.lineAt(contentLength).number
      const lines = []
      for (let i = 1; i <= lastLine; i++) {
        lines.push(
          Decoration.line({ class: "cm-readonly-prefix-line" }).range(
            state.doc.line(i).from,
          ),
        )
      }
      return Decoration.set(lines)
    },
    update: (decorations, tr) => decorations.map(tr.changes),
    provide: field => EditorView.decorations.from(field),
  })
}

/** Rejects any transaction that would change a character before
 * `protectedLength` - this is one past the read-only content's last line, so
 * the whole line (including appending to its end) stays protected; only the
 * following line onward can be edited. Programmatic resets of the
 * controlled `value` prop (e.g. the "Clear" button) are exempt, since those
 * replace the whole document rather than making a targeted edit. */
function readOnlyPrefixFilter(protectedLength: number) {
  return EditorState.changeFilter.of(tr => {
    if (tr.annotation(ExternalChange)) return true
    let ok = true
    tr.changes.iterChangedRanges(fromA => {
      if (fromA < protectedLength) ok = false
    })
    return ok
  })
}

/** Makes `prefix`'s content immutable and visually dimmed - e.g. to keep a
 * starter-code preamble permanent - while leaving any trailing blank lines
 * (and everything after them) fully editable and undecorated. */
export default function readOnlyPrefix(prefix: string): Extension {
  const contentLength = prefix.replace(/\n+$/, "").length
  // +1 includes the content's own trailing newline, so edits can only ever
  // land on a genuinely new line - not appended to the last protected
  // line's end (which would otherwise render greyed-out but stay editable).
  const protectedLength = contentLength + 1
  return [
    readOnlyPrefixFilter(protectedLength),
    readOnlyPrefixField(contentLength),
    readOnlyPrefixTheme,
  ]
}
