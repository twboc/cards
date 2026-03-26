import React from "react";
import { SharedValue } from "react-native-reanimated";

export interface GestureContainerMotion {
  gestureRotateX: SharedValue<number>;
  gestureRotateY: SharedValue<number>;
  sensorRotateX: SharedValue<number>;
  sensorRotateY: SharedValue<number>;
  sensorTranslateX: SharedValue<number>;
  sensorTranslateY: SharedValue<number>;
}

export default interface GestureContainerProps {
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

export type UseGestureContainerMotionParams = GestureContainerMotion & {
  props: GestureContainerProps;
};
