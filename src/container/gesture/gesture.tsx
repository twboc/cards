import React, { memo, useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { SharedValue } from "react-native-reanimated";
import { useGestureContainerMotion } from "./gesture.hooks";

export interface GestureContainerMotion {
  gestureRotateX: SharedValue<number>;
  gestureRotateY: SharedValue<number>;
  sensorRotateX: SharedValue<number>;
  sensorRotateY: SharedValue<number>;
  sensorTranslateX: SharedValue<number>;
  sensorTranslateY: SharedValue<number>;
}

interface GestureContainerProps {
  children:
    | React.ReactNode
    | ((motion: GestureContainerMotion) => React.ReactNode);
  width: number;
  height: number;
  maxAngle?: number;
  onRotationChange?: (rx: number, ry: number) => void;
  sensorEnabled?: boolean;
  sensorRotationFactor?: number;
  sensorTranslationFactor?: number;
}

const GestureContainerComponent = (props: GestureContainerProps) => {
  const { motion, gesture, outerStaticStyle, outerStyle, innerStyle } =
    useGestureContainerMotion({
      width: props.width,
      height: props.height,
      maxAngle: props.maxAngle,
      onRotationChange: props.onRotationChange,
      sensorEnabled: props.sensorEnabled,
      sensorRotationFactor: props.sensorRotationFactor,
      sensorTranslationFactor: props.sensorTranslationFactor,
    });

  const renderedChildren = useMemo(() => {
    return typeof props.children === "function"
      ? props.children(motion)
      : props.children;
  }, [props.children, motion]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.outer, outerStaticStyle, outerStyle]}>
        <Animated.View style={[styles.inner, innerStyle]}>
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

const styles = StyleSheet.create({
  outer: {
    overflow: "visible",
  } as ViewStyle,
  inner: {
    width: "100%",
    height: "100%",
  } as ViewStyle,
});
