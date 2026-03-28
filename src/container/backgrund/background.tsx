import React, { FC, memo, useMemo } from "react";
import { Fill, Rect, Shader } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { FILL_COLOR, ZERO } from "../../const/const";
import BackgrdoundProps from "./background.type";

const BackgrdoundComponent: FC<BackgrdoundProps> = (props) => {
  const shaderEffect = props.shaderEffectRef.current;

  if (shaderEffect == null) {
    return null;
  }

  const resolution = useMemo<[number, number]>(
    () => [props.width, props.height],
    [props.width, props.height],
  );

  const uniforms = useDerivedValue(
    () => ({
      iTime: props.time.value,
      iResolution: resolution,
    }),
    [props.time, resolution],
  );

  return (
    <Rect
      x={ZERO}
      y={ZERO}
      width={props.width}
      height={props.height}
      color={FILL_COLOR}
    >
      <Fill>
        <Shader source={shaderEffect} uniforms={uniforms} />
      </Fill>
    </Rect>
  );
};

export const Backgrdound = memo(
  BackgrdoundComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.shaderEffectRef === next.shaderEffectRef,
);

export default Backgrdound;
