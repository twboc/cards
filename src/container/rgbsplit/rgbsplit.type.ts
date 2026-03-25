import { SkImage } from "@shopify/react-native-skia";

type RGBSplitProps = {
  image: SkImage | null;
  width: number;
  height: number;
  glitchX?: number;
  glitchY?: number;
  intensity?: number;
};

export default RGBSplitProps;
