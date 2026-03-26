import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";
import {
  DEFAULT_MAX_ANGLE,
  ROTATION_EPSILON,
  SENSOR_INTERVAL_MS,
  TIMING_CONFIG,
  ZERO,
} from "../../const/const";
import { scheduleOnUI } from "react-native-worklets";
import GestureContainerProps, { GestureContainerMotion } from "./gesture.type";
import style, {
  useGestureContainerAnimatedStyles,
  useGestureContainerSizeStyle,
} from "./gesture.style";
import { clamp, mapToAngle } from "./gesture.util";

const GestureContainerComponent = (props: GestureContainerProps) => {
  const maxAngle = props.maxAngle ?? DEFAULT_MAX_ANGLE;
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
            mapToAngle(event.y, props.height, maxAngle, true),
            TIMING_CONFIG,
          );
          gestureRotateY.value = withTiming(
            mapToAngle(event.x, props.width, maxAngle),
            TIMING_CONFIG,
          );
        })
        .onUpdate((event) => {
          gestureRotateX.value = mapToAngle(
            event.y,
            props.height,
            maxAngle,
            true,
          );
          gestureRotateY.value = mapToAngle(event.x, props.width, maxAngle);
        })
        .onFinalize(() => {
          gestureRotateX.value = withTiming(ZERO, TIMING_CONFIG);
          gestureRotateY.value = withTiming(ZERO, TIMING_CONFIG);
        }),
    [gestureRotateX, gestureRotateY, props.height, props.width],
  );

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
