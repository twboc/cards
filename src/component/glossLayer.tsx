import { memo } from "react";
import { DerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { Point } from "../type/type";

export type GlossLayerProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientStart: DerivedValue<Point>;
  gradientEnd: DerivedValue<Point>;
};

const GLOSS_COLORS = [
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.3)",
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(0, 0, 0, 0)",
] as Color[];

const GLOSS_POSITIONS = [0, 0.35, 0.5, 0.65, 1] as number[];

const DEFAULT_BORDER_RADIUS = 12;
const ZERO = 0;

function GlossLayerComponent(props: GlossLayerProps) {
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
        colors={GLOSS_COLORS}
        positions={GLOSS_POSITIONS}
      />
    </RoundedRect>
  );
}

export const GlossLayer = memo(
  GlossLayerComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.gradientStart === next.gradientStart &&
    prev.gradientEnd === next.gradientEnd,
);

export default GlossLayer;
