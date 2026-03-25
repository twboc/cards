export const DEFAULT_GLITCH_X = 6;
export const DEFAULT_GLITCH_Y = 2;
export const DEFAULT_INTENSITY = 1;
export const SMEAR_BLUR = 1.2;
export const SCREEN_BLEND = "screen" as const;
export const CLAMP_MODE = "clamp" as const;
export const SMEAR_X_FACTOR = 0.35;

export const RED_MATRIX: number[] = [
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.45, 0,
];

export const CYAN_MATRIX: number[] = [
  0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.35, 0,
];

export const SMEAR_MATRIX: number[] = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0.16, 0,
];
