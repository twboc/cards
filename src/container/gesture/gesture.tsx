import React, { memo, useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";

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
  isActive?: boolean;
}

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

const timingConfig = { duration: 100 };

const GestureContainerComponent = ({
  children,
  width,
  height,
  maxAngle = 10,
  onRotationChange,
  sensorEnabled = true,
  sensorRotationFactor = 12,
  sensorTranslationFactor = 28,
  isActive = true,
}: GestureContainerProps) => {
  const gestureRotateX = useSharedValue(0);
  const gestureRotateY = useSharedValue(0);

  const sensorRotateX = useSharedValue(0);
  const sensorRotateY = useSharedValue(0);

  const sensorTranslateX = useSharedValue(0);
  const sensorTranslateY = useSharedValue(0);

  const activeShared = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    activeShared.value = isActive ? 1 : 0;
  }, [activeShared, isActive]);

  const motion = useMemo<GestureContainerMotion>(
    () => ({
      gestureRotateX,
      gestureRotateY,
      sensorRotateX,
      sensorRotateY,
      sensorTranslateX,
      sensorTranslateY,
    }),
    [
      gestureRotateX,
      gestureRotateY,
      sensorRotateX,
      sensorRotateY,
      sensorTranslateX,
      sensorTranslateY,
    ],
  );

  const interpolateRotation = useCallback(
    (value: number, size: number, isReverse = false) => {
      "worklet";
      return interpolate(
        value,
        [0, size],
        isReverse ? [maxAngle, -maxAngle] : [-maxAngle, maxAngle],
        Extrapolation.CLAMP,
      );
    },
    [maxAngle],
  );

  const resetMotion = useCallback(() => {
    gestureRotateX.value = withTiming(0, timingConfig);
    gestureRotateY.value = withTiming(0, timingConfig);
    sensorRotateX.value = withTiming(0, timingConfig);
    sensorRotateY.value = withTiming(0, timingConfig);
    sensorTranslateX.value = withTiming(0, timingConfig);
    sensorTranslateY.value = withTiming(0, timingConfig);
  }, [
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  useEffect(() => {
    if (!isActive || !sensorEnabled) {
      resetMotion();
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, 40);

    const subscription = accelerometer.subscribe(({ x, y }) => {
      const nextRotateY = clamp(x * sensorRotationFactor, -maxAngle, maxAngle);
      const nextRotateX = clamp(-y * sensorRotationFactor, -maxAngle, maxAngle);

      const nextTranslateX = clamp(
        x * sensorTranslationFactor,
        -sensorTranslationFactor,
        sensorTranslationFactor,
      );

      const nextTranslateY = clamp(
        y * sensorTranslationFactor,
        -sensorTranslationFactor,
        sensorTranslationFactor,
      );

      sensorRotateX.value = withTiming(nextRotateX, timingConfig);
      sensorRotateY.value = withTiming(nextRotateY, timingConfig);
      sensorTranslateX.value = withTiming(nextTranslateX, timingConfig);
      sensorTranslateY.value = withTiming(nextTranslateY, timingConfig);
    });

    return () => {
      subscription.unsubscribe();
      resetMotion();
    };
  }, [
    isActive,
    maxAngle,
    resetMotion,
    sensorEnabled,
    sensorRotationFactor,
    sensorTranslationFactor,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  useAnimatedReaction(
    () => ({ x: gestureRotateX.value, y: gestureRotateY.value }),
    (current, previous) => {
      if (current !== previous && onRotationChange) {
        onRotationChange(current.x, current.y);
      }
    },
  );
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(isActive)
        .onBegin((event) => {
          gestureRotateX.value = withTiming(
            interpolateRotation(event.y, height, true),
            timingConfig,
          );
          gestureRotateY.value = withTiming(
            interpolateRotation(event.x, width),
            timingConfig,
          );
        })
        .onUpdate((event) => {
          gestureRotateX.value = interpolateRotation(event.y, height, true);
          gestureRotateY.value = interpolateRotation(event.x, width);
        })
        .onFinalize(() => {
          gestureRotateX.value = withTiming(0, timingConfig);
          gestureRotateY.value = withTiming(0, timingConfig);
        }),
    [
      isActive,
      gestureRotateX,
      gestureRotateY,
      height,
      width,
      interpolateRotation,
    ],
  );

  const outerStyle = useAnimatedStyle(() => {
    if (!activeShared.value) {
      return styles.identityTransform;
    }

    const totalRotateX = gestureRotateX.value + sensorRotateX.value;
    const totalRotateY = gestureRotateY.value + sensorRotateY.value;

    return {
      transform: [
        { perspective: 700 },
        { rotateX: `${totalRotateX}deg` },
        { rotateY: `${totalRotateY}deg` },
      ],
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    if (!activeShared.value) {
      return styles.identityTransform;
    }

    return {
      transform: [
        { translateX: sensorTranslateX.value },
        { translateY: sensorTranslateY.value },
      ],
    };
  });

  const renderedChildren = useMemo(
    () => (typeof children === "function" ? children(motion) : children),
    [children, motion],
  );

  if (!isActive) {
    return (
      <Animated.View style={[styles.outer, { width, height }]}>
        <Animated.View style={styles.inner}>{renderedChildren}</Animated.View>
      </Animated.View>
    );
  }

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.outer, { width, height }, outerStyle]}>
          <Animated.View style={[styles.inner, innerStyle]}>
            {renderedChildren}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
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
    prev.isActive === next.isActive &&
    prev.children === next.children,
);

const styles = StyleSheet.create({
  outer: {
    overflow: "visible",
  } as ViewStyle,
  inner: {
    width: "100%",
    height: "100%",
  } as ViewStyle,
  identityTransform: {
    transform: [{ perspective: 700 }, { rotateX: "0deg" }, { rotateY: "0deg" }],
  } as ViewStyle,
});
