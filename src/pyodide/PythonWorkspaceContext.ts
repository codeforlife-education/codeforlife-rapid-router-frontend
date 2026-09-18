import { type RefObject, createContext } from "react"

export type PythonWorkspaceRef = {
  clear: () => void
  /** Runs the current code, streaming fresh commands - only called when
   * the player presses Play/Run Program. */
  run: () => void
}

export type PythonWorkspaceContextValue = {
  ref: RefObject<PythonWorkspaceRef | null>
  /** Needed to load the right level's tile data into the Pyodide worker. */
  levelId: number
  /** "python" is a real editor that runs via Pyodide; "blocklyAndPython" is
   * a read-only view of the equivalent code generated from the blocks. */
  mode: "python" | "blocklyAndPython"
}

const PythonWorkspaceContext =
  createContext<PythonWorkspaceContextValue | null>(null)

export default PythonWorkspaceContext
