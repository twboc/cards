import React, { memo, useMemo } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { ZERO } from "../../const/const";
import GestureContainerProps from "./gesture.type";
import style, {
  useGestureContainerAnimatedStyles,
  useGestureContainerSizeStyle,
} from "./gesture.style";
import { useGestureContainerMotion } from "./gesture.motion";

const GestureContainerComponent = (props: GestureContainerProps) => {
  const gestureRotateX = useSharedValue(ZERO);
  const gestureRotateY = useSharedValue(ZERO);

  const sensorRotateX = useSharedValue(ZERO);
  const sensorRotateY = useSharedValue(ZERO);

  const sensorTranslateX = useSharedValue(ZERO);
  const sensorTranslateY = useSharedValue(ZERO);

  const { motion, gesture } = useGestureContainerMotion({
    props,
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  });

  const sizeStyle = useGestureContainerSizeStyle({
    width: props.width,
    height: props.height,
  });

  const { outerStyle, innerStyle } = useGestureContainerAnimatedStyles({
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  });

  const renderedChildren = useMemo(
    () =>
      typeof props.children === "function"
        ? props.children(motion)
        : props.children,
    [props.children, motion],
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style.outer, sizeStyle, outerStyle]}>
        <Animated.View style={[style.inner, innerStyle]}>
          {renderedChildren}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export const GestureContainer = memo(
  GestureContainerComponent,
  (prev, next) =>
    prev.width === next.width &&
    prev.height === next.height &&
    prev.maxAngle === next.maxAngle &&
    prev.sensorEnabled === next.sensorEnabled &&
    prev.sensorRotationFactor === next.sensorRotationFactor &&
    prev.sensorTranslationFactor === next.sensorTranslationFactor &&
    prev.onRotationChange === next.onRotationChange &&
    prev.children === next.children,
);

export default GestureContainer;
