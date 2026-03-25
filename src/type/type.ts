import { DerivedValue } from "react-native-reanimated";

export type Point = {
  x: number;
  y: number;
};

export type GradientPoints = {
  start: Point;
  end: Point;
};

export type GradientPointsValue = DerivedValue<GradientPoints>;
