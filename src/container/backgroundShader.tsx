import { FC, ReactNode } from "react";
import {
  Fill,
  Mask,
  RoundedRect,
  Shader,
  SkRuntimeEffect,
} from "@shopify/react-native-skia";

interface BackgrdoundShaderProps {
  width: number;
  height: number;
  borderRadius: number;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
  time: number;
  children?: ReactNode;
}

export const BackgrdoundShader: FC<BackgrdoundShaderProps> = (props) => {
  if (props.shaderEffectRef.current == null) {
    return <></>;
  }
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
        <Shader
          source={props.shaderEffectRef.current}
          uniforms={{
            iTime: props.time,
            iResolution: [props.width, props.height],
          }}
        />
      </Fill>
    </Mask>
  );
};
