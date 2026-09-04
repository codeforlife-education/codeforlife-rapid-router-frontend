import { type DeepStringsOf, createIdRegistry } from "codeforlife/utils/object"

const url = <const K extends string, const V>(k: K, v: V) =>
  ({ [import.meta.resolve(`./${k}`)]: v }) as Record<K, V>

// Create top-level object factories for constructing image paths.
const background = <const K extends string, const V>(k: K, v: V) =>
  url(`background/${k}`, { Background: v })
const character = <const K extends string, const V>(k: K, v: V) =>
  url(`characters/${k}`, { Character: v })
const hud = <const K extends string, const V>(k: K, v: V) =>
  url(`hud/${k}`, { HUD: v })
const particle = <const K extends string, const V>(k: K, v: V) =>
  url(`particle/${k}`, { Particles: v })

export const URLs = createIdRegistry({
  ...background("grass.svg", "GRASS"),
  ...background("snow.svg", "SNOW"),
  ...background("pavement.svg", "PAVEMENT"),
  ...character("normal/dee.svg", { Normal: "DEE" }),
  ...character("normal/electric_van.svg", { Normal: "ELECTRIC_VAN" }),
  ...character("normal/kirsty.svg", { Normal: "KIRSTY" }),
  ...character("normal/nigel.svg", { Normal: "NIGEL" }),
  ...character("normal/phil.svg", { Normal: "PHIL" }),
  ...character("normal/sleigh.svg", { Normal: "SLEIGH" }),
  ...character("normal/van.svg", { Normal: "VAN" }),
  ...character("normal/wes.svg", { Normal: "WES" }),
  ...character("wreckage/sleigh.svg", { Wreckage: "SLEIGH" }),
  ...character("wreckage/van.svg", { Wreckage: "VAN" }),
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
export type URL = DeepStringsOf<typeof URLs>
