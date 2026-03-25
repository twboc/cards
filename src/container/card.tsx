import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { GestureContainer } from "./gesture";
import { FullCanvas } from "./canvas";
import { DataSourceParam } from "@shopify/react-native-skia";

interface CardProps {
  showShaderBack: boolean;
  showImage: boolean;
  showHologram: boolean;
  showGloss: boolean;

  showBackground: boolean;
  showOutline: boolean;
  showOutlineMask: boolean;
  showRGBSplit: boolean;
  showHoloMask: boolean;
  showHoloBackground: boolean;

  source: DataSourceParam;
  hologram: React.RefObject<number>;
  shader: React.RefObject<string>;
  screen_width: number;
  width: number;
  height: number;
  max_angle: number;
}

const Card: FC<CardProps> = (props) => {
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
            showShaderBack={props.showShaderBack}
            showHologram={props.showHologram}
            showGloss={props.showGloss}
            showBackground={props.showBackground}
            showOutline={props.showOutline}
            showOutlineMask={props.showOutlineMask}
            showRGBSplit={props.showRGBSplit}
            showHoloMask={props.showHoloMask}
            showHoloBackground={props.showHoloBackground}
            width={props.width}
            height={props.height}
            maxAngle={props.max_angle}
            motion={motion}
            hologramMaskSource={props.hologram.current}
            shader={props.shader}
            source={props.source}
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
