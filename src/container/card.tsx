import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { GestureContainer } from "./gesture";
import { FullCanvas } from "./canvas";
import {
  Canvas,
  DataSourceParam,
  Image,
  useAnimatedImageValue,
  useImage,
} from "@shopify/react-native-skia";
import backgroundSource from "../assets/background/background.png";
import RGBSplit from "./rgbsplit";
import ImageMask from "./imagemask";
import ImageMaskReverse from "./imagemaskreverse";
import { Outline } from "./outline";
interface CardProps {
  showShaderBack: boolean;
  showImage: boolean;
  showHologram: boolean;
  showGloss: boolean;
  source: DataSourceParam;
  hologram: React.RefObject<number>;
  shader: React.RefObject<string>;
  screen_width: number;
  width: number;
  height: number;
  max_angle: number;
}

const BACKGROUND_FLAG = false;
const OUTLINE_FLAG = true;
const RGB_SPLIT_FLAG = false;
const HOLO_MASK_FLAG = false;
const HOLO_BACKGROUND_FLAG = false;

const Card: FC<CardProps> = (props) => {
  const background = useImage(backgroundSource);
  const image = useImage(props.source);
  const holo_cover = useAnimatedImageValue(
    require("../assets/effect/holo_cover_02.gif"),
  );
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
            <Canvas style={styles.canvas}>
              {BACKGROUND_FLAG && (
                <Image
                  image={background}
                  width={props.width + 0}
                  height={props.height}
                  fit={"cover"}
                />
              )}

              {OUTLINE_FLAG && (
                <Outline
                  image={image}
                  width={props.width}
                  height={props.height}
                />
              )}

              <ImageMask
                image={holo_cover}
                mask={
                  <Outline
                    image={image}
                    width={props.width}
                    height={props.height}
                  />
                }
                width={props.width}
                height={props.height}
                mode={"luminance"}
              />

              {props.showImage && (
                <Image
                  image={image}
                  width={props.width}
                  height={props.height}
                />
              )}

              {RGB_SPLIT_FLAG && (
                <RGBSplit
                  image={image}
                  width={props.width}
                  height={props.height}
                />
              )}
              {HOLO_MASK_FLAG && (
                <ImageMask
                  image={holo_cover}
                  mask={image}
                  width={props.width}
                  height={props.height}
                  mode={"luminance"}
                />
              )}
              {HOLO_BACKGROUND_FLAG && (
                <ImageMaskReverse
                  image={image}
                  mask={holo_cover}
                  width={props.width}
                  height={props.height}
                />
              )}
            </Canvas>
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
  canvas: { flex: 1 },
});
