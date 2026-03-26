import { DerivedValue } from "react-native-reanimated";
import { GradientPoints } from "../../type/type";

export default interface GlossProps {
  width: number;
  height: number;
  borderRadius?: number;
  gradientPoints: DerivedValue<GradientPoints>;
}
