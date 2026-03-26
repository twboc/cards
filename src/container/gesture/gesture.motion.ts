import { useCallback, useEffect, useMemo, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import { useAnimatedReaction, withTiming } from "react-native-reanimated";
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from "react-native-sensors";
import {
  DEFAULT_MAX_ANGLE,
  DEFAULT_SENSOR_ROTATION_FACTOR,
  DEFAULT_SENSOR_TRANSLATION_FACTOR,
  ROTATION_EPSILON,
  SENSOR_INTERVAL_MS,
  TIMING_CONFIG,
  ZERO,
} from "../../const/const";
import { scheduleOnUI } from "react-native-worklets";
import GestureContainerProps, {
  GestureContainerMotion,
  UseGestureContainerMotionParams,
} from "./gesture.type";
import { clamp, mapToAngle } from "./gesture.util";

export const useGestureContainerMotion = (
  params: UseGestureContainerMotionParams,
) => {
  const maxAngle = params.props.maxAngle ?? DEFAULT_MAX_ANGLE;
  const sensorRotationFactor =
    params.props.sensorRotationFactor ?? DEFAULT_SENSOR_ROTATION_FACTOR;
  const sensorTranslationFactor =
    params.props.sensorTranslationFactor ?? DEFAULT_SENSOR_TRANSLATION_FACTOR;

  const onRotationChangeRef = useRef<GestureContainerProps["onRotationChange"]>(
    params.props.onRotationChange,
  );

  useEffect(() => {
    onRotationChangeRef.current = params.props.onRotationChange;
  }, [params.props.onRotationChange]);

  const motion = useMemo<GestureContainerMotion>(
    () => ({
      gestureRotateX: params.gestureRotateX,
      gestureRotateY: params.gestureRotateY,
      sensorRotateX: params.sensorRotateX,
      sensorRotateY: params.sensorRotateY,
      sensorTranslateX: params.sensorTranslateX,
      sensorTranslateY: params.sensorTranslateY,
    }),
    [
      params.gestureRotateX,
      params.gestureRotateY,
      params.sensorRotateX,
      params.sensorRotateY,
      params.sensorTranslateX,
      params.sensorTranslateY,
    ],
  );

  const resetMotion = useCallback(() => {
    params.gestureRotateX.value = withTiming(ZERO, TIMING_CONFIG);
    params.gestureRotateY.value = withTiming(ZERO, TIMING_CONFIG);
    params.sensorRotateX.value = withTiming(ZERO, TIMING_CONFIG);
    params.sensorRotateY.value = withTiming(ZERO, TIMING_CONFIG);
    params.sensorTranslateX.value = withTiming(ZERO, TIMING_CONFIG);
    params.sensorTranslateY.value = withTiming(ZERO, TIMING_CONFIG);
  }, [
    params.gestureRotateX,
    params.gestureRotateY,
    params.sensorRotateX,
    params.sensorRotateY,
    params.sensorTranslateX,
    params.sensorTranslateY,
  ]);

  useEffect(() => {
    if (!params.props.sensorEnabled) {
      resetMotion();
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);

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

      params.sensorRotateX.value = withTiming(nextRotateX, TIMING_CONFIG);
      params.sensorRotateY.value = withTiming(nextRotateY, TIMING_CONFIG);
      params.sensorTranslateX.value = withTiming(nextTranslateX, TIMING_CONFIG);
      params.sensorTranslateY.value = withTiming(nextTranslateY, TIMING_CONFIG);
    });

    return () => {
      subscription.unsubscribe();
      resetMotion();
    };
  }, [
    params.props.sensorEnabled,
    maxAngle,
    sensorRotationFactor,
    sensorTranslationFactor,
    resetMotion,
    params.sensorRotateX,
    params.sensorRotateY,
    params.sensorTranslateX,
    params.sensorTranslateY,
  ]);

  const notifyRotationChange = useCallback((rx: number, ry: number) => {
    onRotationChangeRef.current?.(rx, ry);
  }, []);

  useAnimatedReaction(
    () => ({
      x: params.gestureRotateX.value,
      y: params.gestureRotateY.value,
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
          params.gestureRotateX.value = withTiming(
            mapToAngle(event.y, params.props.height, maxAngle, true),
            TIMING_CONFIG,
          );
          params.gestureRotateY.value = withTiming(
            mapToAngle(event.x, params.props.width, maxAngle),
            TIMING_CONFIG,
          );
        })
        .onUpdate((event) => {
          params.gestureRotateX.value = mapToAngle(
            event.y,
            params.props.height,
            maxAngle,
            true,
          );
          params.gestureRotateY.value = mapToAngle(
            event.x,
            params.props.width,
            maxAngle,
          );
        })
        .onFinalize(() => {
          params.gestureRotateX.value = withTiming(ZERO, TIMING_CONFIG);
          params.gestureRotateY.value = withTiming(ZERO, TIMING_CONFIG);
        }),
    [
      params.gestureRotateX,
      params.gestureRotateY,
      params.props.height,
      params.props.width,
      maxAngle,
    ],
  );

  return {
    motion,
    gesture,
    resetMotion,
  };
};
