import React from "react";
import {
  DataSourceParam,
  SkImage,
  SkRuntimeEffect,
} from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
import { HoloColorPalette } from "../../data/data";
import { GestureContainerMotion } from "../gesture/gesture";

interface CardVisibilityProps {
  perfMonitor: boolean;

  showShaderBack: boolean;
  showImage: boolean;
  showHologram: boolean;
  showGloss: boolean;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;
}

interface CardSharedAssetProps {
  source: DataSourceParam;
  shader: React.RefObject<string>;
  holoColors: React.RefObject<HoloColorPalette>;
}

interface CardSizeProps {
  width: number;
  height: number;
}

interface CardCanvasContentProps
  extends CardVisibilityProps,
    CardSharedAssetProps,
    CardSizeProps {
  maxAngle: number;
  motion: GestureContainerMotion;

  hologramMaskSource?: DataSourceParam;

  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  hologramMask: SkImage | null;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
}

interface CardProps
  extends CardVisibilityProps,
    CardSharedAssetProps,
    CardSizeProps {
  hologram: React.RefObject<number>;
  screen_width: number;
  max_angle: number;
}

export type { CardCanvasContentProps, CardProps };
