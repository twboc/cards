import { FC, ReactNode } from "react";
import {
  Fill,
  Mask,
  RoundedRect,
  Shader,
  SkRuntimeEffect,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

interface BackgrdoundShaderProps {
  width: number;
  height: number;
  borderRadius: number;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
  time: SharedValue<number>;
  children?: ReactNode;
}

export const BackgrdoundShader: FC<BackgrdoundShaderProps> = (props) => {
  if (props.shaderEffectRef.current == null) {
    return null;
  }

  const uniforms = useDerivedValue(() => {
    return {
      iTime: props.time.value,
      iResolution: [props.width, props.height],
    };
  }, [props.width, props.height, props.time]);

  return (
    <Mask
      mode="alpha"
      mask={
        <RoundedRect
          x={0}
          y={0}
          r={props.borderRadius}
          width={props.width}
          height={props.height}
          color="white"
        />
      }
    >
      <Fill>
        <Shader source={props.shaderEffectRef.current} uniforms={uniforms} />
      </Fill>
    </Mask>
  );
};
