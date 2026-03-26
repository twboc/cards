import { RefObject } from "react";
import { DerivedValue, SharedValue } from "react-native-reanimated";
import { SkImage } from "@shopify/react-native-skia";
import { GradientPoints } from "../../type/type";
import { HoloColorPalette } from "../../data/data.colors";

interface CardImageLayersProps {
  width: number;
  height: number;
  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  holoColors: RefObject<HoloColorPalette>;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showImage: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;

  gradientPoints?: DerivedValue<GradientPoints>;
}

export default CardImageLayersProps;
