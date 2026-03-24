import React, { FC } from "react";
import { Image, Mask, SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

interface ImageMaskProps {
  image: SkImage | SharedValue<SkImage | null> | null;
  mask: SkImage | SharedValue<SkImage | null> | null;
  mode?: "luminance" | "alpha";
  width: number;
  height: number;
}

const ImageMask: FC<ImageMaskProps> = (props) => {
  return (
    <Mask
      mode={props.mode || "alpha"}
      clip={false}
      mask={
        <Image
          image={props.image}
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          fit="contain"
        />
      }
    >
      <Image
        image={props.mask}
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
