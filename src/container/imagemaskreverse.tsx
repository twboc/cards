import React, { FC } from "react";
import {
  Group,
  Image,
  Mask,
  Paint,
  Rect,
  SkImage,
} from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

interface ImageMaskReverseProps {
  image: SkImage | SharedValue<SkImage | null> | null;
  mask: SkImage | SharedValue<SkImage | null> | null;
  mode?: "luminance" | "alpha";
  width: number;
  height: number;
}

const ImageMaskReverse: FC<ImageMaskReverseProps> = (props) => {
  return (
    <Mask
      mode={props.mode || "alpha"}
      clip={false}
      mask={
        <>
          <Rect
            x={0}
            y={0}
            width={props.width}
            height={props.height}
            color="white"
          />
          <Group layer={<Paint blendMode="dstOut" />}>
            <Image
              image={props.image}
              x={0}
              y={0}
              width={props.width}
              height={props.height}
              fit="contain"
            />
          </Group>
        </>
      }
    >
      <Image
        image={props.mask}
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        fit={"fill"}
      />
    </Mask>
  );
};

export default ImageMaskReverse;
