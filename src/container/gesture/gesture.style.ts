import { useMemo } from "react";
import { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { PERSPECTIVE } from "../../const/const";

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
      params.gestureRotateX.value + params.sensorRotateX.value;
    const totalRotateY =
      params.gestureRotateY.value + params.sensorRotateY.value;

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
