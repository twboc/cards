import React, { FC } from "react";
import {
  View,
  StyleSheet,
  Image as ImageRN,
  ImageSourcePropType,
} from "react-native";
import { GestureContainer } from "./gesture";
import { FullCanvas } from "./canvas";
import {
  BlendColor,
  Canvas,
  ColorMatrix,
  DataSourceParam,
  Group,
  Image,
  Mask,
  Paint,
  Rect,
  useAnimatedImageValue,
  useImage,
} from "@shopify/react-native-skia";
import backgroundSource from "../assets/background/background.png";

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
              {/* <Image
                image={background}
                width={props.width + 0}
                height={props.height}
                fit={"cover"}
              /> */}

              {props.showImage && (
                <Image
                  image={image}
                  width={props.width}
                  height={props.height}
                />
              )}
              {HOLO_MASK_FLAG && (
                <Mask
                  mode={"luminance"}
                  clip={false}
                  mask={
                    <Image
                      image={image}
                      x={0}
                      y={0}
                      width={props.width}
                      height={props.height}
                      fit="contain"
                    />
                  }
                >
                  <Image
                    image={holo_cover}
                    x={0}
                    y={0}
                    width={props.width}
                    height={props.height}
                    fit="cover"
                  />
                </Mask>
              )}
              {HOLO_BACKGROUND_FLAG && (
                <Mask
                  mode="luminance"
                  clip={false}
                  mask={
                    <>
                      {/* full visible area */}
                      <Rect
                        x={0}
                        y={0}
                        width={props.width}
                        height={props.height}
                        color="white"
                      />

                      {/* cut the image shape out of the mask */}
                      <Group layer={<Paint blendMode="dstOut" />}>
                        <Image
                          image={image}
                          x={0}
                          y={0}
                          width={props.width}
                          height={props.height}
                          fit="contain"
                        />
                      </Group>
                    </>
                  }
                >
                  <Image
                    image={holo_cover}
                    x={0}
                    y={0}
                    width={props.width}
                    height={props.height}
                    fit={"fill"}
                  />
                </Mask>
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
