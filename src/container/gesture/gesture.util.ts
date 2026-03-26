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
