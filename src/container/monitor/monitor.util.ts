import { PerfSnapshot, PerfStore } from "./monitor.type";

const FPS_SAMPLE_MS = 500;

const store: PerfStore = {
  jsFps: 0,
  componentRenders: 0,
  profilerActualDuration: 0,
  profilerBaseDuration: 0,
  canvases: {},
};

const listeners = new Set<() => void>();

let notifyScheduled = false;

export const emit = () => {
  if (notifyScheduled) {
    return;
  }

  notifyScheduled = true;

  requestAnimationFrame(() => {
    notifyScheduled = false;
    listeners.forEach((listener) => listener());
  });
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSnapshot = (): PerfSnapshot => {
  return {
    jsFps: store.jsFps,
    componentRenders: store.componentRenders,
    profilerActualDuration: store.profilerActualDuration,
    profilerBaseDuration: store.profilerBaseDuration,
    canvases: Object.values(store.canvases).sort((a, b) =>
      a.id.localeCompare(b.id),
    ),
  };
};

export const updateJsFps = (jsFps: number) => {
  if (store.jsFps === jsFps) {
    return;
  }

  store.jsFps = jsFps;
  emit();
};

export const incrementComponentRender = () => {
  store.componentRenders += 1;
  emit();
};

export const setProfilerStats = (
  actualDuration: number,
  baseDuration: number,
) => {
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
};

export const registerCanvas = (id: string) => {
  if (!store.canvases[id]) {
    store.canvases[id] = {
      id,
      renders: 0,
      mounts: 0,
    };
  }

  store.canvases[id].mounts += 1;
  emit();
};

export const unregisterCanvas = (id: string) => {
  const canvas = store.canvases[id];
  if (!canvas) {
    return;
  }

  canvas.mounts = Math.max(0, canvas.mounts - 1);

  if (canvas.mounts === 0) {
    delete store.canvases[id];
  }

  emit();
};

export const incrementCanvasRender = (id: string) => {
  if (!store.canvases[id]) {
    store.canvases[id] = {
      id,
      renders: 0,
      mounts: 0,
    };
  }

  store.canvases[id].renders += 1;
  emit();
};

export const createJsFpsLoop = (onFps: (fps: number) => void) => {
  let frameCount = 0;
  let rafId = 0;
  let lastSampleTime = 0;

  const loop = (timestamp: number) => {
    if (lastSampleTime === 0) {
      lastSampleTime = timestamp;
    }

    frameCount += 1;

    const elapsed = timestamp - lastSampleTime;
    if (elapsed >= FPS_SAMPLE_MS) {
      const fps = Number(((frameCount * 1000) / elapsed).toFixed(1));
      onFps(fps);
      frameCount = 0;
      lastSampleTime = timestamp;
    }

    rafId = requestAnimationFrame(loop);
  };

  return {
    start: () => {
      rafId = requestAnimationFrame(loop);
    },
    stop: () => {
      cancelAnimationFrame(rafId);
    },
  };
};
