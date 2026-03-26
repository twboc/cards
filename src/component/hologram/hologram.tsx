import { memo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import {
  Group,
  Image,
  LinearGradient,
  Mask,
  RoundedRect,
} from "@shopify/react-native-skia";
import Shine from "../shine/shine";
import { DEFAULT_BORDER_RADIUS, ZERO } from "../../const/const";
import HologramProps from "./hologram.type";
import {
  HOLO_BLEND_MODE,
  HOLO_IMAGE_FIT,
  HOLO_MASK_COLORS,
  HOLO_MASK_MODE,
  HOLO_MASK_POSITIONS,
} from "./hologram.const";

const HologramComponent = (props: HologramProps) => {
  const gradientStart = useDerivedValue(
    () => props.gradientPoints.value.start,
    [props.gradientPoints],
  );

  const gradientEnd = useDerivedValue(
    () => props.gradientPoints.value.end,
    [props.gradientPoints],
  );

  if (!props.hologramMask) {
    return null;
  }

  const maskRadius = props.borderRadius ?? DEFAULT_BORDER_RADIUS;

  return (
    <Group blendMode={HOLO_BLEND_MODE}>
      <Mask
        mode={HOLO_MASK_MODE}
        mask={
          <RoundedRect
            x={ZERO}
            y={ZERO}
            r={maskRadius}
            width={props.width}
            height={props.height}
          >
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={HOLO_MASK_COLORS}
              positions={HOLO_MASK_POSITIONS}
            />
          </RoundedRect>
        }
      >
        <Group transform={props.maskTransform}>
          <Image
            image={props.hologramMask}
            width={props.width}
            height={props.height}
            fit={HOLO_IMAGE_FIT}
          />
        </Group>

        <Shine
          width={props.width}
          height={props.height}
          borderRadius={props.borderRadius ?? DEFAULT_BORDER_RADIUS}
          gradientPoints={props.gradientPoints}
          holoColors={props.holoColors}
        />
      </Mask>
    </Group>
  );
};

export const Hologram = memo(
  HologramComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.hologramMask === next.hologramMask &&
    prev.holoColors === next.holoColors &&
    prev.maskTransform === next.maskTransform &&
    prev.gradientPoints === next.gradientPoints,
);

export default Hologram;
