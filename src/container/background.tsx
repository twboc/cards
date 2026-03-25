import React, { memo, RefObject } from "react";
import {
  Fill,
  Mask,
  RoundedRect,
  Shader,
  SkRuntimeEffect,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { ZERO } from "../const/const";

type BackgrdoundProps = {
  width: number;
  height: number;
  borderRadius: number;
  shaderEffectRef: RefObject<SkRuntimeEffect | null>;
  time: SharedValue<number>;
};

const MASK_MODE = "alpha" as const;
const MASK_COLOR = "white";

const BackgrdoundComponent = (props: BackgrdoundProps) => {
  const shaderEffect = props.shaderEffectRef.current;

  if (shaderEffect == null) {
    return null;
  }

  const uniforms = useDerivedValue(
    () => ({
      iTime: props.time.value,
      iResolution: [props.width, props.height],
    }),
    [props.time, props.width, props.height],
  );

  return (
    <Mask
      mode={MASK_MODE}
      mask={
        <RoundedRect
          x={ZERO}
          y={ZERO}
          r={props.borderRadius}
          width={props.width}
          height={props.height}
          color={MASK_COLOR}
        />
      }
    >
      <Fill>
        <Shader source={shaderEffect} uniforms={uniforms} />
      </Fill>
    </Mask>
  );
};

export const Backgrdound = memo(
  BackgrdoundComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.borderRadius === next.borderRadius &&
    prev.shaderEffectRef === next.shaderEffectRef &&
    prev.time === next.time,
);

Backgrdound.displayName = "Backgrdound";

export default Backgrdound;
