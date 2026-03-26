import React from "react";
import { AnimatedProp, SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
import { MaskImageSource } from "./imagemask.type";

export const isRenderableElement = (
  value: MaskImageSource,
): value is React.ReactElement => React.isValidElement(value);

export const isRawImageSource = (
  value: MaskImageSource,
): value is
  | SkImage
  | SharedValue<SkImage | null>
  | AnimatedProp<SkImage | null> => {
  return value != null && !React.isValidElement(value);
};
