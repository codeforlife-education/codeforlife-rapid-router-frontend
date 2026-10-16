import {
  type ConfigEnv as ViteConfigEnv,
  defineConfig as defineViteConfig,
  mergeConfig as mergeViteConfig,
} from "vite"
import {
  viteConfig as workspaceViteConfig,
  vitestConfig as workspaceVitestConfig,
} from "@codeforlife/workspace/vite.config.ts"
import { mergeConfig as mergeVitestConfig } from "vitest/config"
import { viteStaticCopy } from "vite-plugin-static-copy"

export default ({ isSsrBuild }: ViteConfigEnv) => {
  let viteConfig = defineViteConfig({
    ssr: {
      // Phaser is a browser-only game engine that relies on Web APIs like
      // Canvas and WebGL, which don't exist in a Node environment. By marking
      // Phaser as external, we prevent Vite from trying to bundle it for SSR,
      // which would lead to errors about missing modules or APIs. Instead,
      // Phaser will be treated as an external dependency that is only loaded
      // in the browser, allowing the SSR build to succeed without issues.
      // Pyodide (a Python-in-WASM runtime) is excluded for the same reason.
      external: ["phaser", "pyodide"],
    },
    // The Pyodide worker dynamically imports level tilemap data (code
    // splitting), which Rollup can't emit as the default IIFE worker format.
    worker: { format: "es" },
    plugins: [
      viteStaticCopy({
        // Self-host Pyodide's runtime (wasm/stdlib, several MB) so it's
        // served from our own origin instead of fetching it from a CDN at
        // runtime, so `loadPyodide({ indexURL: "/pyodide/" })` resolves
        // same-origin in both dev and production builds.
        targets: [
          "pyodide.asm.mjs",
          "pyodide.asm.wasm",
          "pyodide.mjs",
          "pyodide-lock.json",
          "python_stdlib.zip",
        ].map(fileName => ({
          src: `node_modules/pyodide/${fileName}`,
          dest: "pyodide",
          rename: { stripBase: true },
        })),
      }),
    ],
    build: {
      // Phaser is a massive game engine. Even when heavily minified, the core
      // engine often hovers around or above 500 KB (default) so setting to 1000
      // tells Vite, "I know this file is huge, don't warn me about it."
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Tells the bundler to isolate the entire Phaser engine into its own
          // dedicated file (e.g., phaser-[hash].js) rather than mixing it
          // together with the React UI code. This is necessary because:
          // 1. Browser caching: Phaser is a heavy dependency, but its code
          //  rarely changes (unless the version is upgraded). If Phaser is
          //  grouped into its own file, the user's browser will download it
          //  once and cache it permanently.
          // 2. Parallel Downloading: By isolating Phaser, the browser can
          //  download it in parallel with the app code, improving load times.
          // 3. Faster UI Render: Because the React code is separated from
          //  the massive engine block, the browser can parse and render the UI
          //  almost instantly, before it has even finished evaluating the heavy
          //  game engine logic.
          manualChunks: isSsrBuild
            ? undefined
            : { phaser: ["phaser"], pyodide: ["pyodide"] },
        },
      },
    },
  })

  viteConfig = mergeViteConfig(workspaceViteConfig, viteConfig)

  return mergeVitestConfig(viteConfig, workspaceVitestConfig)
}
