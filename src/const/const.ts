import { SharedValue } from "react-native-reanimated";
import { GradientPoints } from "../type/type";

export const MODAL_HEIGHT = "50%";
export const MODAL_BOTTOM_PADDING = 60;

export const zeroShared = {
  value: 0,
} as SharedValue<number>;

export const ZERO_GRADIENT_POINTS: GradientPoints = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
};

export const GRADIENT_TRANSLATE_FACTOR = 0.35;
export const MASK_TRANSLATE_FACTOR = 0.2;
export const DEFAULT_BORDER_RADIUS = 12;
export const MILLISECONDS_TO_SECONDS = 0.001;

// sensor
export const DEFAULT_MAX_ANGLE = 15;
export const DEFAULT_SENSOR_ENABLED = true;
export const DEFAULT_SENSOR_ROTATION_FACTOR = 12;
export const DEFAULT_SENSOR_TRANSLATION_FACTOR = 28;
export const DEFAULT_IS_ACTIVE = true;
export const SENSOR_INTERVAL_MS = 40;
export const RESET_TIMING_CONFIG = { duration: 100 };
export const PERSPECTIVE = 700;
export const ZERO = 0;
export const ROTATION_EPSILON = 0.01;
export const TIMING_CONFIG = { duration: 100 };
