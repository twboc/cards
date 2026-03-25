import { useEffect, useMemo, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
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
  mapSensorRotation,
  mapSensorTranslation,
  mapToAngle,
} from "./gesture.worklets";
import type { GestureContainerMotion } from "./gesture";
import {
  DEFAULT_MAX_ANGLE,
  DEFAULT_SENSOR_ENABLED,
  DEFAULT_SENSOR_ROTATION_FACTOR,
  DEFAULT_SENSOR_TRANSLATION_FACTOR,
  PERSPECTIVE,
  RESET_TIMING_CONFIG,
  ROTATION_EPSILON,
  SENSOR_INTERVAL_MS,
  ZERO,
} from "../../const/const";
import { scheduleOnUI } from "react-native-worklets";

type UseGestureContainerMotionParams = {
  width: number;
  height: number;
  maxAngle?: number;
  onRotationChange?: (rx: number, ry: number) => void;
  sensorEnabled?: boolean;
  sensorRotationFactor?: number;
  sensorTranslationFactor?: number;
};

export function useGestureContainerMotion(
  params: UseGestureContainerMotionParams,
) {
  const maxAngle = params.maxAngle ?? DEFAULT_MAX_ANGLE;
  const sensorEnabled = params.sensorEnabled ?? DEFAULT_SENSOR_ENABLED;
  const sensorRotationFactor =
    params.sensorRotationFactor ?? DEFAULT_SENSOR_ROTATION_FACTOR;
  const sensorTranslationFactor =
    params.sensorTranslationFactor ?? DEFAULT_SENSOR_TRANSLATION_FACTOR;

  const gestureRotateX = useSharedValue(ZERO);
  const gestureRotateY = useSharedValue(ZERO);
  const sensorRotateX = useSharedValue(ZERO);
  const sensorRotateY = useSharedValue(ZERO);
  const sensorTranslateX = useSharedValue(ZERO);
  const sensorTranslateY = useSharedValue(ZERO);

  const onRotationChangeRef = useRef<
    UseGestureContainerMotionParams["onRotationChange"]
  >(params.onRotationChange);

  useEffect(() => {
    onRotationChangeRef.current = params.onRotationChange;
  }, [params.onRotationChange]);

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

  useEffect(() => {
    if (!sensorEnabled) {
      gestureRotateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      gestureRotateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorRotateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorRotateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorTranslateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorTranslateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      return;
    }

    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);

    const subscription = accelerometer.subscribe(({ x, y }) => {
      sensorRotateX.value = mapSensorRotation(
        y,
        sensorRotationFactor,
        maxAngle,
        true,
      );
      sensorRotateY.value = mapSensorRotation(
        x,
        sensorRotationFactor,
        maxAngle,
      );

      sensorTranslateX.value = mapSensorTranslation(x, sensorTranslationFactor);
      sensorTranslateY.value = mapSensorTranslation(y, sensorTranslationFactor);
    });

    return () => {
      subscription.unsubscribe();

      sensorRotateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorRotateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorTranslateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      sensorTranslateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
    };
  }, [
    maxAngle,
    sensorEnabled,
    sensorRotationFactor,
    sensorTranslationFactor,
    gestureRotateX,
    gestureRotateY,
    sensorRotateX,
    sensorRotateY,
    sensorTranslateX,
    sensorTranslateY,
  ]);

  const notifyRotationChange = (rx: number, ry: number) => {
    onRotationChangeRef.current?.(rx, ry);
  };

  useAnimatedReaction(
    () => ({
      x: gestureRotateX.value,
      y: gestureRotateY.value,
    }),
    (current, previous) => {
      if (!onRotationChangeRef.current) {
        return;
      }

      const hasChanged =
        !previous ||
        Math.abs(current.x - previous.x) > ROTATION_EPSILON ||
        Math.abs(current.y - previous.y) > ROTATION_EPSILON;

      if (hasChanged) {
        scheduleOnUI(notifyRotationChange, current.x, current.y);
      }
    },
  );

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin((event) => {
        gestureRotateX.value = withTiming(
          mapToAngle(event.y, params.height, maxAngle, true),
          RESET_TIMING_CONFIG,
        );
        gestureRotateY.value = withTiming(
          mapToAngle(event.x, params.width, maxAngle, false),
          RESET_TIMING_CONFIG,
        );
      })
      .onUpdate((event) => {
        gestureRotateX.value = mapToAngle(
          event.y,
          params.height,
          maxAngle,
          true,
        );
        gestureRotateY.value = mapToAngle(
          event.x,
          params.width,
          maxAngle,
          false,
        );
      })
      .onFinalize(() => {
        gestureRotateX.value = withTiming(ZERO, RESET_TIMING_CONFIG);
        gestureRotateY.value = withTiming(ZERO, RESET_TIMING_CONFIG);
      });
  }, [gestureRotateX, gestureRotateY, params.height, params.width, maxAngle]);

  const outerStaticStyle = useMemo(
    () => [{ width: params.width, height: params.height }],
    [params.width, params.height],
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

  return {
    motion,
    gesture,
    outerStaticStyle,
    outerStyle,
    innerStyle,
  };
}
