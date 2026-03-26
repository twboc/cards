import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
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
import {
  PERSPECTIVE,
  ROTATION_EPSILON,
  SENSOR_INTERVAL_MS,
  TIMING_CONFIG,
  ZERO,
} from "../../const/const";
import { scheduleOnUI } from "react-native-worklets";
import GestureContainerProps, { GestureContainerMotion } from "./gesture.type";

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

const GestureContainerComponent = (props: GestureContainerProps) => {
  const gestureRotateX = useSharedValue(ZERO);
  const gestureRotateY = useSharedValue(ZERO);

  const sensorRotateX = useSharedValue(ZERO);
  const sensorRotateY = useSharedValue(ZERO);

  const sensorTranslateX = useSharedValue(ZERO);
  const sensorTranslateY = useSharedValue(ZERO);

  const onRotationChangeRef = useRef<GestureContainerProps["onRotationChange"]>(
    props.onRotationChange,
  );

  useEffect(() => {
    onRotationChangeRef.current = props.onRotationChange;
  }, [props.onRotationChange]);

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
        [ZERO, size],
        isReverse
          ? [props.maxAngle ?? 10, -(props.maxAngle ?? 10)]
          : [-(props.maxAngle ?? 10), props.maxAngle ?? 10],
        Extrapolation.CLAMP,
      );
    },
    [props.maxAngle],
  );

  const resetMotion = useCallback(() => {
    gestureRotateX.value = withTiming(ZERO, TIMING_CONFIG);
    gestureRotateY.value = withTiming(ZERO, TIMING_CONFIG);
    sensorRotateX.value = withTiming(ZERO, TIMING_CONFIG);
    sensorRotateY.value = withTiming(ZERO, TIMING_CONFIG);
    sensorTranslateX.value = withTiming(ZERO, TIMING_CONFIG);
    sensorTranslateY.value = withTiming(ZERO, TIMING_CONFIG);
  }, [
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  useEffect(() => {
    if (!props.sensorEnabled) {
      resetMotion();
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);

    const subscription = accelerometer.subscribe(({ x, y }) => {
      const maxAngle = props.maxAngle ?? 10;
      const sensorRotationFactor = props.sensorRotationFactor ?? 12;
      const sensorTranslationFactor = props.sensorTranslationFactor ?? 28;

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

      sensorRotateX.value = withTiming(nextRotateX, TIMING_CONFIG);
      sensorRotateY.value = withTiming(nextRotateY, TIMING_CONFIG);
      sensorTranslateX.value = withTiming(nextTranslateX, TIMING_CONFIG);
      sensorTranslateY.value = withTiming(nextTranslateY, TIMING_CONFIG);
    });

    return () => {
      subscription.unsubscribe();
      resetMotion();
    };
  }, [
    props.maxAngle,
    props.sensorEnabled,
    props.sensorRotationFactor,
    props.sensorTranslationFactor,
    resetMotion,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  const notifyRotationChange = useCallback((rx: number, ry: number) => {
    onRotationChangeRef.current?.(rx, ry);
  }, []);

  useAnimatedReaction(
    () => ({
      x: gestureRotateX.value,
      y: gestureRotateY.value,
    }),
    (current, previous) => {
      const changed =
        !previous ||
        Math.abs(current.x - previous.x) > ROTATION_EPSILON ||
        Math.abs(current.y - previous.y) > ROTATION_EPSILON;

      if (changed && onRotationChangeRef.current) {
        scheduleOnUI(notifyRotationChange, current.x, current.y);
      }
    },
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((event) => {
          gestureRotateX.value = withTiming(
            interpolateRotation(event.y, props.height, true),
            TIMING_CONFIG,
          );
          gestureRotateY.value = withTiming(
            interpolateRotation(event.x, props.width),
            TIMING_CONFIG,
          );
        })
        .onUpdate((event) => {
          gestureRotateX.value = interpolateRotation(
            event.y,
            props.height,
            true,
          );
          gestureRotateY.value = interpolateRotation(event.x, props.width);
        })
        .onFinalize(() => {
          gestureRotateX.value = withTiming(ZERO, TIMING_CONFIG);
          gestureRotateY.value = withTiming(ZERO, TIMING_CONFIG);
        }),
    [
      gestureRotateX,
      gestureRotateY,
      props.height,
      props.width,
      interpolateRotation,
    ],
  );

  const sizeStyle = useMemo(
    () => ({
      width: props.width,
      height: props.height,
    }),
    [props.width, props.height],
  );

  const outerStyle = useAnimatedStyle(() => {
    const totalRotateX = gestureRotateX.value + sensorRotateX.value;
    const totalRotateY = gestureRotateY.value + sensorRotateY.value;
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
        { translateX: sensorTranslateX.value },
        { translateY: sensorTranslateY.value },
      ],
    };
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
      <Animated.View style={[styles.outer, sizeStyle, outerStyle]}>
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
  identityTransform: {
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: "0deg" },
      { rotateY: "0deg" },
    ],
  } as ViewStyle,
});
