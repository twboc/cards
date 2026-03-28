import { useMemo } from "react";
import { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import {
  PERSPECTIVE,
  TRANSFORM_OVERRIDE_X,
  TRANSFORM_OVERRIDE_Y,
} from "../../const/const";
import { StyleSheet, ViewStyle } from "react-native";

export const useGestureContainerSizeStyle = (params: {
  width: number;
  height: number;
}) => {
  return useMemo(
    () => ({
      width: params.width,
      height: params.height,
    }),
    [params.width, params.height],
  );
};

export const useGestureContainerAnimatedStyles = (params: {
  gestureRotateX: SharedValue<number>;
  gestureRotateY: SharedValue<number>;
  sensorRotateX: SharedValue<number>;
  sensorRotateY: SharedValue<number>;
  sensorTranslateX: SharedValue<number>;
  sensorTranslateY: SharedValue<number>;
}) => {
  const outerStyle = useAnimatedStyle(() => {
    const totalRotateX =
      params.gestureRotateX.value +
      params.sensorRotateX.value +
      TRANSFORM_OVERRIDE_X;
    const totalRotateY =
      params.gestureRotateY.value +
      params.sensorRotateY.value +
      TRANSFORM_OVERRIDE_Y;

    return {
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${totalRotateX}deg` },
        { rotateY: `${totalRotateY}deg` },
      ],
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: params.sensorTranslateX.value },
        { translateY: params.sensorTranslateY.value },
      ],
    };
  });

  return {
    outerStyle,
    innerStyle,
  };
};

const style = StyleSheet.create({
  outer: {
    overflow: "visible",
  } as ViewStyle,
  inner: {
    width: "100%",
    height: "100%",
  } as ViewStyle,
  identityTransform: {
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: "0deg" },
      { rotateY: "0deg" },
    ],
  } as ViewStyle,
});

export default style;
