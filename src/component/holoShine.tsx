import React from "react";
import { DerivedValue } from "react-native-reanimated";
import { LinearGradient, RoundedRect } from "@shopify/react-native-skia";

type HoloShineProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientStart: DerivedValue<{
    x: number;
    y: number;
  }>;
  gradientEnd: DerivedValue<{
    x: number;
    y: number;
  }>;
};

export const HoloShine = (props: HoloShineProps) => {
  return (
    <RoundedRect
      x={0}
      y={0}
      r={props.borderRadius ?? 17}
      width={props.width}
      height={props.height}
    >
      <LinearGradient
        start={props.gradientStart}
        end={props.gradientEnd}
        colors={[
          "#ff3b30",
          "#ff9500",
          "#ffcc00",
          "#4cd964",
          "#34aadc",
          "#5856d6",
          "#2e2d87",
        ]}
      />
    </RoundedRect>
  );
};

export default HoloShine;
