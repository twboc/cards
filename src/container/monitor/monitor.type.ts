import { PropsWithChildren } from "react";
import { CanvasProps } from "@shopify/react-native-skia";

export type CanvasStats = {
  id: string;
  renders: number;
  mounts: number;
};

export type PerfSnapshot = {
  jsFps: number;
  componentRenders: number;
  profilerActualDuration: number;
  profilerBaseDuration: number;
  canvases: CanvasStats[];
};

export type PerfStore = {
  jsFps: number;
  componentRenders: number;
  profilerActualDuration: number;
  profilerBaseDuration: number;
  canvases: Record<string, CanvasStats>;
};

export type MonitoredCanvasProps = PropsWithChildren<
  CanvasProps & {
    monitorId?: string;
    monitor?: boolean;
  }
>;

export type MonitoredComponentProfilerProps = PropsWithChildren<{
  id?: string;
  monitor?: boolean;
}>;

export type PerformanceOverlayProps = {
  visible?: boolean;
  title?: string;
};
