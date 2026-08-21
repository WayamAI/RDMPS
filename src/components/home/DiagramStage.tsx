import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDiagram } from '@/lib/diagram-context';
import { Icon, Icon3D } from '@/components/home/atoms';
import {
  BANDS,
  BOARD_H,
  BOARD_PAD,
  BOARD_W,
  BAND_H,
  BAND_W,
  HEADER_H,
  RAIL_W,
  RAIL_GAP,
  FLOW_COLOR,
  bandY,
  cardRect,
  buildConnectors,
  exportSvg,
} from '@/components/home/diagramModel';
import type { FlowType, Scope } from '@/components/home/diagramModel';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Perpetual particle dot  isolated + memoized so parent re-renders never reset it. */
import { memo } from 'react';
const Particle = memo(function Particle({ d, color, delay, dur }: { d: string; color: string; delay: number; dur: number }) {
  return (
    <span
      className="flow-particle"
      style={{
        offsetPath: `path("${d}")`,
        background: color,
        boxShadow: `0 0 6px ${color}66`,
        ['--delay' as string]: `${delay}s`,
        ['--dur' as string]: `${dur}s`,
      }}
    />
  );
});

function scopeClass(scope: Scope) {
  return scope === 'full' ? 'flow-scope-full' : undefined;
}

const RAIL_X = BOARD_PAD + BAND_W + RAIL_GAP;

type ViewState = { scale: number; x: number; y: number };

