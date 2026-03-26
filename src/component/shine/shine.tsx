import { memo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Color, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import { DEFAULT_BORDER_RADIUS, ZERO } from "../../const/const";
import ShineProps from "./shine.type";

const ShineComponent = (props: ShineProps) => {
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
};

export const Shine = memo(
  ShineComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.gradientPoints === next.gradientPoints &&
    prev.holoColors === next.holoColors,
);

export default Shine;
