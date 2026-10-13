import { Alert, Box, Typography } from "@mui/material"
import { type FC } from "react"

import { useConsoleLogContext } from "../app/hooks"

export interface ConsoleLogProps {}

const ConsoleLog: FC<ConsoleLogProps> = () => {
  const { logs = [] } = useConsoleLogContext() ?? {}

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" sx={{ px: 1, pt: 1 }}>
        Console Log
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 1 }}>
        {logs.map((log, index) => (
          <Alert
            key={`console-log-${index}`}
            severity={log.severity}
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {log.message}
          </Alert>
        ))}
      </Box>
    </Box>
  )
}

export default ConsoleLog
