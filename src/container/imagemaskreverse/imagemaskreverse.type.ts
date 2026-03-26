import { SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
interface ImageMaskReverseProps {
  image: SkImage | SharedValue<SkImage | null> | null;
  mask: SkImage | SharedValue<SkImage | null> | null;
  mode?: "luminance" | "alpha";
  width: number;
  height: number;
}

export default ImageMaskReverseProps;
