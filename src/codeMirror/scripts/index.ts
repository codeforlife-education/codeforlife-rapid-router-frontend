import type { Level } from "../../api/level"

export async function loadScript(editor: "python", levelId: Level["id"]) {
  const fileExtension = {
    python: "py",
  }[editor]

  return (
    (await import(
      /* @vite-ignore */
      `./${editor}/level${levelId}.${fileExtension}?raw`
    )) as { default: string }
  ).default
}
