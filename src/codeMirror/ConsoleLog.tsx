import { Alert, Divider, Stack, Tooltip, Typography } from "@mui/material"
import { type FC } from "react"
import { InfoOutline as InfoOutlineIcon } from "@mui/icons-material"

import { useConsoleLogContext } from "../app/hooks"

export interface ConsoleLogProps {}

const ConsoleLog: FC<ConsoleLogProps> = () => {
  const { logs = [] } = useConsoleLogContext() ?? {}

  return (
    <Stack direction="column" height="100%">
      <Stack direction="row" alignItems="center" spacing={1} p={1}>
        <Typography variant="h6">Console Log</Typography>
        <Tooltip title="Any system messages will appear here. Be on the lookout for errors!">
          <InfoOutlineIcon fontSize="small" />
        </Tooltip>
      </Stack>
      <Divider />
      <Stack direction="column" overflow="auto" p={1}>
        {logs.map((log, index) => (
          <Alert
            key={`console-log-${index}`}
            severity={log.severity}
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {log.message}
          </Alert>
        ))}
      </Stack>
    </Stack>
  )
}

export default ConsoleLog
