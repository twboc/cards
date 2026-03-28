import { Color } from "@shopify/react-native-skia";

export const HOLO_COLORS = [
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#4cd964",
  "#34aadc",
  "#5856d6",
  "#2e2d87",
] as Color[];

export const HOLO_CYBER_COLORS = [
  "#ff00ff",
  "#ff0080",
  "#ff3cff",
  "#7a00ff",
  "#2d00ff",
  "#008cff",
  "#00f0ff",
  "#00ff9c",
  "#aaff00",
] as Color[];
export const HOLO_FIRE_COLORS = [
  "#ff0020",
  "#ff1e00",
  "#ff4d00",
  "#ff7a00",
  "#ff9f00",
  "#ffc400",
  "#ffd900",
  "#fff066",
  "#d4ff00",
] as Color[];

export const HOLO_VAPORWAVE_COLORS = [
  "#ff71ce",
  "#ff00aa",
  "#b967ff",
  "#7b5cff",
  "#01cdfe",
  "#05ffa1",
  "#bfff00",
] as Color[];

export const HOLO_NEON_COLORS = [
  "#ff0040",
  "#ff00ff",
  "#9d00ff",
  "#5b00ff",
  "#003cff",
  "#00b7ff",
  "#00ffd0",
  "#39ff14",
  "#fff700",
] as Color[];

export const RADIATION_COLORS = [
  "#00aaff",
  "#00d4ff",
  "#00ffd0",
  "#00ff9a",
  "#00ff5e",
  "#39ff14",
  "#aaff00",
  "#fff700",
] as Color[];

export type HoloColorPalette = readonly Color[];

export const HOLO_COLOR_OPTIONS: readonly {
  label: string;
  value: HoloColorPalette;
}[] = [
  { label: "Classic", value: HOLO_COLORS },
  { label: "Cyber Neon", value: HOLO_CYBER_COLORS },
  { label: "Fire", value: HOLO_FIRE_COLORS },
  { label: "Vaporwave", value: HOLO_VAPORWAVE_COLORS },
  { label: "Hyper Neon", value: HOLO_NEON_COLORS },
  { label: "Radiation", value: RADIATION_COLORS },
];
