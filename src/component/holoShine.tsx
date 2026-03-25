import { memo, RefObject } from "react";
import { DerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { Point } from "../type/type";
import { HoloColorPalette } from "../data/data";

export type HoloShineProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientStart: DerivedValue<Point>;
  gradientEnd: DerivedValue<Point>;
  holoColors: RefObject<HoloColorPalette>;
};

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
    prev.gradientStart === next.gradientStart &&
    prev.gradientEnd === next.gradientEnd &&
    prev.holoColors === next.holoColors,
);

export default HoloShine;
