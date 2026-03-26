import { ZERO } from "../../const/const";
export const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

export const mapToAngle = (
  value: number,
  size: number,
  maxAngle: number,
  isReverse = false,
) => {
  "worklet";

  if (size <= ZERO) {
    return ZERO;
  }

  const progress = clamp(value / size, ZERO, 1);
  const angle = progress * (maxAngle * 2) - maxAngle;

  return isReverse ? -angle : angle;
};

export const applyDeadZone = (value: number, deadZone: number) => {
  "worklet";
  return Math.abs(value) < deadZone ? ZERO : value;
};

export const smoothValue = (current: number, target: number, alpha: number) => {
  "worklet";
  return current + (target - current) * alpha;
};

export const shouldUpdateValue = (
  current: number,
  next: number,
  epsilon: number,
) => {
  "worklet";
  return Math.abs(current - next) > epsilon;
};
