import { memo } from "react";
import { DerivedValue, useDerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { GradientPoints } from "../type/type";

export type GlossLayerProps = {
  width: number;
  height: number;
  borderRadius?: number;
  gradientPoints: DerivedValue<GradientPoints>;
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
    prev.gradientPoints === next.gradientPoints,
);

export default GlossLayer;
