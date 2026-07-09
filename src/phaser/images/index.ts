import { type DeepStringsOf, createIdRegistry } from "codeforlife/utils/object"

const path = <const K extends string, const V>(k: K, v: V) =>
  ({ [k]: v }) as Record<K, V>

// Create top-level object factories for constructing image paths.
const background = <const K extends string, const V>(k: K, v: V) =>
  path(`background/${k}`, { Background: v })
const hud = <const K extends string, const V>(k: K, v: V) =>
  path(`hud/${k}`, { HUD: v })
const particle = <const K extends string, const V>(k: K, v: V) =>
  path(`particle/${k}`, { Particles: v })

export const Paths = createIdRegistry({
  ...background("grass.svg", "GRASS"),
  ...background("snow.svg", "SNOW"),
  ...background("pavement.svg", "PAVEMENT"),
  ...hud("fuelGauge/fuel_gauge.svg", { FuelGauge: "FUEL_GAUGE" }),
  ...hud("fuelGauge/pointer.svg", { FuelGauge: "POINTER" }),
  ...hud("trashcan/lid/closed.svg", { Trashcan: { Lid: "CLOSED" } }),
  ...hud("trashcan/lid/open.svg", { Trashcan: { Lid: "OPEN" } }),
  ...hud("trashcan/trashcan.svg", { Trashcan: "TRASHCAN" }),
  ...hud("zoom/in.svg", { Zoom: "IN" }),
  ...hud("zoom/out.svg", { Zoom: "OUT" }),
  ...particle("fire.svg", "FIRE"),
  ...particle("smoke.svg", "SMOKE"),
} as const)
export type Path = DeepStringsOf<typeof Paths>

export function getUrl(path: Path) {
  return new URL(`./${path}`, import.meta.url).href
}