export default function DiagramStage() {
  const { mode, setZoom, registerControls } = useDiagram();
  const connectors = useMemo(() => buildConnectors(), []);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>({ scale: 0.88, x: 24, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const panRef = useRef<{ sx: number; sy: number; ox: number; oy: number }>({
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
  });

  /** Keep the board covering the viewport — no empty gaps around it. */
  const clampView = useCallback((v: ViewState): ViewState => {
    const vp = viewportRef.current;
    if (!vp) return v;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const bw = BOARD_W * v.scale;
    const bh = BOARD_H * v.scale;
    const x = bw <= vw ? (vw - bw) / 2 : Math.min(0, Math.max(vw - bw, v.x));
    const y = bh <= vh ? (vh - bh) / 2 : Math.min(0, Math.max(vh - bh, v.y));
    return { ...v, x, y };
  }, []);

  const setClampedView = useCallback(
    (next: ViewState | ((v: ViewState) => ViewState)) => {
      setView((v) => clampView(typeof next === 'function' ? next(v) : next));
    },
    [clampView],
  );

  const applyZoom = useCallback(
    (next: number) => {
      const clamped = Math.min(1.4, Math.max(0.4, next));
      setClampedView((v) => {
        const vw = viewportRef.current?.clientWidth ?? BOARD_W;
        const cx = (vw / 2 - v.x) / v.scale;
        const nx = vw / 2 - cx * clamped;
        return { scale: clamped, x: nx, y: v.y };
      });
      setZoom(clamped);
    },
    [setZoom, setClampedView],
  );

  const fit = useCallback(() => {
    const vw = viewportRef.current?.clientWidth ?? BOARD_W;
    const scale = Math.min(1.4, Math.max(0.4, (vw - 32) / BOARD_W));
    setClampedView({ scale, x: (vw - BOARD_W * scale) / 2, y: 0 });
    setZoom(scale);
  }, [setZoom, setClampedView]);

  const downloadSvg = useCallback(() => {
    const svg = exportSvg(mode);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rdpms-poc-lld.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [mode]);

  useEffect(() => {
    registerControls({
      zoomIn: () => applyZoom(view.scale + 0.1),
      zoomOut: () => applyZoom(view.scale - 0.1),
      fit,
      downloadSvg,
    });
    return () => registerControls(null);
  }, [registerControls, applyZoom, fit, downloadSvg, view.scale]);

  // drag-to-pan on empty board space + ctrl-wheel zoom
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-card]')) return;
      panRef.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
      setIsDragging(true);
      vp.setPointerCapture(e.pointerId);
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      setClampedView((v) => ({ ...v, x: panRef.current.ox + e.clientX - panRef.current.sx, y: panRef.current.oy + e.clientY - panRef.current.sy }));
    };
    const onPointerUp = () => {
      setIsDragging(false);
      vp.style.cursor = 'grab';
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        applyZoom(view.scale + (e.deltaY < 0 ? 0.1 : -0.1));
        return;
      }
      // Scroll / pan the diagram board with the wheel/trackpad
      e.preventDefault();
      setClampedView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('wheel', onWheel);
    };
  }, [view.x, view.y, view.scale, applyZoom, isDragging, setClampedView]);

  // tab-hidden perf guardrail
  useEffect(() => {
    const onVis = () => {
      document.body.dataset.tabHidden = document.hidden ? 'true' : 'false';
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // initial fit on small screens
  useEffect(() => {
    const vw = viewportRef.current?.clientWidth ?? BOARD_W;
    if (vw < BOARD_W * 0.88) fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clamp the initial view so the board never starts with empty gaps
  useEffect(() => {
    const raf = requestAnimationFrame(() => setClampedView((v) => v));
    return () => cancelAnimationFrame(raf);
  }, [setClampedView]);

  const titleWords = 'RDPMS POC · ANIMATED LOW-LEVEL DESIGN'.split(' ');

  return (
    <section className="bg-page px-4 pb-4 pt-4 lg:px-6">
      <div
        ref={viewportRef}
        className="relative mx-auto h-[calc(100dvh-64px-16px)] min-h-[360px] w-full max-w-[1560px] touch-none select-none overflow-hidden sm:min-h-[560px]"
        style={{ cursor: 'grab' }}
      >
        <motion.div
          animate={{ x: view.x, y: view.y, scale: view.scale }}
          transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
          style={{ width: BOARD_W, height: BOARD_H, transformOrigin: '0 0' }}
          className="absolute left-0 top-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            data-flow-mode={mode}
            className="relative rounded-3xl border border-stroke-default bg-board shadow-2xl shadow-black/10"
            style={{ width: BOARD_W, height: BOARD_H }}
          >
            {/* POC-mode floating chip */}
            <AnimatePresence>
              {mode === 'poc' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-6 top-5 z-50 max-w-[calc(100%-48px)] truncate rounded-full border border-flow-poc-soft bg-flow-poc-bg px-3.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-flow-poc sm:whitespace-normal sm:text-[10px] sm:leading-tight shadow-sm"
                >
                  POC PILOT · SINGLE MID-SIZE INTERLOCKED STATION · ANNEXURE C MANDATORY SET
                </motion.div>
              )}
            </AnimatePresence>

            {/* board title block */}
            <div className="absolute z-20 bg-board" style={{ left: BOARD_PAD, top: BOARD_PAD, width: BAND_W }}>
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="" className="h-10 w-10" />
                <h1 className="font-display text-[24px] font-bold tracking-tight text-ink">
                  {titleWords.map((w, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: EASE }}
                    >
                      {w}
                      {i < titleWords.length - 1 ? ' ' : ''}
                    </motion.span>
                  ))}
                </h1>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                Remote diagnostics of signalling assets · seven layers from field sensors to the RDPMS cloud ·
                RDSO/SPN/257/2025 v2.0
              </p>
            </div>

            {/* 1. LAYER: Band background containers (z-0) */}
            {BANDS.map((band, b) => (
              <motion.div
                key={band.num}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + b * 0.09, duration: 0.5, ease: EASE }}
                className={cn(
                  'band-tint absolute rounded-2xl border z-0 bg-band',
                  band.pocTint ? 'band-tint-poc border-flow-poc-soft/40' : 'border-band-border',
                )}
                style={{ left: BOARD_PAD, top: bandY(b), width: BAND_W, height: BAND_H }}
              />
            ))}

            {/* 2. LAYER: Connector SVG layer (z-10, rendered ON TOP of band backgrounds) */}
            <svg
              className="pointer-events-none absolute z-10"
              style={{ left: 0, top: 0 }}
              width={BOARD_W}
              height={BOARD_H}
              viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
            >
              <defs>
                {(['poc', 'full', 'alert', 'dashed'] as FlowType[]).map((t) => (
                  <marker
                    key={t}
                    id={`arrow-${t}`}
                    viewBox="0 0 8 8"
                    refX="8"
                    refY="4"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 0 L8 4 L0 8 z" fill={FLOW_COLOR[t]} />
                  </marker>
                ))}
              </defs>
              {connectors.map((conn, i) => {
                if (!conn.d) return null;
                return (
                  <g key={i} className={scopeClass(conn.scope)}>
                    <path
                      d={conn.d}
                      fill="none"
                      stroke={FLOW_COLOR[conn.type]}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeDasharray={conn.type === 'dashed' ? '6 5' : undefined}
                      markerEnd={conn.type === 'dashed' || conn.noArrow ? undefined : `url(#arrow-${conn.type})`}
                      className="connector-draw"
                      style={{ ['--path-len' as string]: 3000, animationDelay: `${0.4 + (i % 14) * 0.06}s` }}
                    />
                    {conn.terminator &&
                      (conn.terminator.kind === 'open' ? (
                        <circle
                          cx={conn.terminator.x}
                          cy={conn.terminator.y}
                          r={4}
                          fill="#FFFFFF"
                          stroke={FLOW_COLOR[conn.type]}
                          strokeWidth={1.75}
                        />
                      ) : (
                        <circle
                          cx={conn.terminator.x}
                          cy={conn.terminator.y}
                          r={3.5}
                          fill={FLOW_COLOR[conn.type]}
                        />
                      ))}
                  </g>
                );
              })}
            </svg>

            {/* 2.5 LAYER: Band title chips  above lines and particles so text stays clean (z-25) */}
            <div className="pointer-events-none absolute inset-0 z-[25]">
              {BANDS.map((band, b) => {
                const y = bandY(b);
                return (
                  <div
                    key={`h${band.num}`}
                    className={cn(
                      'absolute flex w-auto items-center gap-2.5 rounded-tl-2xl rounded-br-xl pl-4 pr-4',
                      band.pocTint ? 'bg-flow-poc-bg' : 'bg-band',
                    )}
                    style={{ left: BOARD_PAD, top: y, height: HEADER_H }}
                  >
                    <span className="flex h-[26px] w-[30px] items-center justify-center rounded-md bg-flow-poc font-mono text-[13px] font-bold text-white">
                      {band.num}
                    </span>
                    <span className="font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-ink">
                      {band.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 3. LAYER: Flow particles (z-15, under the title chips) */}
            <div className="pointer-events-none absolute inset-0 z-[15]">
              {connectors.map((conn, i) =>
                conn.particles > 0 && conn.d ? (
                  <span key={`p${i}`} className={scopeClass(conn.scope)}>
                    {Array.from({ length: conn.particles }).map((_, j) => (
                      <Particle
                        key={j}
                        d={conn.d}
                        color={FLOW_COLOR[conn.type]}
                        delay={1.2 + ((i * 7 + j * 13) % 20) / 10 + j * 1.1}
                        dur={conn.type === 'alert' ? 2.2 : 2.6 + ((i + j) % 3) * 0.6}
                      />
                    ))}
                  </span>
                ) : null,
              )}
            </div>

            {/* 4. LAYER: Square Cards (z-30, interactive with hover effects) */}
            <div className="absolute inset-0 z-30 pointer-events-auto">
              {BANDS.map((band, b) =>
                band.cards.map((card, i) => {
                  const r = cardRect(b, i);
                  return (
                    <motion.div
                      key={`${b}-${i}`}
                      data-card
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + b * 0.08 + i * 0.03, duration: 0.4, ease: EASE }}
                      className={cn(
                        'diagram-card group absolute flex flex-col justify-between rounded-2xl border bg-container p-3 shadow-xs cursor-pointer',
                        card.dashed
                          ? 'border-dashed border-[#94A3B8]'
                          : card.scope === 'full'
                            ? 'border-flow-full-soft/70 hover:border-flow-full'
                            : card.accent === 'red'
                              ? 'border-alert/30 hover:border-alert'
                              : card.accent === 'amber'
                                ? 'border-amber/30 hover:border-amber'
                                : 'border-band-border hover:border-flow-poc',
                        scopeClass(card.scope),
                      )}
                      style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              'flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-black/5',
                              card.scope === 'full'
                                ? 'bg-tint-full text-flow-full'
                                : card.accent === 'red'
                                  ? 'bg-tint-alert text-alert'
                                  : card.accent === 'amber'
                                    ? 'bg-tint-amber text-amber'
                                    : 'bg-flow-poc-bg text-flow-poc-bright',
                            )}
                          >
                            <Icon3D id={card.icon} className="h-full w-full" />
                          </span>
                        </div>
                        <div className="mt-1.5 text-[11.5px] font-bold leading-tight text-ink line-clamp-2">{card.title}</div>
                      </div>
                      <div className="font-mono text-[9px] leading-[1.3] text-ink-soft whitespace-pre-line">
                        {card.sub}
                      </div>
                      {card.popoverImg && (
                        <div className="pointer-events-none absolute -top-4 left-1/2 z-50 w-56 -translate-x-1/2 -translate-y-full rounded-xl border border-stroke-default bg-container p-1.5 opacity-0 shadow-xl shadow-black/15 transition-opacity duration-200 group-hover:opacity-100">
                          <img src={card.popoverImg} alt="" className="aspect-[16/10] w-full rounded-lg object-cover" />
                          <div className="px-1.5 py-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint">
                            {card.popoverCaption}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                }),
              )}
            </div>

            {/* 5. LAYER: Connector Label Chips (z-40) */}
            <div className="pointer-events-none absolute inset-0 z-40">
              {connectors.map((conn, i) =>
                conn.label && conn.labelAt ? (
                  <div
                    key={`l${i}`}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-band-border bg-container px-3 py-1 font-mono text-[9.5px] font-semibold text-ink-soft shadow-md shadow-black/10',
                      scopeClass(conn.scope),
                    )}
                    style={{ left: conn.labelAt.x, top: conn.labelAt.y }}
                  >
                    {conn.label}
                  </div>
                ) : null,
              )}
            </div>

            {/* 6. LAYER: Right Rail (z-40) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + 7 * 0.09 + 0.12, duration: 0.5, ease: EASE }}
              className="absolute space-y-4 z-40"
              style={{ left: RAIL_X, top: bandY(0), width: RAIL_W }}
            >
              {/* legend */}
              <div className="rounded-xl border border-band-border bg-band p-4 shadow-xs">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">Legend</div>
                <ul className="mt-3 space-y-2.5">
                  {(
                    [
                      ['poc', 'POC PILOT FLOW  field to cloud'],
                      ['full', 'FULL-SYSTEM ADDITIONS'],
                      ['alert', 'ALERT / ESCALATION PATH'],
                      ['dashed', 'PROPOSED / FUTURE (CCSP · OCSP)'],
                    ] as [FlowType, string][]
                  ).map(([t, label]) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <svg width="34" height="8" className="shrink-0">
                        <line
                          x1="0"
                          y1="4"
                          x2="34"
                          y2="4"
                          stroke={FLOW_COLOR[t]}
                          strokeWidth="2"
                          strokeDasharray={t === 'dashed' ? '5 4' : undefined}
                        />
                        <circle cx="17" cy="4" r="3" fill={FLOW_COLOR[t]} />
                      </svg>
                      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">{label}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 pt-1">
                    <span className="h-4 w-[34px] shrink-0 rounded border border-band-border bg-container" />
                    <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">POC-SCOPE COMPONENT</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-4 w-[34px] shrink-0 rounded border border-flow-full-soft bg-tint-full" />
                    <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">FULL-SYSTEM COMPONENT</span>
                  </li>
                </ul>
              </div>

              {/* cross-cutting concerns */}
              <div className="relative rounded-xl border border-dashed border-[#94A3B8] p-4 bg-band/80">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                  Cross-cutting concerns
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint/70">
                  Applies to every layer
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    ['i-shield', 'Security & PKI', 'mTLS · per-vendor CA · CRL/OCSP'],
                    ['i-clock', 'Time Sync', 'GPS/IRNSS + NTP fallback'],
                    ['i-gauge', 'Availability', '§16 formulas · ≥99% POC target'],
                    ['i-file-json', 'Governance', 'RDSO approvals · clause 13.9 AI/ML'],
                    ['i-merge', 'Interoperability', 'Annexure F APIs · CCSP migration'],
                  ].map(([icon, title, sub]) => (
                    <div key={title} className="diagram-card relative flex items-center gap-2.5 rounded-lg border border-band-border bg-container p-2.5 shadow-xs">
                      <span className="absolute -left-[21px] h-2 w-2 rotate-45 rounded-[2px] bg-flow-full" />
                      <Icon id={icon} className="h-4 w-4 shrink-0 text-ink-soft" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-ink">{title}</div>
                        <div className="truncate font-mono text-[8.5px] text-ink-faint">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* notes */}
              <div className="space-y-3 rounded-xl border border-band-border bg-band p-4 shadow-xs">
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-wide text-ink-faint">
                  Applies to every layer  governance is a boundary around the pipeline, never a stage inside it.
                </p>
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-wide text-ink-faint">
                  Dashed taps  each dashed connector marks a control point where policy is enforced and evidence
                  captured.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* hint strip */}
      <div className="mx-auto flex max-w-[1560px] flex-col gap-3 px-2 py-3 font-mono text-[10px] text-hint-text sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-[11px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="relative inline-block h-2 w-16 overflow-hidden">
              <span className="hint-dot absolute h-2 w-2 rounded-full bg-flow-poc" />
            </span>
            <b className="text-flow-poc">Orange</b> is the POC pilot path, sensor to cloud
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative inline-block h-2 w-16 overflow-hidden">
              <span className="hint-dot absolute h-2 w-2 rounded-full bg-alert" style={{ animationDelay: '0.5s' }} />
            </span>
            <b className="text-alert">Red</b> is the alert escalation path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative inline-block h-2 w-16 overflow-hidden">
              <span className="hint-dot absolute h-2 w-2 rounded-full bg-[#94A3B8]" style={{ animationDelay: '1s' }} />
            </span>
            <b className="text-hint-muted">Dashed</b> lines are proposed/future interfaces
          </span>
          <span className="hidden text-hint-dim xl:inline">
            Hover any card to lift it · particles show live flow direction
          </span>
        </div>
        <span className="whitespace-nowrap uppercase tracking-[0.08em] text-hint-dim">Designed to RDSO/SPN/257/2025 v2.0</span>
      </div>
    </section>
  );
}
