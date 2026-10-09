import { type RefObject, createContext } from "react"

import type { BaseEditableEditorRef } from "../BaseEditableEditor"
import type { CharacterCommand } from "../../app/character"

export type PythonEditorRef = BaseEditableEditorRef

export type PythonEditorContextValue = {
  ref: RefObject<PythonEditorRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** Whether the editor is editable. If false, the editor is read-only. */
  editable: boolean
  /** The `my_van` commands relevant to this level, shown in the Commands
   * modal. Only set for "python" mode levels. */
  commands?: CharacterCommand[]
}

const PythonEditorContext = createContext<PythonEditorContextValue | null>(null)

export default PythonEditorContext
