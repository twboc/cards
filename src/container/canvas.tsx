import React, { PropsWithChildren, useMemo } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Canvas,
  DataSourceParam,
  SkImage,
  SkRuntimeEffect,
  Transforms3d,
  useClock,
} from "@shopify/react-native-skia";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GestureContainerMotion } from "./gesture";
import { BackgrdoundShader } from "./backgroundShader";

import ImageMaskReverse from "./imagemaskreverse";
import HologramLayer from "../component/hologramLayer";
import GlossLayer from "../component/glossLayer";
import CardImageLayers from "../component/cardImageLayers";
import { HoloColorPalette } from "../data/data";
import {
  MonitoredCanvas,
  MonitoredComponentProfiler,
  PerformanceOverlay,
  useJsFpsMonitor,
} from "./monitor";

interface FullCanvasProps {
  perfMonitor: boolean;

  showImage: boolean;
  showShaderBack: boolean;
  showHologram: boolean;
  showGloss: boolean;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;

  maxAngle?: number;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  hologramMaskSource?: DataSourceParam;
  shader: React.RefObject<string>;
  holoColors: React.RefObject<HoloColorPalette>;
  motion?: GestureContainerMotion;
  borderRadius?: number;
  source: DataSourceParam;

  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  hologramMask: SkImage | null;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
}

type GradientPoints = {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};

const zeroShared = {
  value: 0,
} as SharedValue<number>;

const GRADIENT_TRANSLATE_FACTOR = 0.35;
const MASK_TRANSLATE_FACTOR = 0.2;
const MILLISECONDS_TO_SECONDS = 0.001;

function NoopWrapper(
  props: PropsWithChildren<{ id?: string; monitor?: boolean }>,
) {
  return <>{props.children}</>;
}

function NoopOverlay() {
  return null;
}

export const FullCanvas = (props: PropsWithChildren<FullCanvasProps>) => {
  useJsFpsMonitor(props.perfMonitor);

  const CanvasComponent = props.perfMonitor ? MonitoredCanvas : Canvas;
  const ProfilerComponent = props.perfMonitor
    ? MonitoredComponentProfiler
    : NoopWrapper;
  const OverlayComponent = props.perfMonitor ? PerformanceOverlay : NoopOverlay;

  const maxAngle = props.maxAngle ?? 15;
  const borderRadius = props.borderRadius ?? 12;

  const halfWidth = props.width * 0.5;
  const halfHeight = props.height * 0.5;
  const negativeWidth = -props.width;
  const negativeHeight = -props.height;
  const inverseMaxAngle = 1 / maxAngle;

  const needsGradient =
    props.showGloss || props.showHologram || props.showOutlineHolo;

  const needsMaskTransform = props.showHologram;

  const motion = props.motion;

  const gestureRotateX = motion?.gestureRotateX ?? zeroShared;
  const gestureRotateY = motion?.gestureRotateY ?? zeroShared;
  const sensorRotateX = motion?.sensorRotateX ?? zeroShared;
  const sensorRotateY = motion?.sensorRotateY ?? zeroShared;
  const sensorTranslateX = motion?.sensorTranslateX ?? zeroShared;
  const sensorTranslateY = motion?.sensorTranslateY ?? zeroShared;

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
        start: { x: 0, y: 0 },
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

  if (!props.shaderEffectRef.current) {
    return (
      <View style={absoluteCanvasStyle}>
        {props.children}
        <OverlayComponent visible={props.perfMonitor} title="FullCanvas" />
      </View>
    );
  }

  return (
    <ProfilerComponent id="FullCanvas" monitor={props.perfMonitor}>
      <View style={absoluteCanvasStyle}>
        <CanvasComponent
          {...(props.perfMonitor
            ? { monitor: true, monitorId: "fullcanvas-main" }
            : {})}
          pointerEvents="none"
          style={absoluteCanvasStyle}
        >
          {props.showShaderBack && (
            <BackgrdoundShader
              width={props.width}
              height={props.height}
              borderRadius={borderRadius}
              time={time}
              shaderEffectRef={props.shaderEffectRef}
            />
          )}

          {props.showHoloBackground && props.image && (
            <ImageMaskReverse
              width={props.width}
              height={props.height}
              image={props.holoCover}
              mask={props.image}
            />
          )}

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
            gradientPoints={props.showOutlineHolo ? gradientPoints : undefined}
          />

          {props.showHologram && props.hologramMaskSource && (
            <HologramLayer
              width={props.width}
              height={props.height}
              holoColors={props.holoColors}
              borderRadius={borderRadius}
              hologramMask={props.hologramMask}
              maskTransform={maskTransform}
              gradientPoints={gradientPoints}
            />
          )}

          {props.showGloss && (
            <GlossLayer
              width={props.width}
              height={props.height}
              borderRadius={borderRadius}
              gradientPoints={gradientPoints}
            />
          )}
        </CanvasComponent>

        <OverlayComponent visible={props.perfMonitor} title="FullCanvas" />
      </View>
    </ProfilerComponent>
  );
};
