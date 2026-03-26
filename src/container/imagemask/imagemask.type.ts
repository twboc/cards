import React from "react";
import { AnimatedProp, SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

export type MaskImageSource =
  | SkImage
  | SharedValue<SkImage | null>
  | AnimatedProp<SkImage | null>
  | React.ReactElement
  | null;

export default interface ImageMaskProps {
  image: MaskImageSource;
  mask: MaskImageSource;
  mode?: "luminance" | "alpha";
  width: number;
  height: number;
}
