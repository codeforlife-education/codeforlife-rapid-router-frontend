import {
  type FC,
  type RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import BaseEditor, { type BaseEditorProps } from "./BaseEditor"
import { usePhaserGameContext } from "../../app/hooks"

export type BaseEditableEditorRef = {
  /** Resets the editor back to its starter code. */
  clear: () => void
  /** Interprets the editor's current code and returns a promise that resolves
   * to a boolean indicating success.
   */
  interpret: () => Promise<boolean>
}

export interface BaseEditableEditorProps
  extends Pick<BaseEditorProps, "lineNo" | "extensions"> {
  ref: RefObject<BaseEditableEditorRef | null>
  starterCode: string
  interpret: (code: string) => Promise<boolean>
}

/**
 * A code editor shared by every editable code-editing mode - owns the code
 * state and exposes an imperative `clear`/`run`.
 */
const BaseEditableEditor: FC<BaseEditableEditorProps> = ({
  ref,
  starterCode,
  lineNo,
  extensions,
  interpret,
}) => {
  const { phase } = usePhaserGameContext()
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
      editable={phase === "idle" || phase === "finished" || phase === "crashed"}
      lineNo={lineNo}
      extensions={extensions}
      onChange={setCode}
    />
  )
}

export default BaseEditableEditor
