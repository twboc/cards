import { RefObject } from "react";
import { DerivedValue } from "react-native-reanimated";
import { GradientPoints } from "../../type/type";
import { HoloColorPalette } from "../../data/data.colors";

interface ShineProps {
  width: number;
  height: number;
  borderRadius?: number;
  gradientPoints: DerivedValue<GradientPoints>;
  holoColors: RefObject<HoloColorPalette>;
}

export default ShineProps;
