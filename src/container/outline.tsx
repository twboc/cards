import {
  AnimatedProp,
  Canvas,
  Fit,
  Group,
  Image,
  Mask,
  Morphology,
  Rect,
  SkImage,
} from "@shopify/react-native-skia";

type Props = {
  image: SkImage;
  width: number;
  height: number;
  fit?: AnimatedProp<Fit>;
  outlineColor?: string;
  outlineSize?: number;
};

export function Outline({
  image,
  width,
  height,
  fit = "contain",
  outlineColor = "#ffffff",
  outlineSize = 4,
}: Props) {
  return (
    <>
      {/* 1) Draw the expanded silhouette */}
      <Mask
        mode="alpha"
        mask={
          <Image
            image={image}
            x={0}
            y={0}
            width={width}
            height={height}
            fit={fit}
          >
            <Morphology operator="dilate" radius={outlineSize} />
          </Image>
        }
      >
        <Rect x={0} y={0} width={width} height={height} color={outlineColor} />
      </Mask>

      {/* 2) Punch out the original image shape from the middle */}
      <Group blendMode="dstOut">
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit={fit}
        />
      </Group>
    </>
  );
}
