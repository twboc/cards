import React from "react";
import { DerivedValue } from "react-native-reanimated";
import {
  Group,
  Image,
  LinearGradient,
  Mask,
  RoundedRect,
  SkImage,
} from "@shopify/react-native-skia";
import HoloShine from "./holoShine";

type HologramLayerProps = {
  width: number;
  height: number;
  borderRadius?: number;
  hologramMask: SkImage | null;
  maskTransform: DerivedValue<any>;
  gradientStart: DerivedValue<{
    x: number;
    y: number;
  }>;
  gradientEnd: DerivedValue<{
    x: number;
    y: number;
  }>;
};

export const HologramLayer = (props: HologramLayerProps) => {
  if (!props.hologramMask) {
    return null;
  }

  return (
    <Group blendMode="overlay">
      <Mask
        mask={
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
                "rgba(255, 255, 255, 0.8)",
                "rgba(0, 0, 0, 0)",
                "rgba(255, 255, 255, 0.7)",
                "rgba(0, 0, 0, 0)",
              ]}
              positions={[0, 0.35, 0.5, 0.65, 1]}
            />
          </RoundedRect>
        }
        mode="luminance"
      >
        <Group transform={props.maskTransform}>
          <Image
            image={props.hologramMask}
            width={props.width}
            height={props.height}
            fit="cover"
          />
        </Group>

        <HoloShine
          width={props.width}
          height={props.height}
          borderRadius={props.borderRadius ?? 17}
          gradientStart={props.gradientStart}
          gradientEnd={props.gradientEnd}
        />
      </Mask>
    </Group>
  );
};

export default HologramLayer;
