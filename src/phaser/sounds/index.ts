/** The URL of each sound effect, keyed by the sound's Phaser audio key. */
export const URLs = {
  starting: new URL("./starting.mp3", import.meta.url).href,
  electric_van_starting: new URL("./electric_van_starting.mp3", import.meta.url)
    .href,
  moving: new URL("./moving.mp3", import.meta.url).href,
  crash: new URL("./crash.mp3", import.meta.url).href,
  failure: new URL("./failure.mp3", import.meta.url).href,
  win: new URL("./win.mp3", import.meta.url).href,
  delivery: new URL("./delivery.mp3", import.meta.url).href,
  horn: new URL("./horn.mp3", import.meta.url).href,
  cow: new URL("./cow.mp3", import.meta.url).href,
  pigeon: new URL("./pigeon.mp3", import.meta.url).href,
  tension: new URL("./tension.mp3", import.meta.url).href,
} as const
export type Key = keyof typeof URLs
