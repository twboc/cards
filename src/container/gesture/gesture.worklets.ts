import { Extrapolation, interpolate } from "react-native-reanimated";

const ZERO = 0;

export const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

export const mapToAngle = (
  value: number,
  size: number,
  maxAngle: number,
  reverse: boolean,
) => {
  "worklet";

  if (size <= ZERO) {
    return ZERO;
  }

  const progress = clamp(value / size, ZERO, 1);
  const angle = progress * (maxAngle * 2) - maxAngle;

  return reverse ? -angle : angle;
};

export const mapToAngleWithInterpolate = (
  value: number,
  size: number,
  maxAngle: number,
  reverse: boolean,
) => {
  "worklet";

  return interpolate(
    value,
    [ZERO, size],
    reverse ? [maxAngle, -maxAngle] : [-maxAngle, maxAngle],
    Extrapolation.CLAMP,
  );
};

export const mapSensorRotation = (
  value: number,
  factor: number,
  maxAngle: number,
  invert = false,
) => {
  "worklet";
  return clamp((invert ? -value : value) * factor, -maxAngle, maxAngle);
};

export const mapSensorTranslation = (value: number, factor: number) => {
  "worklet";
  return clamp(value * factor, -factor, factor);
};
