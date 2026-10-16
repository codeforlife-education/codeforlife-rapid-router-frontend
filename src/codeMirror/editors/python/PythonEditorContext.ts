import { createContext } from "react"

import type {
  ReadOnlyPythonEditorProps,
  WriteablePythonEditorProps,
} from "./PythonEditor"

export type PythonEditorContextValue =
  | ({ mode: "read" } & ReadOnlyPythonEditorProps)
  | ({ mode: "write" } & WriteablePythonEditorProps)

const PythonEditorContext = createContext<PythonEditorContextValue | null>(null)

export default PythonEditorContext
