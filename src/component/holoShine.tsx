import { memo } from "react";
import { DerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";

type Point = {
  x: number;
  y: number;
};

export type HoloShineProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientStart: DerivedValue<Point>;
  gradientEnd: DerivedValue<Point>;
};

const HOLO_COLORS = [
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#4cd964",
  "#34aadc",
  "#5856d6",
  "#2e2d87",
] as Color[];

const DEFAULT_BORDER_RADIUS = 17;
const ZERO = 0;

function HoloShineComponent(props: HoloShineProps) {
  return (
    <RoundedRect
      x={ZERO}
      y={ZERO}
      r={props.borderRadius ?? DEFAULT_BORDER_RADIUS}
      width={props.width}
      height={props.height}
    >
      <LinearGradient
        start={props.gradientStart}
        end={props.gradientEnd}
        colors={HOLO_COLORS}
      />
    </RoundedRect>
  );
}

export const HoloShine = memo(
  HoloShineComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.gradientStart === next.gradientStart &&
    prev.gradientEnd === next.gradientEnd,
);

HoloShine.displayName = "HoloShine";

export default HoloShine;
