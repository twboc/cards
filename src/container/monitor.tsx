import React, {
  Profiler,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, CanvasProps } from "@shopify/react-native-skia";
import { StyleSheet, Text, View } from "react-native";

type CanvasStats = {
  id: string;
  renders: number;
  mounts: number;
};

type PerfSnapshot = {
  jsFps: number;
  componentRenders: number;
  profilerActualDuration: number;
  profilerBaseDuration: number;
  canvases: CanvasStats[];
};

type PerfStore = {
  jsFps: number;
  componentRenders: number;
  profilerActualDuration: number;
  profilerBaseDuration: number;
  canvases: Record<string, CanvasStats>;
};

const store: PerfStore = {
  jsFps: 0,
  componentRenders: 0,
  profilerActualDuration: 0,
  profilerBaseDuration: 0,
  canvases: {},
};

const listeners = new Set<() => void>();

let notifyScheduled = false;

function emit() {
  if (notifyScheduled) {
    return;
  }

  notifyScheduled = true;

  requestAnimationFrame(() => {
    notifyScheduled = false;
    listeners.forEach((listener) => listener());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): PerfSnapshot {
  return {
    jsFps: store.jsFps,
    componentRenders: store.componentRenders,
    profilerActualDuration: store.profilerActualDuration,
    profilerBaseDuration: store.profilerBaseDuration,
    canvases: Object.values(store.canvases).sort((a, b) =>
      a.id.localeCompare(b.id),
    ),
  };
}

function updateJsFps(jsFps: number) {
  if (store.jsFps === jsFps) {
    return;
  }

  store.jsFps = jsFps;
  emit();
}

function incrementComponentRender() {
  store.componentRenders += 1;
  emit();
}

function setProfilerStats(actualDuration: number, baseDuration: number) {
  const actual = Number(actualDuration.toFixed(2));
  const base = Number(baseDuration.toFixed(2));

  if (
    store.profilerActualDuration === actual &&
    store.profilerBaseDuration === base
  ) {
    return;
  }

  store.profilerActualDuration = actual;
  store.profilerBaseDuration = base;
  emit();
}

function registerCanvas(id: string) {
  if (!store.canvases[id]) {
    store.canvases[id] = {
      id,
      renders: 0,
      mounts: 0,
    };
  }

  store.canvases[id].mounts += 1;
  emit();
}

function unregisterCanvas(id: string) {
  const canvas = store.canvases[id];
  if (!canvas) {
    return;
  }

  canvas.mounts = Math.max(0, canvas.mounts - 1);

  if (canvas.mounts === 0) {
    delete store.canvases[id];
  }

  emit();
}

function incrementCanvasRender(id: string) {
  if (!store.canvases[id]) {
    store.canvases[id] = {
      id,
      renders: 0,
      mounts: 0,
    };
  }

  store.canvases[id].renders += 1;
  emit();
}

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

    let frameCount = 0;
    let rafId = 0;
    let lastSampleTime = 0;

    const loop = (timestamp: number) => {
      if (lastSampleTime === 0) {
        lastSampleTime = timestamp;
      }

      frameCount += 1;

      const elapsed = timestamp - lastSampleTime;
      if (elapsed >= 500) {
        const fps = (frameCount * 1000) / elapsed;
        updateJsFps(Number(fps.toFixed(1)));
        frameCount = 0;
        lastSampleTime = timestamp;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}

export function MonitoredCanvas(
  props: PropsWithChildren<
    CanvasProps & {
      monitorId?: string;
      monitor?: boolean;
    }
  >,
) {
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
  props: PropsWithChildren<{
    id?: string;
    monitor?: boolean;
  }>,
) {
  const { id = "FullCanvas", monitor = false, children } = props;
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!monitor) {
      return;
    }

    if (!didMountRef.current) {
      didMountRef.current = true;
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

export function PerformanceOverlay(props: {
  visible?: boolean;
  title?: string;
}) {
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

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 9999,
    minWidth: 220,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  title: {
    color: "#00ff90",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 12,
  },
  line: {
    color: "#ffffff",
    fontSize: 11,
    lineHeight: 15,
  },
  canvasLine: {
    color: "#8fd3ff",
    fontSize: 11,
    lineHeight: 15,
  },
});
