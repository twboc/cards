import React, { FC } from "react";
import { AnimatedProp, Image, Mask, SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

interface ImageMaskProps {
  image: SkImage | SharedValue<SkImage | null> | null;
  mask:
    | SkImage
    | SharedValue<SkImage | null>
    | AnimatedProp<SkImage | null>
    | Element
    | null;
  mode?: "luminance" | "alpha";
  width: number;
  height: number;
}

const ImageMask: FC<ImageMaskProps> = (props) => {
  const mask = React.isValidElement(props.mask) ? (
    props.mask
  ) : (
    <Image
      image={
        props.mask as
          | SkImage
          | SharedValue<SkImage | null>
          | AnimatedProp<SkImage | null>
      }
      x={0}
      y={0}
      width={props.width}
      height={props.height}
      fit="contain"
    />
  );
  return (
    <Mask mode={props.mode || "alpha"} clip={false} mask={mask}>
      <Image
        image={props.image}
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        fit="fill"
      />
    </Mask>
  );
};

export default ImageMask;
