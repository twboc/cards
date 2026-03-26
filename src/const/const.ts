import { SharedValue } from "react-native-reanimated";
import { GradientPoints } from "../type/type";

export const MODAL_HEIGHT = "50%";
export const MODAL_BOTTOM_PADDING = 60;
export const FILL_COLOR = "#FFF";

export const MASK_MODE_OVERRIDE = "luminance" as const;

// image
export const IMAGE_FIT = "cover" as const;

// mask
export const MASK_MODE = "alpha" as const;
export const MASK_COLOR = "#FFF";
export const DEFAULT_MODE = "alpha" as const;
export const MASK_FIT = "contain" as const;
export const MASK_IMAGE_FIT = "fill" as const;
export const DST_OUT_BLEND = "dstOut" as const;
export const CLIP = false;

// outline
export const DEFAULT_OUTLINE_SIZE = 4;
export const DEFAULT_OUTLINE_COLOR = "#ffffff";
export const DEFAULT_FIT = "contain" as const;

export const ZERO_SHARED = {
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
export const SENSOR_UPDATE_EPSILON = 0.02;
export const SENSOR_DEAD_ZONE = 0.015;
export const SENSOR_SMOOTHING = 0.18;
export const TIMING_CONFIG = { duration: 100 };
