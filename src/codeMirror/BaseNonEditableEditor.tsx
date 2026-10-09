import type { Extension } from "@codemirror/state"
import { type FC } from "react"

import BaseEditor from "./BaseEditor"

export interface BaseNonEditableEditorProps {
  /** The code to display - owned by the caller, not this component. */
  value: string
  /** Language-specific CodeMirror extensions (e.g. `python()`). */
  extensions: Extension[]
}

/** A read-only code display shared by every non-editable code-viewing mode. */
const BaseNonEditableEditor: FC<BaseNonEditableEditorProps> = ({
  value,
  extensions,
}) => <BaseEditor value={value} editable={false} extensions={extensions} />

export default BaseNonEditableEditor
