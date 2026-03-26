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
  SENSOR_DEAD_ZONE,
  SENSOR_INTERVAL_MS,
  SENSOR_SMOOTHING,
  SENSOR_UPDATE_EPSILON,
  TIMING_CONFIG,
  ZERO,
} from "../../const/const";
import { scheduleOnUI } from "react-native-worklets";
import GestureContainerProps, {
  GestureContainerMotion,
  UseGestureContainerMotionParams,
} from "./gesture.type";
import {
  applyDeadZone,
  clamp,
  mapToAngle,
  shouldUpdateValue,
  smoothValue,
} from "./gesture.util";

export const useGestureContainerMotion = (
  params: UseGestureContainerMotionParams,
) => {
  const maxAngle = params.props.maxAngle ?? DEFAULT_MAX_ANGLE;
  const sensorRotationFactor =
    params.props.sensorRotationFactor ?? DEFAULT_SENSOR_ROTATION_FACTOR;
  const sensorTranslationFactor =
    params.props.sensorTranslationFactor ?? DEFAULT_SENSOR_TRANSLATION_FACTOR;
  const sensorEnabled = params.props.sensorEnabled ?? true;

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
    if (!sensorEnabled) {
      resetMotion();
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);

    const subscription = accelerometer.subscribe(({ x, y }) => {
      const filteredX = applyDeadZone(x, SENSOR_DEAD_ZONE);
      const filteredY = applyDeadZone(y, SENSOR_DEAD_ZONE);

      const targetRotateY = clamp(
        filteredX * sensorRotationFactor,
        -maxAngle,
        maxAngle,
      );

      const targetRotateX = clamp(
        -filteredY * sensorRotationFactor,
        -maxAngle,
        maxAngle,
      );

      const targetTranslateX = clamp(
        filteredX * sensorTranslationFactor,
        -sensorTranslationFactor,
        sensorTranslationFactor,
      );

      const targetTranslateY = clamp(
        filteredY * sensorTranslationFactor,
        -sensorTranslationFactor,
        sensorTranslationFactor,
      );

      const nextRotateX = smoothValue(
        params.sensorRotateX.value,
        targetRotateX,
        SENSOR_SMOOTHING,
      );

      const nextRotateY = smoothValue(
        params.sensorRotateY.value,
        targetRotateY,
        SENSOR_SMOOTHING,
      );

      const nextTranslateX = smoothValue(
        params.sensorTranslateX.value,
        targetTranslateX,
        SENSOR_SMOOTHING,
      );

      const nextTranslateY = smoothValue(
        params.sensorTranslateY.value,
        targetTranslateY,
        SENSOR_SMOOTHING,
      );

      if (
        shouldUpdateValue(
          params.sensorRotateX.value,
          nextRotateX,
          SENSOR_UPDATE_EPSILON,
        )
      ) {
        params.sensorRotateX.value = nextRotateX;
      }

      if (
        shouldUpdateValue(
          params.sensorRotateY.value,
          nextRotateY,
          SENSOR_UPDATE_EPSILON,
        )
      ) {
        params.sensorRotateY.value = nextRotateY;
      }

      if (
        shouldUpdateValue(
          params.sensorTranslateX.value,
          nextTranslateX,
          SENSOR_UPDATE_EPSILON,
        )
      ) {
        params.sensorTranslateX.value = nextTranslateX;
      }

      if (
        shouldUpdateValue(
          params.sensorTranslateY.value,
          nextTranslateY,
          SENSOR_UPDATE_EPSILON,
        )
      ) {
        params.sensorTranslateY.value = nextTranslateY;
      }
    });

    return () => {
      subscription.unsubscribe();
      resetMotion();
    };
  }, [
    sensorEnabled,
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
    () => [params.gestureRotateX.value, params.gestureRotateY.value] as const,
    (current, previous) => {
      const changed =
        !previous ||
        Math.abs(current[0] - previous[0]) > ROTATION_EPSILON ||
        Math.abs(current[1] - previous[1]) > ROTATION_EPSILON;

      if (changed && onRotationChangeRef.current) {
        scheduleOnUI(notifyRotationChange, current[0], current[1]);
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
