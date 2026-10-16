import { type Dispatch, type SetStateAction, createContext } from "react"

export type Log = { message: string; severity: "error" | "warning" | "info" }

export type ConsoleLogContextValue = {
  logs: Log[]
  setLogs: Dispatch<SetStateAction<Log[]>>
}

const ConsoleLogContext = createContext<ConsoleLogContextValue | null>(null)

export default ConsoleLogContext
