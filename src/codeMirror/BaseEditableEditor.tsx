import {
  type FC,
  type RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import type { Extension } from "@codemirror/state"

import BaseEditor from "./BaseEditor"
import { useGameInPlay } from "../app/hooks"

export type BaseEditableEditorRef = {
  /** Resets the editor back to its starter code. */
  clear: () => void
  /** Runs the editor's current code - only called when the player presses Play. */
  run: () => void
}

export interface BaseEditableEditorProps {
  ref: RefObject<BaseEditableEditorRef | null>
  starterCode: string
  /** Language-specific CodeMirror extensions (e.g. `python()`). */
  extensions: Extension[]
  /** Called with the editor's current code when the player presses Play. */
  onRun: (code: string) => void
}

/**
 * A code editor shared by every editable code-editing mode - owns the code
 * state and exposes an imperative `clear`/`run`.
 */
const BaseEditableEditor: FC<BaseEditableEditorProps> = ({
  ref,
  starterCode,
  extensions,
  onRun,
}) => {
  const gameInPlay = useGameInPlay()
  const [code, setCode] = useState(starterCode)

  // Avoids a stale closure in the imperative `run` below.
  const codeRef = useRef(code)
  codeRef.current = code

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setCode(starterCode),
      run: () => onRun(codeRef.current),
    }),
    [starterCode, onRun],
  )

  return (
    <BaseEditor
      value={code}
      editable={!gameInPlay}
      extensions={extensions}
      onChange={setCode}
    />
  )
}

export default BaseEditableEditor
