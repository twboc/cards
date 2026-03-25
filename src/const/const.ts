import { SharedValue } from "react-native-reanimated";
import { GradientPoints } from "../type/type";

export const zeroShared = {
  value: 0,
} as SharedValue<number>;

export const ZERO_GRADIENT_POINTS: GradientPoints = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
};

export const GRADIENT_TRANSLATE_FACTOR = 0.35;
export const MASK_TRANSLATE_FACTOR = 0.2;
export const MILLISECONDS_TO_SECONDS = 0.001;
export const DEFAULT_MAX_ANGLE = 15;
export const DEFAULT_BORDER_RADIUS = 12;
