import { memo, RefObject } from "react";
import { DerivedValue, useDerivedValue } from "react-native-reanimated";
import {
  Color,
  Group,
  Image,
  LinearGradient,
  Mask,
  RoundedRect,
  SkImage,
} from "@shopify/react-native-skia";
import HoloShine from "./holoShine";
import { Point } from "../type/type";
import { HoloColorPalette } from "../data/data";

type GradientPoints = {
  start: Point;
  end: Point;
};

export type HologramLayerProps = {
  width: number;
  height: number;
  borderRadius?: number;
  hologramMask: SkImage | null;
  holoColors: RefObject<HoloColorPalette>;
  maskTransform: DerivedValue<
    (
      | {
          translateX: number;
          translateY?: undefined;
        }
      | {
          translateY: number;
          translateX?: undefined;
        }
    )[]
  >;
  gradientPoints: DerivedValue<GradientPoints>;
};

const ZERO = 0;
const DEFAULT_MASK_RADIUS = 12;
const DEFAULT_SHINE_RADIUS = 17;

const MASK_COLORS = [
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.8)",
  "rgba(0, 0, 0, 0)",
  "rgba(255, 255, 255, 0.7)",
  "rgba(0, 0, 0, 0)",
] as Color[];

const MASK_POSITIONS = [0, 0.35, 0.5, 0.65, 1] as number[];
const IMAGE_FIT = "cover" as const;
const BLEND_MODE = "overlay" as const;
const MASK_MODE = "luminance" as const;

function HologramLayerComponent(props: HologramLayerProps) {
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

  const maskRadius = props.borderRadius ?? DEFAULT_MASK_RADIUS;

  return (
    <Group blendMode={BLEND_MODE}>
      <Mask
        mode={MASK_MODE}
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
              colors={MASK_COLORS}
              positions={MASK_POSITIONS}
            />
          </RoundedRect>
        }
      >
        <Group transform={props.maskTransform}>
          <Image
            image={props.hologramMask}
            width={props.width}
            height={props.height}
            fit={IMAGE_FIT}
          />
        </Group>

        <HoloShine
          width={props.width}
          height={props.height}
          borderRadius={props.borderRadius ?? DEFAULT_SHINE_RADIUS}
          gradientPoints={props.gradientPoints}
          holoColors={props.holoColors}
        />
      </Mask>
    </Group>
  );
}

export const HologramLayer = memo(
  HologramLayerComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.hologramMask === next.hologramMask &&
    prev.holoColors === next.holoColors &&
    prev.maskTransform === next.maskTransform &&
    prev.gradientPoints === next.gradientPoints,
);

export default HologramLayer;
