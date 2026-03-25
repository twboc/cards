import React from "react";
import {
  ColorMatrix,
  Group,
  Paint,
  Image as SkiaImage,
  Blur,
  Offset,
} from "@shopify/react-native-skia";

type RGBSplitProps = {
  image: any; // SkImage
  width: number;
  height: number;
  glitchX?: number;
  glitchY?: number;
  intensity?: number; // 0..1
};

export const RGBSplit = ({
  image,
  width,
  height,
  glitchX = 6,
  glitchY = 2,
  intensity = 1,
}: RGBSplitProps) => {
  const dx = glitchX * intensity;
  const dy = glitchY * intensity;

  return (
    <>
      {/* BASE — untouched */}
      <SkiaImage image={image} x={0} y={0} width={width} height={height} />

      {/* RED SPLIT */}
      <Group
        layer={
          <Paint blendMode="screen">
            <ColorMatrix
              matrix={[
                1,
                0,
                0,
                0,
                0, // R' = R
                0,
                0,
                0,
                0,
                0, // G' = 0
                0,
                0,
                0,
                0,
                0, // B' = 0
                0,
                0,
                0,
                0.45,
                0, // A' = A * 0.45
              ]}
            />
            <Offset x={dx} y={0} />
          </Paint>
        }
      >
        <SkiaImage image={image} x={0} y={0} width={width} height={height} />
      </Group>

      {/* CYAN SPLIT */}
      <Group
        layer={
          <Paint blendMode="screen">
            <ColorMatrix
              matrix={[
                0,
                0,
                0,
                0,
                0, // R' = 0
                0,
                1,
                0,
                0,
                0, // G' = G
                0,
                0,
                1,
                0,
                0, // B' = B
                0,
                0,
                0,
                0.35,
                0, // A' = A * 0.35
              ]}
            />
            <Offset x={-dx} y={0} />
          </Paint>
        }
      >
        <SkiaImage image={image} x={0} y={0} width={width} height={height} />
      </Group>

      {/* SMEAR */}
      <Group
        layer={
          <Paint>
            <Offset x={dx * 0.35} y={dy} />
            <Blur blur={1.2} mode="clamp" />
            <ColorMatrix
              matrix={[
                1,
                0,
                0,
                0,
                0, // R' = R
                0,
                1,
                0,
                0,
                0, // G' = G
                0,
                0,
                1,
                0,
                0, // B' = B
                0,
                0,
                0,
                0.16,
                0, // A' = A * 0.16
              ]}
            />
          </Paint>
        }
      >
        <SkiaImage image={image} x={0} y={0} width={width} height={height} />
      </Group>
    </>
  );
};

export default RGBSplit;
