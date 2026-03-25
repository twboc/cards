import React, { FC, memo, PropsWithChildren, useMemo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Canvas, Transforms3d, useClock } from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { Backgrdound } from "../background";
import ImageMaskReverse from "../imagemaskreverse";
import HologramLayer from "../../component/hologramLayer";
import GlossLayer from "../../component/glossLayer";
import CardImageLayers from "../../component/cardImageLayers";
import {
  MonitoredCanvas,
  MonitoredComponentProfiler,
  PerformanceOverlay,
  useJsFpsMonitor,
} from "../monitor";
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_MAX_ANGLE,
  GRADIENT_TRANSLATE_FACTOR,
  MASK_TRANSLATE_FACTOR,
  MILLISECONDS_TO_SECONDS,
  ZERO_GRADIENT_POINTS,
  zeroShared,
} from "../../const/const";
import { GradientPoints } from "../../type/type";
import FullCanvasProps from "./canvas.type";
import { NoopOverlay, NoopWrapper } from "./canvas.noop";

const FullCanvasComponent: FC<PropsWithChildren<FullCanvasProps>> = (props) => {
  useJsFpsMonitor(props.perfMonitor);

  const CanvasComponent = props.perfMonitor ? MonitoredCanvas : Canvas;
  const ProfilerComponent = props.perfMonitor
    ? MonitoredComponentProfiler
    : NoopWrapper;
  const OverlayComponent = props.perfMonitor ? PerformanceOverlay : NoopOverlay;

  const maxAngle = props.maxAngle ?? DEFAULT_MAX_ANGLE;
  const borderRadius = props.borderRadius ?? DEFAULT_BORDER_RADIUS;

  const halfWidth = props.width * 0.5;
  const halfHeight = props.height * 0.5;
  const negativeWidth = -props.width;
  const negativeHeight = -props.height;
  const inverseMaxAngle = 1 / maxAngle;

  const needsGradient =
    props.showGloss || props.showHologram || props.showOutlineHolo;
  const needsMaskTransform = props.showHologram;
  const showOutlineHoloLayer = props.showOutlineHolo && needsGradient;
  const showHologramLayer =
    props.showHologram && !!props.hologramMaskSource && !!props.hologramMask;
  const showHoloBackgroundLayer = props.showHoloBackground && !!props.image;

  const gestureRotateX = props.motion?.gestureRotateX ?? zeroShared;
  const gestureRotateY = props.motion?.gestureRotateY ?? zeroShared;
  const sensorRotateX = props.motion?.sensorRotateX ?? zeroShared;
  const sensorRotateY = props.motion?.sensorRotateY ?? zeroShared;
  const sensorTranslateX = props.motion?.sensorTranslateX ?? zeroShared;
  const sensorTranslateY = props.motion?.sensorTranslateY ?? zeroShared;

  const clock = useClock();

  const time = useDerivedValue(() => {
    return clock.value * MILLISECONDS_TO_SECONDS;
  }, [clock]);

  const totalRotateX = useDerivedValue(
    () => gestureRotateX.value + sensorRotateX.value,
    [gestureRotateX, sensorRotateX],
  );

  const totalRotateY = useDerivedValue(
    () => gestureRotateY.value + sensorRotateY.value,
    [gestureRotateY, sensorRotateY],
  );

  const gradientPoints = useDerivedValue<GradientPoints>(() => {
    if (!needsGradient) {
      return {
        start: ZERO_GRADIENT_POINTS.start,
        end: { x: props.width, y: props.height },
      };
    }

    const rotateXNorm = totalRotateX.value * inverseMaxAngle;
    const rotateYNorm = totalRotateY.value * inverseMaxAngle;
    const tx = sensorTranslateX.value * GRADIENT_TRANSLATE_FACTOR;
    const ty = sensorTranslateY.value * GRADIENT_TRANSLATE_FACTOR;

    const centerX = halfWidth + halfWidth * rotateYNorm + tx;
    const centerY = halfHeight + halfHeight * rotateXNorm + ty;

    return {
      start: {
        x: negativeWidth + centerX,
        y: negativeHeight + centerY,
      },
      end: {
        x: props.width + centerX,
        y: props.height + centerY,
      },
    };
  }, [
    needsGradient,
    halfWidth,
    halfHeight,
    negativeWidth,
    negativeHeight,
    inverseMaxAngle,
    props.width,
    props.height,
    totalRotateX,
    totalRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  const maskTransform = useDerivedValue<Transforms3d>(() => {
    if (!needsMaskTransform) {
      return [{ translateX: 0 }, { translateY: 0 }];
    }

    return [
      { translateX: sensorTranslateX.value * MASK_TRANSLATE_FACTOR },
      { translateY: sensorTranslateY.value * MASK_TRANSLATE_FACTOR },
    ];
  }, [needsMaskTransform, sensorTranslateX, sensorTranslateY]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width: props.width,
        height: props.height,
        borderRadius,
      },
      props.style,
    ],
    [props.width, props.height, borderRadius, props.style],
  );

  const absoluteCanvasStyle = useMemo(
    () => [
      StyleSheet.absoluteFill,
      {
        width: props.width,
        height: props.height,
      },
      props.style,
    ],
    [props.width, props.height, props.style],
  );

  const canvasMonitorProps = useMemo(
    () =>
      props.perfMonitor
        ? { monitor: true as const, monitorId: "fullcanvas-main" }
        : undefined,
    [props.perfMonitor],
  );

  const shaderNode = useMemo(() => {
    if (!props.showShaderBack) {
      return null;
    }

    return (
      <Backgrdound
        width={props.width}
        height={props.height}
        borderRadius={borderRadius}
        time={time}
        shaderEffectRef={props.shaderEffectRef}
      />
    );
  }, [
    props.showShaderBack,
    props.width,
    props.height,
    borderRadius,
    time,
    props.shaderEffectRef,
  ]);

  const holoBackgroundNode = useMemo(() => {
    if (!showHoloBackgroundLayer || !props.image) {
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
  }, [
    showHoloBackgroundLayer,
    props.image,
    props.width,
    props.height,
    props.holoCover,
  ]);

  const cardImageLayersNode = useMemo(
    () => (
      <CardImageLayers
        width={props.width}
        height={props.height}
        holoColors={props.holoColors}
        showBackground={props.showBackground}
        showOutline={props.showOutline}
        showOutlineMask={props.showOutlineMask}
        showOutlineHolo={props.showOutlineHolo}
        showImage={props.showImage}
        showRGBSplit={props.showRGBSplit}
        showHoloMask={props.showHoloMask}
        background={props.background}
        image={props.image}
        holoCover={props.holoCover}
        gradientPoints={showOutlineHoloLayer ? gradientPoints : undefined}
      />
    ),
    [
      props.width,
      props.height,
      props.holoColors,
      props.showBackground,
      props.showOutline,
      props.showOutlineMask,
      props.showOutlineHolo,
      props.showImage,
      props.showRGBSplit,
      props.showHoloMask,
      props.background,
      props.image,
      props.holoCover,
      showOutlineHoloLayer,
      gradientPoints,
    ],
  );

  const hologramLayerNode = useMemo(() => {
    if (!showHologramLayer) {
      return null;
    }

    return (
      <HologramLayer
        width={props.width}
        height={props.height}
        holoColors={props.holoColors}
        borderRadius={borderRadius}
        hologramMask={props.hologramMask}
        maskTransform={maskTransform}
        gradientPoints={gradientPoints}
      />
    );
  }, [
    showHologramLayer,
    props.width,
    props.height,
    props.holoColors,
    borderRadius,
    props.hologramMask,
    maskTransform,
    gradientPoints,
  ]);

  const glossLayerNode = useMemo(() => {
    if (!props.showGloss) {
      return null;
    }

    return (
      <GlossLayer
        width={props.width}
        height={props.height}
        borderRadius={borderRadius}
        gradientPoints={gradientPoints}
      />
    );
  }, [
    props.showGloss,
    props.width,
    props.height,
    borderRadius,
    gradientPoints,
  ]);

  const overlayNode = useMemo(
    () => <OverlayComponent visible={props.perfMonitor} title="FullCanvas" />,
    [OverlayComponent, props.perfMonitor],
  );

  if (!props.shaderEffectRef.current) {
    return (
      <View style={containerStyle}>
        {props.children}
        {overlayNode}
      </View>
    );
  }

  return (
    <ProfilerComponent id="FullCanvas" monitor={props.perfMonitor}>
      <View style={containerStyle}>
        <CanvasComponent
          {...(canvasMonitorProps ?? {})}
          pointerEvents="none"
          style={absoluteCanvasStyle}
        >
          {shaderNode}
          {holoBackgroundNode}
          {cardImageLayersNode}
          {hologramLayerNode}
          {glossLayerNode}
        </CanvasComponent>
        {props.children}
        {overlayNode}
      </View>
    </ProfilerComponent>
  );
};

export const FullCanvas = memo(
  FullCanvasComponent,
  (prev, next) =>
    prev.perfMonitor === next.perfMonitor &&
    prev.showImage === next.showImage &&
    prev.showShaderBack === next.showShaderBack &&
    prev.showHologram === next.showHologram &&
    prev.showGloss === next.showGloss &&
    prev.showBackground === next.showBackground &&
    prev.showOutline === next.showOutline &&
    prev.showOutlineMask === next.showOutlineMask &&
    prev.showOutlineHolo === next.showOutlineHolo &&
    prev.showRGBSplit === next.showRGBSplit &&
    prev.showHoloMask === next.showHoloMask &&
    prev.showHoloBackground === next.showHoloBackground &&
    prev.maxAngle === next.maxAngle &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.style === next.style &&
    prev.hologramMaskSource === next.hologramMaskSource &&
    prev.shader === next.shader &&
    prev.holoColors === next.holoColors &&
    prev.motion === next.motion &&
    prev.borderRadius === next.borderRadius &&
    prev.source === next.source &&
    prev.background === next.background &&
    prev.image === next.image &&
    prev.holoCover === next.holoCover &&
    prev.hologramMask === next.hologramMask &&
    prev.shaderEffectRef === next.shaderEffectRef &&
    prev.children === next.children,
);

export default FullCanvas;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
});
