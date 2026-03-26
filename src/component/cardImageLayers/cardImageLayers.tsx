import { memo, useCallback, useMemo } from "react";
import { Image, Rect } from "@shopify/react-native-skia";
import HoloShine from "../holoShine";
import { Outline } from "../../container/outline/outline";
import ImageMask from "../../container/imagemask/imagemask";
import RGBSplit from "../../container/rgbsplit/rgbsplit";
import {
  DEFAULT_BORDER_RADIUS,
  FILL_COLOR,
  IMAGE_FIT,
  MASK_MODE_OVERRIDE,
} from "../../const/const";
import CardImageLayersProps from "./cardImageLayers.type";

function CardImageLayersComponent(props: CardImageLayersProps) {
  const hasImage = props.image != null;
  const hasBackground = props.background != null;
  const hasGradientPoints = props.gradientPoints != null;

  const showBackgroundLayer = props.showBackground && hasBackground;
  const showOutlineLayer = props.showOutline && hasImage;
  const showOutlineMaskLayer = props.showOutlineMask && hasImage;
  const showOutlineHoloLayer =
    props.showOutlineHolo && hasImage && hasGradientPoints;
  const showImageLayer = props.showImage && hasImage;
  const showRGBSplitLayer = props.showRGBSplit && hasImage;
  const showHoloMaskLayer = props.showHoloMask && hasImage;

  const outlineProps = useMemo(
    () => ({
      image: props.image,
      width: props.width,
      height: props.height,
    }),
    [props.image, props.width, props.height],
  );

  const renderOutlineMask = useCallback(
    () => <Outline {...outlineProps} />,
    [outlineProps],
  );

  const whiteRectNode = useMemo(
    () => <Rect width={props.width} height={props.height} color={FILL_COLOR} />,
    [props.width, props.height],
  );

  const backgroundNode = useMemo(() => {
    if (!showBackgroundLayer || !props.background) {
      return null;
    }

    return (
      <Image
        image={props.background}
        width={props.width}
        height={props.height}
        fit={IMAGE_FIT}
      />
    );
  }, [showBackgroundLayer, props.background, props.width, props.height]);

  const outlineNode = useMemo(() => {
    if (!showOutlineLayer) {
      return null;
    }

    return (
      <ImageMask
        image={whiteRectNode}
        mask={renderOutlineMask()}
        width={props.width}
        height={props.height}
        mode={MASK_MODE_OVERRIDE}
      />
    );
  }, [
    showOutlineLayer,
    whiteRectNode,
    renderOutlineMask,
    props.width,
    props.height,
  ]);

  const outlineMaskNode = useMemo(() => {
    if (!showOutlineMaskLayer) {
      return null;
    }

    return (
      <ImageMask
        image={props.holoCover}
        mask={renderOutlineMask()}
        width={props.width}
        height={props.height}
        mode={MASK_MODE_OVERRIDE}
      />
    );
  }, [
    showOutlineMaskLayer,
    props.holoCover,
    renderOutlineMask,
    props.width,
    props.height,
  ]);

  const holoShineNode = useMemo(() => {
    if (!showOutlineHoloLayer || !props.gradientPoints) {
      return null;
    }

    return (
      <HoloShine
        width={props.width}
        height={props.height}
        borderRadius={DEFAULT_BORDER_RADIUS}
        gradientPoints={props.gradientPoints}
        holoColors={props.holoColors}
      />
    );
  }, [
    showOutlineHoloLayer,
    props.width,
    props.height,
    props.gradientPoints,
    props.holoColors,
  ]);

  const outlineHoloNode = useMemo(() => {
    if (!showOutlineHoloLayer || holoShineNode == null) {
      return null;
    }

    return (
      <ImageMask
        image={holoShineNode}
        mask={renderOutlineMask()}
        width={props.width}
        height={props.height}
        mode={MASK_MODE_OVERRIDE}
      />
    );
  }, [
    showOutlineHoloLayer,
    holoShineNode,
    renderOutlineMask,
    props.width,
    props.height,
  ]);

  const imageNode = useMemo(() => {
    if (!showImageLayer || !props.image) {
      return null;
    }

    return (
      <Image image={props.image} width={props.width} height={props.height} />
    );
  }, [showImageLayer, props.image, props.width, props.height]);

  const rgbSplitNode = useMemo(() => {
    if (!showRGBSplitLayer || !props.image) {
      return null;
    }

    return (
      <RGBSplit image={props.image} width={props.width} height={props.height} />
    );
  }, [showRGBSplitLayer, props.image, props.width, props.height]);

  const holoMaskNode = useMemo(() => {
    if (!showHoloMaskLayer || !props.image) {
      return null;
    }

    return (
      <ImageMask
        image={props.holoCover}
        mask={props.image}
        width={props.width}
        height={props.height}
        mode={MASK_MODE_OVERRIDE}
      />
    );
  }, [
    showHoloMaskLayer,
    props.holoCover,
    props.image,
    props.width,
    props.height,
  ]);

  if (!hasImage) {
    return null;
  }

  return (
    <>
      {backgroundNode}
      {outlineNode}
      {outlineMaskNode}
      {outlineHoloNode}
      {imageNode}
      {rgbSplitNode}
      {holoMaskNode}
    </>
  );
}

export const CardImageLayers = memo(
  CardImageLayersComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.background === next.background &&
    prev.image === next.image &&
    prev.holoCover === next.holoCover &&
    prev.holoColors === next.holoColors &&
    prev.showBackground === next.showBackground &&
    prev.showOutline === next.showOutline &&
    prev.showOutlineMask === next.showOutlineMask &&
    prev.showOutlineHolo === next.showOutlineHolo &&
    prev.showImage === next.showImage &&
    prev.showRGBSplit === next.showRGBSplit &&
    prev.showHoloMask === next.showHoloMask &&
    prev.gradientPoints === next.gradientPoints,
);

export default CardImageLayers;
