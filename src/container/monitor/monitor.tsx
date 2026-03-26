import React, { Profiler, useEffect, useRef, useState } from "react";
import { Canvas } from "@shopify/react-native-skia";
import { Text, View } from "react-native";
import { styles } from "./monitor.style";
import {
  MonitoredCanvasProps,
  MonitoredComponentProfilerProps,
  PerformanceOverlayProps,
} from "./monitor.type";
import {
  createJsFpsLoop,
  getSnapshot,
  incrementCanvasRender,
  incrementComponentRender,
  registerCanvas,
  setProfilerStats,
  subscribe,
  unregisterCanvas,
  updateJsFps,
} from "./monitor.util";

export function usePerfMonitorSnapshot() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return subscribe(() => {
      forceUpdate((value) => value + 1);
    });
  }, []);

  return getSnapshot();
}

export function useJsFpsMonitor(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fpsLoop = createJsFpsLoop(updateJsFps);
    fpsLoop.start();

    return () => {
      fpsLoop.stop();
    };
  }, [enabled]);
}

export function MonitoredCanvas(props: MonitoredCanvasProps) {
  const {
    monitorId = "canvas",
    monitor = false,
    children,
    ...canvasProps
  } = props;

  useEffect(() => {
    if (!monitor) {
      return;
    }

    registerCanvas(monitorId);

    return () => {
      unregisterCanvas(monitorId);
    };
  }, [monitor, monitorId]);

  useEffect(() => {
    if (!monitor) {
      return;
    }

    incrementCanvasRender(monitorId);
  });

  return <Canvas {...canvasProps}>{children}</Canvas>;
}

export function MonitoredComponentProfiler(
  props: MonitoredComponentProfilerProps,
) {
  const { id = "FullCanvas", monitor = false, children } = props;
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!monitor) {
      return;
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
    }

    incrementComponentRender();
  });

  if (!monitor) {
    return <>{children}</>;
  }

  return (
    <Profiler
      id={id}
      onRender={(_id, _phase, actualDuration, baseDuration) => {
        setProfilerStats(actualDuration, baseDuration);
      }}
    >
      {children}
    </Profiler>
  );
}

export function PerformanceOverlay(props: PerformanceOverlayProps) {
  const { visible = false, title = "Perf" } = props;
  const snapshot = usePerfMonitorSnapshot();

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.line}>JS FPS: {snapshot.jsFps}</Text>
      <Text style={styles.line}>
        Component renders: {snapshot.componentRenders}
      </Text>
      <Text style={styles.line}>
        Profiler actual/base: {snapshot.profilerActualDuration}ms /{" "}
        {snapshot.profilerBaseDuration}ms
      </Text>
      <Text style={styles.line}>Canvases: {snapshot.canvases.length}</Text>

      {snapshot.canvases.map((canvas) => (
        <Text key={canvas.id} style={styles.canvasLine}>
          {canvas.id}: renders {canvas.renders}, mounts {canvas.mounts}
        </Text>
      ))}
    </View>
  );
}
