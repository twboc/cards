import React, { FC, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { GestureContainer } from "./gesture";
import { FullCanvas } from "./canvas";
import {
  DataSourceParam,
  Skia,
  useAnimatedImageValue,
  useImage,
} from "@shopify/react-native-skia";
import { HoloColorPalette } from "../data/data";
import backgroundSource from "../assets/background/background.png";
import HoloColver02 from "../assets/effect/holo_cover_02.gif";

interface CardProps {
  perfMonitor: boolean;

  showShaderBack: boolean;
  showImage: boolean;
  showHologram: boolean;
  showGloss: boolean;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showOutlineHolo: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;

  source: DataSourceParam;
  hologram: React.RefObject<number>;
  shader: React.RefObject<string>;
  holoColors: React.RefObject<HoloColorPalette>;
  screen_width: number;
  width: number;
  height: number;
  max_angle: number;
}

const Card: FC<CardProps> = (props) => {
  const background = useImage(backgroundSource);
  const image = useImage(props.source);
  const holoCover = useAnimatedImageValue(HoloColver02);
  const hologramMask = useImage(props.hologram.current);
  const shaderEffectRef = useRef(Skia.RuntimeEffect.Make(props.shader.current));
  return (
    <View
      style={[
        styles.centeredView,
        {
          width: props.screen_width,
          height: props.height,
        },
      ]}
    >
      <GestureContainer
        width={props.width}
        height={props.height}
        maxAngle={props.max_angle}
      >
        {(motion) => (
          <FullCanvas
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
        )}
      </GestureContainer>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  centeredView: {
    paddingTop: 30,
    alignItems: "center",
  },
  canvas: { flex: 1 },
});
