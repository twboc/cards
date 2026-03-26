import React, { FC, memo, useCallback } from "react";
import { View } from "react-native";
import { useAnimatedImageValue, useImage } from "@shopify/react-native-skia";
import backgroundSource from "../../assets/background/background.png";
import HoloColver02 from "../../assets/effect/holo_cover_02.gif";
import { useCardMemoValues } from "./card.hooks";
import { CardCanvasContent } from "./card.canvasContent";
import { GestureContainer } from "../gesture/gesture";
import { CardProps } from "./card.type";
import { GestureContainerMotion } from "../gesture/gesture.type";

const CardComponent: FC<CardProps> = (props) => {
  const background = useImage(backgroundSource);
  const image = useImage(props.source);
  const holoCover = useAnimatedImageValue(HoloColver02);
  const hologramMask = useImage(props.hologram.current);

  const { shaderEffectRef, containerStyle } = useCardMemoValues({
    shaderSource: props.shader.current,
    screenWidth: props.screen_width,
    height: props.height,
  });

  const renderCanvas = useCallback(
    (motion: GestureContainerMotion) => {
      return (
        <CardCanvasContent
          perfMonitor={props.perfMonitor}
          showImage={props.showImage}
          showShaderBack={props.showShaderBack}
          showHologram={props.showHologram}
          showGloss={props.showGloss}
          showBackground={props.showBackground}
          showOutline={props.showOutline}
          showOutlineMask={props.showOutlineMask}
          showOutlineHolo={props.showOutlineHolo}
          showRGBSplit={props.showRGBSplit}
          showHoloMask={props.showHoloMask}
          showHoloBackground={props.showHoloBackground}
          width={props.width}
          height={props.height}
          maxAngle={props.max_angle}
          motion={motion}
          hologramMaskSource={props.hologram.current}
          shader={props.shader}
          holoColors={props.holoColors}
          source={props.source}
          background={background}
          image={image}
          holoCover={holoCover}
          hologramMask={hologramMask}
          shaderEffectRef={shaderEffectRef}
        />
      );
    },
    [
      props.perfMonitor,
      props.showImage,
      props.showShaderBack,
      props.showHologram,
      props.showGloss,
      props.showBackground,
      props.showOutline,
      props.showOutlineMask,
      props.showOutlineHolo,
      props.showRGBSplit,
      props.showHoloMask,
      props.showHoloBackground,
      props.width,
      props.height,
      props.max_angle,
      props.hologram.current,
      props.shader,
      props.holoColors,
      props.source,
      background,
      image,
      holoCover,
      hologramMask,
      shaderEffectRef,
    ],
  );

  return (
    <View style={containerStyle}>
      <GestureContainer
        width={props.width}
        height={props.height}
        maxAngle={props.max_angle}
      >
        {renderCanvas}
      </GestureContainer>
    </View>
  );
};

export const Card = memo(CardComponent);
export default Card;
