import { type RefObject, createContext } from "react"

import type { VanMethod } from "../../app/van"

export type PythonEditorRef = {
  clear: () => void
  /** Runs the current code, streaming fresh commands - only called when
   * the player presses Play/Run Program. */
  run: () => void
}

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
