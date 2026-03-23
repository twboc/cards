import React, { FC } from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { GestureContainer } from "./gesture";
import { FullCanvas } from "./canvas";

interface CardProps {
  showShaderBack: boolean;
  showImage: boolean;
  showHologram: boolean;
  showGloss: boolean;
  source: ImageSourcePropType;
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
            width={props.width}
            height={props.height}
            maxAngle={props.max_angle}
            motion={motion}
            hologramMaskSource={props.hologram.current}
            shader={props.shader}
          >
            {props.showImage && (
              <>
                <Image
                  source={props.source}
                  style={{
                    width: props.width,
                    height: props.height,
                    resizeMode: "contain",
                  }}
                />
              </>
            )}
          </FullCanvas>
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
});
