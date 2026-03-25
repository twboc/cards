import React, { FC, memo } from "react";
import {
  Blur,
  ColorMatrix,
  Group,
  Image,
  Offset,
  Paint,
} from "@shopify/react-native-skia";
import RGBSplitProps from "./rgbsplit.type";
import {
  CLAMP_MODE,
  CYAN_MATRIX,
  DEFAULT_GLITCH_X,
  DEFAULT_GLITCH_Y,
  DEFAULT_INTENSITY,
  RED_MATRIX,
  SCREEN_BLEND,
  SMEAR_BLUR,
  SMEAR_MATRIX,
  SMEAR_X_FACTOR,
} from "./rgbsplit.const";
import { ZERO } from "../../const/const";

const RGBSplitComponent: FC<RGBSplitProps> = (props) => {
  if (!props.image) {
    return null;
  }

  const glitchX = props.glitchX ?? DEFAULT_GLITCH_X;
  const glitchY = props.glitchY ?? DEFAULT_GLITCH_Y;
  const intensity = props.intensity ?? DEFAULT_INTENSITY;

  const dx = glitchX * intensity;
  const dy = glitchY * intensity;
  const smearDx = dx * SMEAR_X_FACTOR;

  return (
    <>
      <Image
        image={props.image}
        x={ZERO}
        y={ZERO}
        width={props.width}
        height={props.height}
      />

      <Group
        layer={
          <Paint blendMode={SCREEN_BLEND}>
            <ColorMatrix matrix={RED_MATRIX} />
            <Offset x={dx} y={ZERO} />
          </Paint>
        }
      >
        <Image
          image={props.image}
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
        />
      </Group>

      <Group
        layer={
          <Paint blendMode={SCREEN_BLEND}>
            <ColorMatrix matrix={CYAN_MATRIX} />
            <Offset x={-dx} y={ZERO} />
          </Paint>
        }
      >
        <Image
          image={props.image}
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
        />
      </Group>

      <Group
        layer={
          <Paint>
            <Offset x={smearDx} y={dy} />
            <Blur blur={SMEAR_BLUR} mode={CLAMP_MODE} />
            <ColorMatrix matrix={SMEAR_MATRIX} />
          </Paint>
        }
      >
        <Image
          image={props.image}
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
        />
      </Group>
    </>
  );
};

export const RGBSplit = memo(
  RGBSplitComponent,
  (prev, next) =>
    prev.image === next.image &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.glitchX === next.glitchX &&
    prev.glitchY === next.glitchY &&
    prev.intensity === next.intensity,
);

export default RGBSplit;
