import { RefObject } from "react";
import { SkRuntimeEffect } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

export default interface BackgrdoundProps {
  width: number;
  height: number;
  shaderEffectRef: RefObject<SkRuntimeEffect | null>;
  time: SharedValue<number>;
}
