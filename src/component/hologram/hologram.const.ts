import { Color } from "@shopify/react-native-skia";

export const HOLO_MASK_COLORS = [
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.8)",
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.7)",
  "rgba(0, 0, 0, 0)",
] as Color[];

export const HOLO_MASK_POSITIONS = [0, 0.35, 0.5, 0.65, 1] as number[];

export const HOLO_IMAGE_FIT = "cover" as const;
export const HOLO_BLEND_MODE = "overlay" as const;
export const HOLO_MASK_MODE = "luminance" as const;
