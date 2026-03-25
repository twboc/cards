import React, { FC, memo } from "react";
import { Canvas, useClock } from "@shopify/react-native-skia";
import { View } from "react-native";
import {
  MonitoredCanvas,
  MonitoredComponentProfiler,
  useJsFpsMonitor,
} from "../monitor";
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_MAX_ANGLE,
  zeroShared,
} from "../../const/const";
import FullCanvasProps from "./canvas.type";
import { NoopOverlay, NoopWrapper } from "./canvas.noop";
import {
  CardImageRenderLayer,
  GlossRenderLayer,
  HoloBackgroundLayer,
  HologramRenderLayer,
  PerfOverlayLayer,
  ShaderLayer,
} from "./canvas.layers";
import {
  useFullCanvasDerivedValues,
  useFullCanvasMemoValues,
} from "./canvas.hooks";

const FullCanvasComponent: FC<FullCanvasProps> = (props) => {
  useJsFpsMonitor(props.perfMonitor);

  const CanvasComponent = props.perfMonitor ? MonitoredCanvas : Canvas;
  const ProfilerComponent = props.perfMonitor
    ? MonitoredComponentProfiler
    : NoopWrapper;
  const OverlayComponent = props.perfMonitor ? PerfOverlayLayer : NoopOverlay;

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

  const { time, gradientPoints, maskTransform } = useFullCanvasDerivedValues({
    clock,
    width: props.width,
    height: props.height,
    borderRadius,
    inverseMaxAngle,
    halfWidth,
    halfHeight,
    negativeWidth,
    negativeHeight,
    needsGradient,
    needsMaskTransform,
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
    perfMonitor: props.perfMonitor,
    style: props.style,
  });

  const { containerStyle, absoluteCanvasStyle, canvasMonitorProps } =
    useFullCanvasMemoValues({
      width: props.width,
      height: props.height,
      borderRadius,
      style: props.style,
      perfMonitor: props.perfMonitor,
    });

  if (!props.shaderEffectRef.current) {
    return (
      <View style={containerStyle}>
        <OverlayComponent visible={props.perfMonitor} title="Card Canvas" />
      </View>
    );
  }

  return (
    <ProfilerComponent id="CardCanvas" monitor={props.perfMonitor}>
      <View style={containerStyle}>
        <CanvasComponent
          {...(canvasMonitorProps ?? {})}
          pointerEvents="none"
          style={absoluteCanvasStyle}
        >
          <ShaderLayer
            visible={props.showShaderBack}
            width={props.width}
            height={props.height}
            borderRadius={borderRadius}
            time={time}
            shaderEffectRef={props.shaderEffectRef}
          />
          <HoloBackgroundLayer
            visible={showHoloBackgroundLayer}
            width={props.width}
            height={props.height}
            image={props.image}
            holoCover={props.holoCover}
          />
          <CardImageRenderLayer
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
          <HologramRenderLayer
            visible={showHologramLayer}
            width={props.width}
            height={props.height}
            holoColors={props.holoColors}
            borderRadius={borderRadius}
            hologramMask={props.hologramMask}
            maskTransform={maskTransform}
            gradientPoints={gradientPoints}
          />
          <GlossRenderLayer
            visible={props.showGloss}
            width={props.width}
            height={props.height}
            borderRadius={borderRadius}
            gradientPoints={gradientPoints}
          />
        </CanvasComponent>
        <OverlayComponent visible={props.perfMonitor} title="Card Canvas" />
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
    prev.shaderEffectRef === next.shaderEffectRef,
);

export default FullCanvas;
