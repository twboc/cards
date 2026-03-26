import React, { FC, memo, useMemo } from "react";
import { Group, Image, Mask, Paint, Rect } from "@shopify/react-native-skia";
import {
  CLIP,
  DEFAULT_MODE,
  DST_OUT_BLEND,
  MASK_IMAGE_FIT,
  MASK_COLOR,
  MASK_FIT,
  ZERO,
} from "../../const/const";
import ImageMaskReverseProps from "./imagemaskreverse.type";

const ImageMaskReverseComponent: FC<ImageMaskReverseProps> = (props) => {
  if (props.image == null || props.mask == null) {
    return null;
  }

  const mode = props.mode ?? DEFAULT_MODE;

  const maskNode = useMemo(
    () => (
      <>
        <Rect
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
          color={MASK_COLOR}
        />
        <Group layer={<Paint blendMode={DST_OUT_BLEND} />}>
          <Image
            image={props.mask}
            x={ZERO}
            y={ZERO}
            width={props.width}
            height={props.height}
            fit={MASK_FIT}
          />
        </Group>
      </>
    ),
    [props.mask, props.width, props.height],
  );

  const imageNode = useMemo(
    () => (
      <Image
        image={props.image}
        x={ZERO}
        y={ZERO}
        width={props.width}
        height={props.height}
        fit={MASK_IMAGE_FIT}
      />
    ),
    [props.image, props.width, props.height],
  );

  return (
    <Mask mode={mode} clip={CLIP} mask={maskNode}>
      {imageNode}
    </Mask>
  );
};

export const ImageMaskReverse = memo(
  ImageMaskReverseComponent,
  (prev, next) =>
    prev.image === next.image &&
    prev.mask === next.mask &&
    prev.mode === next.mode &&
    prev.width === next.width &&
    prev.height === next.height,
);

export default ImageMaskReverse;
