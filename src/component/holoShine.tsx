import { memo, RefObject } from "react";
import { DerivedValue, useDerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { Point } from "../type/type";
import { HoloColorPalette } from "../data/data";

type GradientPoints = {
  start: Point;
  end: Point;
};

export type HoloShineProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientPoints: DerivedValue<GradientPoints>;
  holoColors: RefObject<HoloColorPalette>;
};

const DEFAULT_BORDER_RADIUS = 17;
const ZERO = 0;

function HoloShineComponent(props: HoloShineProps) {
  const gradientStart = useDerivedValue(
    () => props.gradientPoints.value.start,
    [props.gradientPoints],
  );

  const gradientEnd = useDerivedValue(
    () => props.gradientPoints.value.end,
    [props.gradientPoints],
  );

  return (
    <RoundedRect
      x={ZERO}
      y={ZERO}
      r={props.borderRadius ?? DEFAULT_BORDER_RADIUS}
      width={props.width}
      height={props.height}
    >
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={(props.holoColors.current ?? []) as Color[]}
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
    prev.gradientPoints === next.gradientPoints &&
    prev.holoColors === next.holoColors,
);

export default HoloShine;
