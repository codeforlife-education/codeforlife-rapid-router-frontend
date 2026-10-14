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
function readOnlyPrefixField(protectedLength: number) {
  return StateField.define<DecorationSet>({
    create(state) {
      const lastLine = state.doc.lineAt(protectedLength).number
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
 * `protectedLength` - insertions exactly at that boundary (continuing to
 * type after it) are still allowed. Programmatic resets of the controlled
 * `value` prop (e.g. the "Clear" button) are exempt, since those replace the
 * whole document rather than making a targeted edit. */
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
  const protectedLength = prefix.replace(/\n+$/, "").length
  return [
    readOnlyPrefixFilter(protectedLength),
    readOnlyPrefixField(protectedLength),
    readOnlyPrefixTheme,
  ]
}
