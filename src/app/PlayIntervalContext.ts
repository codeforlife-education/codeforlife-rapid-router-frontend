import { createContext } from "react"

import type { usePlayInterval } from "./hooks"

export type PlayIntervalContextValue = ReturnType<typeof usePlayInterval>

const PlayIntervalContext = createContext<PlayIntervalContextValue | null>(null)

export default PlayIntervalContext
