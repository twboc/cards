import React, { FC, memo, useMemo } from "react";
import { AnimatedProp, Image, Mask, SkImage } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";
import {
  CLIP,
  DEFAULT_MODE,
  IMAGE_FIT,
  MASK_FIT,
  ZERO,
} from "../../const/const";
import ImageMaskProps from "./imagemask.type";
import { isRawImageSource, isRenderableElement } from "./imagemask.util";

const ImageMaskComponent: FC<ImageMaskProps> = (props) => {
  const mode = props.mode ?? DEFAULT_MODE;

  if (props.mask == null || props.image == null) {
    return null;
  }

  if (isRawImageSource(props.mask) && isRawImageSource(props.image)) {
    return (
      <Mask
        mode={mode}
        clip={CLIP}
        mask={
          <Image
            image={props.mask}
            x={ZERO}
            y={ZERO}
            width={props.width}
            height={props.height}
            fit={MASK_FIT}
          />
        }
      >
        <Image
          image={props.image}
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
          fit={IMAGE_FIT}
        />
      </Mask>
    );
  }

  const maskNode = useMemo(() => {
    if (isRenderableElement(props.mask)) {
      return props.mask;
    }

    return (
      <Image
        image={
          props.mask as
            | SkImage
            | SharedValue<SkImage | null>
            | AnimatedProp<SkImage | null>
        }
        x={ZERO}
        y={ZERO}
        width={props.width}
        height={props.height}
        fit={MASK_FIT}
      />
    );
  }, [props.mask, props.width, props.height]);

  const imageNode = useMemo(() => {
    if (isRenderableElement(props.image)) {
      return props.image;
    }

    return (
      <Image
        image={
          props.image as
            | SkImage
            | SharedValue<SkImage | null>
            | AnimatedProp<SkImage | null>
        }
        x={ZERO}
        y={ZERO}
        width={props.width}
        height={props.height}
        fit={IMAGE_FIT}
      />
    );
  }, [props.image, props.width, props.height]);

  return (
    <Mask mode={mode} clip={CLIP} mask={maskNode}>
      {imageNode}
    </Mask>
  );
};

export const ImageMask = memo(
  ImageMaskComponent,
  (prev, next) =>
    prev.image === next.image &&
    prev.mask === next.mask &&
    prev.mode === next.mode &&
    prev.width === next.width &&
    prev.height === next.height,
);

export default ImageMask;
