import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import {
  type FC,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import type { Extension } from "@codemirror/state"

import {
  dispatchHighlightedLine,
  highlightLineExtension,
} from "./lineHighlight"
import { useCurrentGameCommand, useGameInPlay } from "../app/hooks"

export type BaseEditorRef = {
  /** Resets the editor back to its starter code. */
  clear: () => void
  /** Runs the editor's current code - only called when the player presses Play. */
  run: () => void
}

export interface BaseEditorProps {
  ref: RefObject<BaseEditorRef | null>
  starterCode: string
  /** Language-specific CodeMirror extensions (e.g. `python()`). */
  extensions: Extension[]
  /** Called with the editor's current code when the player presses Play. */
  onRun: (code: string) => void
}

/**
 * A CodeMirror-backed code editor shared by every editable code-editing
 * mode - owns the code state, exposes an imperative `clear`/`run`, and
 * highlights whichever line produced the command currently being animated.
 */
const BaseEditor: FC<BaseEditorProps> = ({
  ref,
  starterCode,
  extensions,
  onRun,
}) => {
  const gameInPlay = useGameInPlay()
  const currentGameCommand = useCurrentGameCommand()
  const editorRef = useRef<ReactCodeMirrorRef>(null)
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

  // Highlight the line whose command is currently being animated, and
  // scroll it into view for long scripts.
  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    dispatchHighlightedLine(view, currentGameCommand?.lineNo ?? null)
  }, [currentGameCommand])

  return (
    <CodeMirror
      ref={editorRef}
      value={code}
      editable={!gameInPlay}
      extensions={[...extensions, highlightLineExtension]}
      onChange={setCode}
      height="100%"
    />
  )
}

export default BaseEditor
