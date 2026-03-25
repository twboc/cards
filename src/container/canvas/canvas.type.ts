import React from "react";
import { SharedValue } from "react-native-reanimated";
import {
  DataSourceParam,
  SkImage,
  SkRuntimeEffect,
} from "@shopify/react-native-skia";
import { StyleProp, ViewStyle } from "react-native";
import { GestureContainerMotion } from "../gesture/gesture";
import { HoloColorPalette } from "../../data/data";

export default interface FullCanvasProps {
  perfMonitor: boolean;

  showImage: boolean;
  showShaderBack: boolean;
  showHologram: boolean;
  showGloss: boolean;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;

  maxAngle?: number;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  hologramMaskSource?: DataSourceParam;
  shader: React.RefObject<string>;
  holoColors: React.RefObject<HoloColorPalette>;
  motion?: GestureContainerMotion;
  borderRadius?: number;
  source: DataSourceParam;

  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  hologramMask: SkImage | null;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
}
