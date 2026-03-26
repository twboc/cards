import { memo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { DEFAULT_BORDER_RADIUS, ZERO } from "../../const/const";
import GlossProps from "./gloss.type";
import { GLOSS_COLORS, GLOSS_POSITIONS } from "./gloss.conts";

const GlossComponent = (props: GlossProps) => {
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
};

export const Gloss = memo(
  GlossComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.gradientPoints === next.gradientPoints,
);

export default Gloss;
