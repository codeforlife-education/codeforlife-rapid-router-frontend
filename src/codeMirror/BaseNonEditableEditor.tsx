import { type FC } from "react"

import BaseEditor, { type BaseEditorProps } from "./BaseEditor"

export interface BaseNonEditableEditorProps
  extends Pick<BaseEditorProps, "value" | "lineNo" | "extensions"> {}

/** A read-only code display shared by every non-editable code-viewing mode. */
const BaseNonEditableEditor: FC<BaseNonEditableEditorProps> = ({
  value,
  lineNo,
  extensions,
}) => (
  <BaseEditor
    value={value}
    editable={false}
    lineNo={lineNo}
    extensions={extensions}
  />
)

export default BaseNonEditableEditor
