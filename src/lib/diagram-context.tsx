import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type FlowMode = 'all' | 'required';

export interface DiagramControls {
  zoomIn: () => void;
  zoomOut: () => void;
  fit: () => void;
  downloadSvg: (orientation?: 'landscape' | 'portrait') => void | Promise<void>;
}

interface DiagramState {
  mode: FlowMode;
  setMode: (m: FlowMode) => void;
  /** current zoom 0.4 – 1.4, reported by the stage for the % readout */
  zoom: number;
  setZoom: (z: number) => void;
  /** Register live control callbacks from the diagram stage (home page). */
  registerControls: (c: DiagramControls | null) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fit: () => void;
  downloadSvg: (orientation?: 'landscape' | 'portrait') => void | Promise<void>;
  controlsReady: boolean;
}

const DiagramContext = createContext<DiagramState | null>(null);

export function DiagramProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FlowMode>('all');
  const [zoom, setZoom] = useState(0.88);
  const [controlsReady, setControlsReady] = useState(false);
  const controlsRef = useRef<DiagramControls | null>(null);

  const registerControls = useCallback((c: DiagramControls | null) => {
    controlsRef.current = c;
    setControlsReady(!!c);
  }, []);

  const zoomIn = useCallback(() => controlsRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => controlsRef.current?.zoomOut(), []);
  const fit = useCallback(() => controlsRef.current?.fit(), []);
  const downloadSvg = useCallback(
    (orientation: 'landscape' | 'portrait' = 'landscape') => controlsRef.current?.downloadSvg(orientation),
    [],
  );

  const value = useMemo<DiagramState>(
    () => ({
      mode,
      setMode,
      zoom,
      setZoom,
      registerControls,
      zoomIn,
      zoomOut,
      fit,
      downloadSvg,
      controlsReady,
    }),
    [mode, zoom, registerControls, zoomIn, zoomOut, fit, downloadSvg, controlsReady],
  );

  return <DiagramContext.Provider value={value}>{children}</DiagramContext.Provider>;
}

export function useDiagram() {
  const ctx = useContext(DiagramContext);
  if (!ctx) throw new Error('useDiagram must be used within DiagramProvider');
  return ctx;
}
