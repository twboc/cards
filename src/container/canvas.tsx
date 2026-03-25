import { PropsWithChildren, useMemo } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Canvas,
  DataSourceParam,
  SkImage,
  SkRuntimeEffect,
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

interface FullCanvasProps {
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
  isActive?: boolean;
  borderRadius?: number;
  source: DataSourceParam;

  background: SkImage | null;
  image: SkImage | null;
  holoCover: SharedValue<SkImage | null>;
  hologramMask: SkImage | null;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
}

const zeroShared = {
  value: 0,
} as SharedValue<number>;

export const FullCanvas = (props: PropsWithChildren<FullCanvasProps>) => {
  const isActive = props.isActive ?? true;
  const maxAngle = props.maxAngle ?? 15;
  const borderRadius = props.borderRadius ?? 12;
  const style = props.style;

  const gestureRotateX = props.motion?.gestureRotateX ?? zeroShared;
  const gestureRotateY = props.motion?.gestureRotateY ?? zeroShared;
  const sensorRotateX = props.motion?.sensorRotateX ?? zeroShared;
  const sensorRotateY = props.motion?.sensorRotateY ?? zeroShared;
  const sensorTranslateX = props.motion?.sensorTranslateX ?? zeroShared;
  const sensorTranslateY = props.motion?.sensorTranslateY ?? zeroShared;

  const clock = useClock();

  const time = useDerivedValue(() => {
    return isActive ? clock.value / 1000 : 0;
  }, [clock, isActive]);

  const totalRotateX = useDerivedValue(
    () => gestureRotateX.value + sensorRotateX.value,
    [gestureRotateX, sensorRotateX],
  );

  const totalRotateY = useDerivedValue(
    () => gestureRotateY.value + sensorRotateY.value,
    [gestureRotateY, sensorRotateY],
  );

  const gradientPoints = useDerivedValue(() => {
    const halfWidth = props.width * 0.5;
    const halfHeight = props.height * 0.5;
    const rotateXNorm = totalRotateX.value / maxAngle;
    const rotateYNorm = totalRotateY.value / maxAngle;
    const tx = sensorTranslateX.value * 0.35;
    const ty = sensorTranslateY.value * 0.35;

    const centerX = halfWidth + halfWidth * rotateYNorm + tx;
    const centerY = halfHeight + halfHeight * rotateXNorm + ty;

    return {
      start: {
        x: -props.width + centerX,
        y: -props.height + centerY,
      },
      end: {
        x: props.width + centerX,
        y: props.height + centerY,
      },
    };
  }, [
    props.width,
    props.height,
    maxAngle,
    totalRotateX,
    totalRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  const maskTransform = useDerivedValue(
    () => [
      { translateX: sensorTranslateX.value * 0.2 },
      { translateY: sensorTranslateY.value * 0.2 },
    ],
    [sensorTranslateX, sensorTranslateY],
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width: props.width,
        height: props.height,
        borderRadius,
      },
      style,
    ],
    [props.width, props.height, borderRadius, style],
  );

  const absoluteCanvasStyle = useMemo(
    () => [
      StyleSheet.absoluteFill,
      {
        width: props.width,
        height: props.height,
      },
      style,
    ],
    [props.width, props.height, style],
  );

  const childrenLayerStyle = useMemo(
    () => [
      StyleSheet.absoluteFillObject,
      styles.childrenLayer,
      {
        width: props.width,
        height: props.height,
        borderRadius,
      },
    ],
    [props.width, props.height, borderRadius],
  );

  if (!props.shaderEffectRef.current) {
    return <View style={containerStyle}>{props.children}</View>;
  }

  if (!isActive) {
    return (
      <View style={containerStyle}>
        <View style={childrenLayerStyle}>{props.children}</View>
      </View>
    );
  }

  return (
    <>
      <Canvas pointerEvents="none" style={absoluteCanvasStyle}>
        {props.showShaderBack && (
          <BackgrdoundShader
            width={props.width}
            height={props.height}
            borderRadius={borderRadius}
            time={time}
            shaderEffectRef={props.shaderEffectRef}
          />
        )}
      </Canvas>

      <Canvas pointerEvents="none" style={absoluteCanvasStyle}>
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
          gradientPoints={gradientPoints}
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
      </Canvas>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  clippedLayer: {
    overflow: "hidden",
    zIndex: 0,
  },
  childrenLayer: {
    overflow: "hidden",
    zIndex: 10,
  },
});
