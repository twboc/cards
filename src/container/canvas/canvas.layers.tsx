import React, { memo } from "react";
import { SharedValue, DerivedValue } from "react-native-reanimated";
import { SkImage } from "@shopify/react-native-skia";
import { Backgrdound } from "../background";
import ImageMaskReverse from "../imagemaskreverse";
import HologramLayer from "../../component/hologramLayer";
import GlossLayer from "../../component/glossLayer";
import CardImageLayers from "../../component/cardImageLayers";
import { HoloColorPalette } from "../../data/data";
import { GradientPoints } from "../../type/type";
import { PerformanceOverlay } from "../monitor";

type ShaderLayerProps = {
  visible: boolean;
  width: number;
  height: number;
  borderRadius: number;
  time: DerivedValue<number>;
  shaderEffectRef: React.RefObject<any>;
};

export const ShaderLayer = memo((props: ShaderLayerProps) => {
  if (!props.visible) {
    return null;
  }

  return (
    <Backgrdound
      width={props.width}
      height={props.height}
      borderRadius={props.borderRadius}
      time={props.time}
      shaderEffectRef={props.shaderEffectRef}
    />
  );
});

ShaderLayer.displayName = "ShaderLayer";

type HoloBackgroundLayerProps = {
  visible: boolean;
  width: number;
  height: number;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
};

export const HoloBackgroundLayer = memo((props: HoloBackgroundLayerProps) => {
  if (!props.visible || !props.image) {
    return null;
  }

  return (
    <ImageMaskReverse
      width={props.width}
      height={props.height}
      image={props.holoCover}
      mask={props.image}
    />
  );
});

HoloBackgroundLayer.displayName = "HoloBackgroundLayer";

type CardImageRenderLayerProps = {
  width: number;
  height: number;
  holoColors: React.RefObject<HoloColorPalette>;
  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showImage: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  gradientPoints?: DerivedValue<GradientPoints>;
};

export const CardImageRenderLayer = memo((props: CardImageRenderLayerProps) => {
  return <CardImageLayers {...props} />;
});

CardImageRenderLayer.displayName = "CardImageRenderLayer";

type HologramRenderLayerProps = {
  visible: boolean;
  width: number;
  height: number;
  holoColors: React.RefObject<HoloColorPalette>;
  borderRadius: number;
  hologramMask: SkImage | null;
  maskTransform: any;
  gradientPoints: DerivedValue<GradientPoints>;
};

export const HologramRenderLayer = memo((props: HologramRenderLayerProps) => {
  if (!props.visible) {
    return null;
  }

  return (
    <HologramLayer
      width={props.width}
      height={props.height}
      holoColors={props.holoColors}
      borderRadius={props.borderRadius}
      hologramMask={props.hologramMask}
      maskTransform={props.maskTransform}
      gradientPoints={props.gradientPoints}
    />
  );
});

HologramRenderLayer.displayName = "HologramRenderLayer";

type GlossRenderLayerProps = {
  visible: boolean;
  width: number;
  height: number;
  borderRadius: number;
  gradientPoints: DerivedValue<GradientPoints>;
};

export const GlossRenderLayer = memo((props: GlossRenderLayerProps) => {
  if (!props.visible) {
    return null;
  }

  return (
    <GlossLayer
      width={props.width}
      height={props.height}
      borderRadius={props.borderRadius}
      gradientPoints={props.gradientPoints}
    />
  );
});

GlossRenderLayer.displayName = "GlossRenderLayer";

type PerfOverlayLayerProps = {
  visible: boolean;
  title?: string;
};

export const PerfOverlayLayer = memo((props: PerfOverlayLayerProps) => {
  return <PerformanceOverlay visible={props.visible} title={props.title} />;
});

PerfOverlayLayer.displayName = "PerfOverlayLayer";
