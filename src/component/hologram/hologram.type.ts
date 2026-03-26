import { RefObject } from "react";
import { DerivedValue } from "react-native-reanimated";
import { SkImage, Transforms3d } from "@shopify/react-native-skia";
import { GradientPoints } from "../../type/type";
import { HoloColorPalette } from "../../data/data.colors";

interface HologramProps {
  width: number;
  height: number;
  borderRadius?: number;
  hologramMask: SkImage | null;
  holoColors: RefObject<HoloColorPalette>;
  maskTransform: DerivedValue<Transforms3d>;
  gradientPoints: DerivedValue<GradientPoints>;
}

export default HologramProps;
