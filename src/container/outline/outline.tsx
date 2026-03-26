import React, { FC, memo, useMemo } from "react";
import {
  Group,
  Image,
  Mask,
  Morphology,
  Rect,
} from "@shopify/react-native-skia";
import {
  DEFAULT_FIT,
  DEFAULT_MODE,
  DEFAULT_OUTLINE_COLOR,
  DEFAULT_OUTLINE_SIZE,
  DST_OUT_BLEND,
  ZERO,
} from "../../const/const";
import OutlinProps from "./outline.typt";

const OutlineComponent: FC<OutlinProps> = (props) => {
  if (props.image == null) {
    return null;
  }

  const imageProps = useMemo(
    () => ({
      image: props.image,
      x: ZERO,
      y: ZERO,
      width: props.width,
      height: props.height,
      fit: DEFAULT_FIT,
    }),
    [props.image, props.width, props.height],
  );

  const dilatedMask = useMemo(
    () => (
      <Image {...imageProps}>
        <Morphology operator="dilate" radius={DEFAULT_OUTLINE_SIZE} />
      </Image>
    ),
    [imageProps],
  );

  const punchOutImage = useMemo(() => <Image {...imageProps} />, [imageProps]);

  return (
    <>
      <Mask mode={DEFAULT_MODE} mask={dilatedMask}>
        <Rect
          x={ZERO}
          y={ZERO}
          width={props.width}
          height={props.height}
          color={DEFAULT_OUTLINE_COLOR}
        />
      </Mask>

      <Group blendMode={DST_OUT_BLEND}>{punchOutImage}</Group>
    </>
  );
};

export const Outline = memo(
  OutlineComponent,
  (prev, next) =>
    prev.image === next.image &&
    prev.width === next.width &&
    prev.height === next.height,
);

export default Outline;
