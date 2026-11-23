import { type FC, useEffect } from "react"
import { type EntryAppProps } from "codeforlife/server/entry"
import _App from "codeforlife/server/App"

import { getSavedSettings, loadSavedSettings } from "./app/slices/settings"
import store from "./app/store"
import theme from "./app/theme"

export interface AppProps extends EntryAppProps {}

const App: FC<AppProps> = props => {
  // Load the settings saved in the cookie once hydrated - they can't be read
  // on the server, so loading them any earlier would make the client's first
  // render differ from the server-rendered HTML.
  useEffect(() => {
    store.dispatch(loadSavedSettings(getSavedSettings()))
  }, [])

  return <_App store={store} theme={theme} {...props} />
}

export default App
