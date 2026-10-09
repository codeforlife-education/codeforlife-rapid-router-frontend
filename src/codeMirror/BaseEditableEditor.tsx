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
  /** Interprets the editor's current code and returns a promise that resolves
   * to a boolean indicating success.
   */
  interpret: () => Promise<boolean>
}

export interface BaseEditableEditorProps {
  ref: RefObject<BaseEditableEditorRef | null>
  starterCode: string
  /** Language-specific CodeMirror extensions (e.g. `python()`). */
  extensions: Extension[]
  interpret: (code: string) => Promise<boolean>
}

/**
 * A code editor shared by every editable code-editing mode - owns the code
 * state and exposes an imperative `clear`/`run`.
 */
const BaseEditableEditor: FC<BaseEditableEditorProps> = ({
  ref,
  starterCode,
  extensions,
  interpret,
}) => {
  const gameInPlay = useGameInPlay()
  const [code, setCode] = useState(starterCode)

  // Avoids a stale closure in the imperative `interpret` below.
  const codeRef = useRef(code)
  codeRef.current = code

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setCode(starterCode),
      interpret: () => interpret(codeRef.current),
    }),
    [starterCode, interpret],
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
