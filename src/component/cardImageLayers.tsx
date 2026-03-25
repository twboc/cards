import { memo, RefObject } from "react";
import { DerivedValue, SharedValue } from "react-native-reanimated";
import { Image, SkImage } from "@shopify/react-native-skia";
import HoloShine from "../component/holoShine";
import { Outline } from "../container/outline";
import ImageMask from "../container/imagemask";
import RGBSplit from "../container/rgbsplit";
import { Point } from "../type/type";
import { HoloColorPalette } from "../data/data";

type GradientPoints = {
  start: Point;
  end: Point;
};

export type CardImageLayersProps = {
  width: number;
  height: number;
  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  holoColors: RefObject<HoloColorPalette>;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showImage: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;

  gradientPoints?: DerivedValue<GradientPoints>;
};

const IMAGE_FIT = "cover" as const;
const MASK_MODE = "luminance" as const;
const OUTLINE_HOLO_RADIUS = 17;

function CardImageLayersComponent(props: CardImageLayersProps) {
  if (!props.image) {
    return null;
  }

  return (
    <>
      {props.showBackground && props.background && (
        <Image
          image={props.background}
          width={props.width}
          height={props.height}
          fit={IMAGE_FIT}
        />
      )}

      {props.showOutline && (
        <Outline
          image={props.image}
          width={props.width}
          height={props.height}
        />
      )}

      {props.showOutlineMask && (
        <ImageMask
          image={props.holoCover}
          mask={
            <Outline
              image={props.image}
              width={props.width}
              height={props.height}
            />
          }
          width={props.width}
          height={props.height}
          mode={MASK_MODE}
        />
      )}

      {props.showOutlineHolo && props.gradientPoints && (
        <ImageMask
          image={
            <HoloShine
              width={props.width}
              height={props.height}
              borderRadius={OUTLINE_HOLO_RADIUS}
              gradientPoints={props.gradientPoints}
              holoColors={props.holoColors}
            />
          }
          mask={
            <Outline
              image={props.image}
              width={props.width}
              height={props.height}
            />
          }
          width={props.width}
          height={props.height}
          mode={MASK_MODE}
        />
      )}

      {props.showImage && (
        <Image image={props.image} width={props.width} height={props.height} />
      )}

      {props.showRGBSplit && (
        <RGBSplit
          image={props.image}
          width={props.width}
          height={props.height}
        />
      )}

      {props.showHoloMask && (
        <ImageMask
          image={props.holoCover}
          mask={props.image}
          width={props.width}
          height={props.height}
          mode={MASK_MODE}
        />
      )}
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
