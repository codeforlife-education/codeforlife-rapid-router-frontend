import {
  type ThemeOptions,
  createTheme,
  responsiveFontSizes,
} from "@mui/material"
import { themeOptions as cflThemeOptions } from "codeforlife/theme"

// Unpack the base options to extend the theme
export const themeOptions: ThemeOptions = {
  ...cflThemeOptions,
  components: {
    ...cflThemeOptions.components,
    MuiCssBaseline: {
      ...cflThemeOptions.components?.MuiCssBaseline,
      styleOverrides: {
        ...(cflThemeOptions.components?.MuiCssBaseline
          ?.styleOverrides as object),
        "@keyframes fabPulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 1)" },
          "70%": { boxShadow: "0 0 0 14px rgba(255, 235, 59, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(255, 235, 59, 0)" },
        },
      },
    },
  },
}

const theme = responsiveFontSizes(createTheme(themeOptions))

export default theme
