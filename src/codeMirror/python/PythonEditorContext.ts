import { type RefObject, createContext } from "react"

import type { BaseEditorRef } from "../BaseEditor"
import type { VanMethod } from "../../app/van"

export type PythonEditorRef = BaseEditorRef

export type PythonEditorContextValue = {
  ref: RefObject<PythonEditorRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** Whether the editor is editable. If false, the editor is read-only. */
  editable: boolean
  /** The `my_van` commands relevant to this level, shown in the Commands
   * modal. Only set for "python" mode levels. */
  commands?: VanMethod[]
}

const PythonEditorContext = createContext<PythonEditorContextValue | null>(null)

export default PythonEditorContext
