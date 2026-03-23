import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import {
  Canvas,
  DataSourceParam,
  Fill,
  Group,
  Image,
  LinearGradient,
  Mask,
  RoundedRect,
  Shader,
  Skia,
  SkRuntimeEffect,
  useImage,
} from "@shopify/react-native-skia";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GestureContainerMotion } from "./gesture";

interface FullCanvasProps {
  showShaderBack: boolean;
  showHologram: boolean;
  showGloss: boolean;
  maxAngle?: number;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  hologramMaskSource?: DataSourceParam;
  shader: React.RefObject<string>;
  motion?: GestureContainerMotion;
  isActive?: boolean;
  borderRadius?: number;
}

const zeroShared = {
  value: 0,
} as SharedValue<number>;

const TARGET_FPS = 30;
const FRAME_DURATION = 1000 / TARGET_FPS;

interface CanvasBackgroundProps {
  width: number;
  height: number;
  borderRadius: number;
  shaderEffectRef: React.RefObject<SkRuntimeEffect | null>;
  time: number;
  children?: ReactNode;
}

export const BackgrdoundShader: FC<CanvasBackgroundProps> = (props) => {
  if (props.shaderEffectRef.current == null) {
    return <></>;
  }
  return (
    <Mask
      mode="alpha"
      mask={
        <RoundedRect
          x={0}
          y={0}
          r={props.borderRadius}
          width={props.width}
          height={props.height}
          color="white"
        />
      }
    >
      <Fill>
        <Shader
          source={props.shaderEffectRef.current}
          uniforms={{
            iTime: props.time,
            iResolution: [props.width, props.height],
          }}
        />
      </Fill>
    </Mask>
  );
};

export const FullCanvas = ({
  showShaderBack,
  showHologram,
  showGloss,
  children,
  maxAngle = 15,
  width,
  height,
  style,
  hologramMaskSource,
  motion,
  isActive = true,
  borderRadius = 12,
  shader,
}: PropsWithChildren<FullCanvasProps>) => {
  const [time, setTime] = useState(0);

  const requestRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const lastFrameTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  const hologramMask = useImage(hologramMaskSource);

  const gestureRotateX = motion?.gestureRotateX ?? zeroShared;
  const gestureRotateY = motion?.gestureRotateY ?? zeroShared;
  const sensorRotateX = motion?.sensorRotateX ?? zeroShared;
  const sensorRotateY = motion?.sensorRotateY ?? zeroShared;
  const sensorTranslateX = motion?.sensorTranslateX ?? zeroShared;
  const sensorTranslateY = motion?.sensorTranslateY ?? zeroShared;

  const shaderEffectRef = useRef(Skia.RuntimeEffect.Make(shader.current));

  const totalRotateX = useDerivedValue(
    () => gestureRotateX.value + sensorRotateX.value,
    [gestureRotateX, sensorRotateX],
  );

  const totalRotateY = useDerivedValue(
    () => gestureRotateY.value + sensorRotateY.value,
    [gestureRotateY, sensorRotateY],
  );

  const gradientStart = useDerivedValue(() => ({
    x:
      -width +
      (width / 2 + (width / 2) * (totalRotateY.value / maxAngle)) +
      sensorTranslateX.value * 0.35,
    y:
      -height +
      (height / 2 + (height / 2) * (totalRotateX.value / maxAngle)) +
      sensorTranslateY.value * 0.35,
  }));

  const gradientEnd = useDerivedValue(() => ({
    x:
      width +
      (width / 2 + (width / 2) * (totalRotateY.value / maxAngle)) +
      sensorTranslateX.value * 0.35,
    y:
      height +
      (height / 2 + (height / 2) * (totalRotateX.value / maxAngle)) +
      sensorTranslateY.value * 0.35,
  }));

  const maskTransform = useDerivedValue(
    () => [
      { translateX: sensorTranslateX.value * 0.2 },
      { translateY: sensorTranslateY.value * 0.2 },
    ],
    [sensorTranslateX, sensorTranslateY],
  );

  const stopAnimation = useCallback(() => {
    if (requestRef.current != null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      if (!mountedRef.current || !isActive) {
        return;
      }

      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      if (
        lastFrameTimeRef.current === 0 ||
        timestamp - lastFrameTimeRef.current >= FRAME_DURATION
      ) {
        lastFrameTimeRef.current = timestamp;
        const elapsedSeconds = (timestamp - startTimeRef.current) / 1000;
        setTime(elapsedSeconds);
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [isActive],
  );

  useEffect(() => {
    mountedRef.current = true;

    if (!isActive) {
      stopAnimation();
      return;
    }

    lastFrameTimeRef.current = 0;
    startTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      stopAnimation();
    };
  }, [animate, isActive, stopAnimation]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopAnimation();
    };
  }, [stopAnimation]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        width,
        height,
        borderRadius,
      },
      style,
    ],
    [width, height, borderRadius, style],
  );

  const childrenLayerStyle = useMemo(
    () => [
      StyleSheet.absoluteFillObject,
      styles.childrenLayer,
      {
        width,
        height,
        borderRadius,
      },
    ],
    [width, height, borderRadius],
  );

  if (!shaderEffectRef.current) {
    return <View style={containerStyle}>{children}</View>;
  }

  if (!isActive) {
    return (
      <View style={containerStyle}>
        <View style={childrenLayerStyle}>{children}</View>
      </View>
    );
  }

  const renderHologramLayer = () => (
    <Group blendMode="overlay">
      <Mask
        mask={
          <RoundedRect x={0} y={0} r={12} width={width} height={height}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={[
                "rgba(0, 0, 0, 0)",
                "rgba(255, 255, 255, 0.8)",
                "rgba(0, 0, 0, 0)",
                "rgba(255, 255, 255, 0.7)",
                "rgba(0, 0, 0, 0)",
              ]}
              positions={[0, 0.35, 0.5, 0.65, 1]}
            />
          </RoundedRect>
        }
        mode="luminance"
      >
        <Group transform={maskTransform}>
          <Image
            image={hologramMask}
            width={width}
            height={height}
            fit="cover"
          />
        </Group>

        <RoundedRect x={0} y={0} r={17} width={width} height={height}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={[
              "#ff3b30",
              "#ff9500",
              "#ffcc00",
              "#4cd964",
              "#34aadc",
              "#5856d6",
              "#2e2d87",
            ]}
          />
        </RoundedRect>
      </Mask>
    </Group>
  );

  const renderGlossLayer = () => {
    return (
      <RoundedRect x={0} y={0} r={12} width={width} height={height}>
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={[
            "rgba(0, 0, 0, 0)",
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0)",
            "rgba(255, 255, 255, 0.2)",
            "rgba(0, 0, 0, 0)",
          ]}
          positions={[0, 0.35, 0.5, 0.65, 1]}
        />
      </RoundedRect>
    );
  };

  return (
    <>
      <Canvas
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            width,
            height,
          },
          style,
        ]}
      >
        {showShaderBack && (
          <BackgrdoundShader
            width={width}
            height={height}
            borderRadius={borderRadius}
            time={time}
            shaderEffectRef={shaderEffectRef}
          />
        )}
      </Canvas>

      {children}
      <Canvas
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            width,
            height,
          },
          style,
        ]}
      >
        {showHologram && hologramMaskSource && renderHologramLayer()}
        {showGloss && renderGlossLayer()}
      </Canvas>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  clippedLayer: {
    overflow: "hidden",
    zIndex: 0,
  },
  childrenLayer: {
    overflow: "hidden",
    zIndex: 10,
  },
});
