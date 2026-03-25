import React from "react";
import { DerivedValue } from "react-native-reanimated";
import { LinearGradient, RoundedRect } from "@shopify/react-native-skia";

type GlossLayerProps = {
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

export const GlossLayer = (props: GlossLayerProps) => {
  return (
    <RoundedRect
      x={0}
      y={0}
      r={props.borderRadius ?? 12}
      width={props.width}
      height={props.height}
    >
      <LinearGradient
        start={props.gradientStart}
        end={props.gradientEnd}
        colors={[
          "rgba(0, 0, 0, 0)",
          "rgba(255, 255, 255, 0.3)",
          "rgba(0, 0, 0, 0)",
          "rgba(255, 255, 255, 0.2)",
          "rgba(0, 0, 0, 0)",
        ]}
        positions={[0, 0.35, 0.5, 0.65, 1]}
      />
    </RoundedRect>
  );
};

export default GlossLayer;
