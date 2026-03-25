import { useMemo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { Transforms3d } from "@shopify/react-native-skia";
import {
  GRADIENT_TRANSLATE_FACTOR,
  MASK_TRANSLATE_FACTOR,
  MILLISECONDS_TO_SECONDS,
  ZERO_GRADIENT_POINTS,
} from "../../const/const";
import { GradientPoints } from "../../type/type";

type UseFullCanvasDerivedValuesParams = {
  clock: { value: number };
  width: number;
  height: number;
  borderRadius: number;
  inverseMaxAngle: number;
  halfWidth: number;
  halfHeight: number;
  negativeWidth: number;
  negativeHeight: number;
  needsGradient: boolean;
  needsMaskTransform: boolean;
  gestureRotateX: { value: number };
  gestureRotateY: { value: number };
  sensorRotateX: { value: number };
  sensorRotateY: { value: number };
  sensorTranslateX: { value: number };
  sensorTranslateY: { value: number };
  perfMonitor: boolean;
  style: any;
};

export function useFullCanvasDerivedValues(
  params: UseFullCanvasDerivedValuesParams,
) {
  const totalRotateX = useDerivedValue(
    () => params.gestureRotateX.value + params.sensorRotateX.value,
    [params.gestureRotateX, params.sensorRotateX],
  );

  const totalRotateY = useDerivedValue(
    () => params.gestureRotateY.value + params.sensorRotateY.value,
    [params.gestureRotateY, params.sensorRotateY],
  );

  const time = useDerivedValue(() => {
    return params.clock.value * MILLISECONDS_TO_SECONDS;
  }, [params.clock]);

  const gradientPoints = useDerivedValue<GradientPoints>(() => {
    if (!params.needsGradient) {
      return {
        start: ZERO_GRADIENT_POINTS.start,
        end: { x: params.width, y: params.height },
      };
    }

    const rotateXNorm = totalRotateX.value * params.inverseMaxAngle;
    const rotateYNorm = totalRotateY.value * params.inverseMaxAngle;
    const tx = params.sensorTranslateX.value * GRADIENT_TRANSLATE_FACTOR;
    const ty = params.sensorTranslateY.value * GRADIENT_TRANSLATE_FACTOR;

    const centerX = params.halfWidth + params.halfWidth * rotateYNorm + tx;
    const centerY = params.halfHeight + params.halfHeight * rotateXNorm + ty;

    return {
      start: {
        x: params.negativeWidth + centerX,
        y: params.negativeHeight + centerY,
      },
      end: {
        x: params.width + centerX,
        y: params.height + centerY,
      },
    };
  }, [
    params.needsGradient,
    params.halfWidth,
    params.halfHeight,
    params.negativeWidth,
    params.negativeHeight,
    params.inverseMaxAngle,
    params.width,
    params.height,
    totalRotateX,
    totalRotateY,
    params.sensorTranslateX,
    params.sensorTranslateY,
  ]);

  const maskTransform = useDerivedValue<Transforms3d>(() => {
    if (!params.needsMaskTransform) {
      return [{ translateX: 0 }, { translateY: 0 }];
    }

    return [
      { translateX: params.sensorTranslateX.value * MASK_TRANSLATE_FACTOR },
      { translateY: params.sensorTranslateY.value * MASK_TRANSLATE_FACTOR },
    ];
  }, [
    params.needsMaskTransform,
    params.sensorTranslateX,
    params.sensorTranslateY,
  ]);

  return {
    time,
    totalRotateX,
    totalRotateY,
    gradientPoints,
    maskTransform,
  };
}

export function useFullCanvasMemoValues(params: {
  width: number;
  height: number;
  borderRadius: number;
  style: any;
  perfMonitor: boolean;
}) {
  const containerStyle = useMemo(
    () => [
      {
        overflow: "hidden" as const,
        position: "relative" as const,
        width: params.width,
        height: params.height,
        borderRadius: params.borderRadius,
      },
      params.style,
    ],
    [params.width, params.height, params.borderRadius, params.style],
  );

  const absoluteCanvasStyle = useMemo(
    () => [
      {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: params.width,
        height: params.height,
      },
      params.style,
    ],
    [params.width, params.height, params.style],
  );

  const canvasMonitorProps = useMemo(
    () =>
      params.perfMonitor
        ? { monitor: true as const, monitorId: "fullcanvas-main" }
        : undefined,
    [params.perfMonitor],
  );

  return {
    containerStyle,
    absoluteCanvasStyle,
    canvasMonitorProps,
  };
}
