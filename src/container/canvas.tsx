import { PropsWithChildren, useMemo, useRef } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Canvas,
  DataSourceParam,
  Skia,
  useAnimatedImageValue,
  useClock,
  useImage,
} from "@shopify/react-native-skia";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GestureContainerMotion } from "./gesture";
import { BackgrdoundShader } from "./backgroundShader";

import backgroundSource from "../assets/background/background.png";
import ImageMaskReverse from "./imagemaskreverse";
import HoloColver02 from "../assets/effect/holo_cover_02.gif";
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
}

const zeroShared = {
  value: 0,
} as SharedValue<number>;

export const FullCanvas = (props: PropsWithChildren<FullCanvasProps>) => {
  const isActive = props.isActive ?? true;
  const maxAngle = props.maxAngle ?? 15;
  const borderRadius = props.borderRadius ?? 12;
  const style = props.style;

  const background = useImage(backgroundSource);
  const image = useImage(props.source);
  const holo_cover = useAnimatedImageValue(HoloColver02);
  const hologramMask = useImage(props.hologramMaskSource);
  const shaderEffectRef = useRef(Skia.RuntimeEffect.Make(props.shader.current));

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

  const gradientStart = useDerivedValue(() => ({
    x:
      -props.width +
      (props.width / 2 + (props.width / 2) * (totalRotateY.value / maxAngle)) +
      sensorTranslateX.value * 0.35,
    y:
      -props.height +
      (props.height / 2 +
        (props.height / 2) * (totalRotateX.value / maxAngle)) +
      sensorTranslateY.value * 0.35,
  }));

  const gradientEnd = useDerivedValue(() => ({
    x:
      props.width +
      (props.width / 2 + (props.width / 2) * (totalRotateY.value / maxAngle)) +
      sensorTranslateX.value * 0.35,
    y:
      props.height +
      (props.height / 2 +
        (props.height / 2) * (totalRotateX.value / maxAngle)) +
      sensorTranslateY.value * 0.35,
  }));

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

  if (!shaderEffectRef.current) {
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
            shaderEffectRef={shaderEffectRef}
          />
        )}
      </Canvas>

      <Canvas pointerEvents="none" style={absoluteCanvasStyle}>
        {props.showHoloBackground && image && (
          <ImageMaskReverse
            image={holo_cover}
            mask={image}
            width={props.width}
            height={props.height}
          />
        )}

        <CardImageLayers
          width={props.width}
          height={props.height}
          background={background}
          image={image}
          holoCover={holo_cover}
          holoColors={props.holoColors}
          showBackground={props.showBackground}
          showOutline={props.showOutline}
          showOutlineMask={props.showOutlineMask}
          showOutlineHolo={props.showOutlineHolo}
          showImage={props.showImage}
          showRGBSplit={props.showRGBSplit}
          showHoloMask={props.showHoloMask}
          gradientStart={gradientStart}
          gradientEnd={gradientEnd}
        />

        {props.showHologram && props.hologramMaskSource && (
          <HologramLayer
            width={props.width}
            height={props.height}
            holoColors={props.holoColors}
            borderRadius={borderRadius}
            hologramMask={hologramMask}
            maskTransform={maskTransform}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
          />
        )}

        {props.showGloss && (
          <GlossLayer
            width={props.width}
            height={props.height}
            borderRadius={borderRadius}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
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
