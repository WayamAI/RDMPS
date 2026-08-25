import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDiagram } from '@/lib/diagram-context';
import { Icon, Icon3D } from '@/components/home/atoms';
import {
  BANDS,
  BOARD_PAD,
  BAND_W,
  HEADER_H,
  RAIL_W,
  RAIL_GAP,
  FLOW_COLOR,
  bandX,
  bandY,
  bandWidth,
  bandHeight,
  boardSize,
  cardRect,
  buildConnectors,
  exportSvg,
  loadIconDataUris,
} from '@/components/home/diagramModel';
import type { FlowType, Scope } from '@/components/home/diagramModel';
import {
  diagramKeyboardAction,
  isScopeVisible,
  shouldHandleDiagramWheel,
} from '@/components/home/diagramInteraction';

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
  return scope === 'required' ? undefined : `flow-scope-nonrequired flow-status-${scope}`;
}

const RAIL_X = BOARD_PAD + BAND_W + RAIL_GAP;

type ViewState = { scale: number; x: number; y: number };

export default function DiagramStage() {
  const { mode, layout, setZoom, registerControls } = useDiagram();
  const board = useMemo(() => boardSize(layout), [layout]);
  const connectors = useMemo(() => buildConnectors(layout), [layout]);
  const visibleConnectors = useMemo(
    () => connectors.filter(({ scope }) => isScopeVisible(mode, scope)),
    [connectors, mode],
  );
  const viewportRef = useRef<HTMLDivElement>(null);
  const iconDataRef = useRef<Record<string, string> | null>(null);
  const [view, setView] = useState<ViewState>({ scale: 0.88, x: 24, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [iconError, setIconError] = useState<string | null>(null);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const panRef = useRef<{ sx: number; sy: number; ox: number; oy: number }>({
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
  });
  const compact = layout === 'portrait';
  const maxColH = useMemo(
    () => Math.max(...BANDS.map((_, i) => bandHeight(i, layout))),
    [layout],
  );

  /** Keep the board covering the viewport — no empty gaps around it. */
  const clampView = useCallback((v: ViewState): ViewState => {
    const vp = viewportRef.current;
    if (!vp) return v;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const bw = board.w * v.scale;
    const bh = board.h * v.scale;
    const x = bw <= vw ? (vw - bw) / 2 : Math.min(0, Math.max(vw - bw, v.x));
    const y = bh <= vh ? (vh - bh) / 2 : Math.min(0, Math.max(vh - bh, v.y));
    return { ...v, x, y };
  }, [board.h, board.w]);

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
        const vw = viewportRef.current?.clientWidth ?? board.w;
        const cx = (vw / 2 - v.x) / v.scale;
        const nx = vw / 2 - cx * clamped;
        return { scale: clamped, x: nx, y: v.y };
      });
      setZoom(clamped);
    },
    [board.w, setZoom, setClampedView],
  );

  const fit = useCallback(() => {
    const vw = viewportRef.current?.clientWidth ?? board.w;
    const scale = Math.min(1.4, Math.max(0.4, (vw - 32) / board.w));
    setClampedView({ scale, x: (vw - board.w * scale) / 2, y: 0 });
    setZoom(scale);
  }, [board.w, setZoom, setClampedView]);

  const downloadSvg = useCallback(async (orientation: 'landscape' | 'portrait' = 'landscape') => {
    try {
      const iconDataUris = iconDataRef.current ?? (await loadIconDataUris());
      iconDataRef.current = iconDataUris;
      setIconError(null);
      const svg = exportSvg(mode, iconDataUris, orientation);
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = orientation === 'portrait' ? 'rdpms-lld-vertical.svg' : 'rdpms-lld.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setIconError(error instanceof Error ? error.message : 'Unable to load diagram icons.');
    }
  }, [mode]);

  useEffect(() => {
    let active = true;
    loadIconDataUris()
      .then((icons) => {
        if (!active) return;
        iconDataRef.current = icons;
        setIconError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setIconError(error instanceof Error ? error.message : 'Unable to load diagram icons.');
      });
    return () => {
      active = false;
    };
  }, []);

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
      if (!shouldHandleDiagramWheel(e)) return;
      e.preventDefault();
      applyZoom(view.scale + (e.deltaY < 0 ? 0.1 : -0.1));
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
    const vw = viewportRef.current?.clientWidth ?? board.w;
    if (vw < board.w * 0.88) fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layoutRef = useRef(layout);
  useEffect(() => {
    if (layoutRef.current === layout) return;
    layoutRef.current = layout;
    fit();
  }, [fit, layout]);

  // clamp the initial view so the board never starts with empty gaps
  useEffect(() => {
    const raf = requestAnimationFrame(() => setClampedView((v) => v));
    return () => cancelAnimationFrame(raf);
  }, [setClampedView]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const action = diagramKeyboardAction(event.key);
      if (!action) return;
      event.preventDefault();
      const panStep = 64;
      if (action === 'zoom-in') return applyZoom(view.scale + 0.1);
      if (action === 'zoom-out') return applyZoom(view.scale - 0.1);
      if (action === 'fit') return fit();
      setClampedView((current) => ({
        ...current,
        x: current.x + (action === 'pan-left' ? panStep : action === 'pan-right' ? -panStep : 0),
        y: current.y + (action === 'pan-up' ? panStep : action === 'pan-down' ? -panStep : 0),
      }));
    },
    [applyZoom, fit, setClampedView, view.scale],
  );

  const titleWords = 'RDPMS · REQUIRED SYSTEM LOW-LEVEL DESIGN'.split(' ');

  return (
    <section className="bg-page px-4 pb-4 pt-4 lg:px-6" aria-labelledby="lld-diagram-title">
      <p id="lld-diagram-description" className="sr-only">
        Interactive 7-layer low-level design from surveyed field assets through IoT devices, station gateway,
        parallel Railway and mobile uplinks, secure middleware, application services, users and integrations.
        Use arrow keys to pan, plus and minus to zoom, zero to fit, or Control plus wheel to zoom.
      </p>
      {iconError ? (
        <p role="alert" className="mx-auto mb-2 max-w-[1560px] rounded-lg border border-alert/30 bg-tint-alert px-3 py-2 text-sm text-alert">
          {iconError} Reload the page before downloading the SVG.
        </p>
      ) : null}
      <div
        ref={viewportRef}
        role="region"
        aria-label="Interactive RDPMS low-level design"
        aria-describedby="lld-diagram-description"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto h-[calc(100dvh-64px-16px)] min-h-[360px] w-full max-w-[1560px] touch-none select-none overflow-hidden focus-visible:ring-2 focus-visible:ring-flow-required focus-visible:ring-offset-2 sm:min-h-[560px]"
        style={{ cursor: 'grab' }}
      >
        <motion.div
          data-testid="diagram-transform"
          data-view-x={view.x}
          data-view-y={view.y}
          data-view-scale={view.scale}
          animate={{ x: view.x, y: view.y, scale: view.scale }}
          transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
          style={{ width: board.w, height: board.h, transformOrigin: '0 0' }}
          className="absolute left-0 top-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            data-flow-mode={mode}
            className="relative rounded-3xl border border-stroke-default bg-board shadow-2xl shadow-black/10"
            style={{ width: board.w, height: board.h }}
          >
            {/* Required-system mode floating chip */}
            <AnimatePresence>
              {mode === 'required' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-6 top-5 z-50 max-w-[calc(100%-48px)] truncate rounded-full border border-flow-required-soft bg-flow-required-bg px-3.5 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-flow-required sm:whitespace-normal sm:text-[10px] sm:leading-tight shadow-sm"
                >
                  REQUIRED · SURVEY-DRIVEN STATION CAPABILITIES
                </motion.div>
              )}
            </AnimatePresence>

            {/* board title block */}
            <div className="absolute z-20 bg-board" style={{ left: BOARD_PAD, top: BOARD_PAD, width: compact ? board.w - BOARD_PAD * 2 : BAND_W }}>
              <div className="flex items-center gap-3">
                <img src="/wayam-favicon.svg" alt="" width="40" height="40" className={cn('rounded-lg', compact ? 'h-8 w-8' : 'h-10 w-10')} />
                <h1 id="lld-diagram-title" className={cn('text-balance font-display font-bold tracking-tight text-ink', compact ? 'text-[18px]' : 'text-[24px]')}>
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
                  band.requiredTint ? 'band-tint-required border-flow-required-soft/40' : 'border-band-border',
                )}
                style={{
                  left: bandX(b, layout),
                  top: bandY(b, layout),
                  width: bandWidth(layout),
                  height: bandHeight(b, layout),
                }}
              />
            ))}

            {/* 2. LAYER: Connector SVG layer (z-10, rendered ON TOP of band backgrounds) */}
            <svg
              className="pointer-events-none absolute z-10"
              style={{ left: 0, top: 0 }}
              width={board.w}
              height={board.h}
              viewBox={`0 0 ${board.w} ${board.h}`}
            >
              <defs>
                {(['required', 'site-dependent', 'future-compatible', 'alert'] as FlowType[]).map((t) => (
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
              {visibleConnectors.map((conn, i) => {
                if (!conn.d) return null;
                return (
                  <g key={i} className={scopeClass(conn.scope)}>
                    <path
                      d={conn.d}
                      fill="none"
                      stroke={FLOW_COLOR[conn.type]}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeDasharray={conn.dashed ? '6 5' : undefined}
                      markerEnd={conn.dashed || conn.noArrow ? undefined : `url(#arrow-${conn.type})`}
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
                const y = bandY(b, layout);
                return (
                  <div
                    key={`h${band.num}`}
                    className={cn(
                      'absolute flex items-center gap-2 rounded-tl-2xl rounded-br-xl pl-2 pr-2',
                      compact ? 'w-auto max-w-full flex-wrap py-1' : 'w-auto gap-2.5 pl-4 pr-4',
                      band.requiredTint ? 'bg-flow-required-bg' : 'bg-band',
                    )}
                    style={{
                      left: bandX(b, layout),
                      top: y,
                      width: compact ? bandWidth(layout) : undefined,
                      height: compact ? 52 : HEADER_H,
                    }}
                  >
                    <span className={cn(
                      'flex items-center justify-center rounded-md bg-flow-required font-mono font-bold text-white',
                      compact ? 'h-5 w-6 text-[11px]' : 'h-[26px] w-[30px] text-[13px]',
                    )}>
                      {band.num}
                    </span>
                    <span className={cn(
                      'font-display font-semibold uppercase text-ink',
                      compact ? 'max-w-[210px] text-[8px] leading-tight tracking-[0.04em]' : 'text-[12px] tracking-[0.08em]',
                    )}>
                      {band.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 3. LAYER: Flow particles (z-15, under the title chips) */}
            <div className="pointer-events-none absolute inset-0 z-[15]">
              {visibleConnectors.map((conn, i) =>
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
                  if (!isScopeVisible(mode, card.status)) return null;
                  const r = cardRect(b, i, layout);
                  const cardKey = `${b}-${i}`;
                  const detailsId = card.popoverImg ? `card-details-${cardKey}` : undefined;
                  return (
                    <motion.article
                      key={cardKey}
                      data-card
                      tabIndex={0}
                      aria-label={`${card.title}. ${card.sub.replace(/\n/g, ' ')}. Status: ${card.status}.`}
                      aria-describedby={detailsId}
                      onFocus={() => setFocusedCard(cardKey)}
                      onBlur={() => setFocusedCard((current) => (current === cardKey ? null : current))}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + b * 0.08 + i * 0.03, duration: 0.4, ease: EASE }}
                      className={cn(
                        'diagram-card group absolute flex flex-col justify-between rounded-2xl border bg-container shadow-xs focus-visible:ring-2 focus-visible:ring-flow-required focus-visible:ring-offset-2',
                        compact ? 'p-2' : 'p-3',
                        card.status === 'future-compatible'
                          ? 'border-dashed border-[#94A3B8]'
                          : card.status === 'site-dependent'
                            ? 'border-flow-all-soft/70 hover:border-flow-all'
                            : card.accent === 'red'
                              ? 'border-alert/30 hover:border-alert'
                              : card.accent === 'amber'
                                ? 'border-amber/30 hover:border-amber'
                                : 'border-band-border hover:border-flow-required',
                        scopeClass(card.status),
                      )}
                      style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              'flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/5',
                              compact ? 'h-11 w-11' : 'h-16 w-16',
                            )}
                          >
                            <Icon3D id={card.icon} className="h-full w-full" />
                          </span>
                          <span
                            className={cn(
                              'max-w-[62px] rounded-full px-1.5 py-1 text-center font-mono text-[7px] font-bold uppercase leading-tight',
                              card.status === 'required'
                                ? 'bg-flow-required-bg text-flow-required'
                                : card.status === 'site-dependent'
                                  ? 'bg-tint-all text-flow-all'
                                  : 'bg-zinc-100 text-zinc-500',
                            )}
                          >
                            {card.status}
                          </span>
                        </div>
                        <div className={cn('mt-1.5 font-bold leading-tight text-ink line-clamp-2', compact ? 'text-[9.5px]' : 'text-[11.5px]')}>{card.title}</div>
                      </div>
                      <div className={cn('font-mono leading-[1.3] text-ink-soft whitespace-pre-line', compact ? 'line-clamp-2 text-[7.5px]' : 'text-[9px]')}>
                        {card.sub}
                      </div>
                      {card.popoverImg && (
                        <figure
                          id={detailsId}
                          aria-hidden={focusedCard !== cardKey}
                          className="pointer-events-none absolute -top-4 left-1/2 z-50 w-56 -translate-x-1/2 -translate-y-full rounded-xl border border-stroke-default bg-container p-1.5 opacity-0 shadow-xl shadow-black/15 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                        >
                          <img src={card.popoverImg} alt="" width="224" height="140" loading="lazy" className="aspect-[16/10] w-full rounded-lg object-cover" />
                          <figcaption className="px-1.5 py-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint">
                            {card.popoverCaption}
                          </figcaption>
                        </figure>
                      )}
                    </motion.article>
                  );
                }),
              )}
            </div>

            {/* 5. LAYER: Connector Label Chips (z-40) */}
            <div className="pointer-events-none absolute inset-0 z-40">
              {visibleConnectors.map((conn, i) =>
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

            {/* 6. LAYER: Right Rail (z-40) or bottom rail in vertical view */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + 7 * 0.09 + 0.12, duration: 0.5, ease: EASE }}
              className={cn('absolute z-40', compact ? 'flex flex-col justify-center gap-2 rounded-xl border border-band-border bg-band px-4 py-3' : 'space-y-4')}
              style={
                compact
                  ? {
                      left: BOARD_PAD,
                      top: bandY(0, layout) + maxColH + 16,
                      width: board.w - BOARD_PAD * 2,
                      height: 108,
                    }
                  : { left: RAIL_X, top: bandY(0), width: RAIL_W }
              }
            >
              {compact ? (
                <>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">Legend</span>
                    {(
                      [
                        ['required', 'REQUIRED · DELIVERED CAPABILITY'],
                        ['site-dependent', 'SITE-DEPENDENT · MEDIA CHOSEN LOCALLY'],
                        ['alert', 'ALERT / ESCALATION PATH'],
                        ['future-compatible', 'FUTURE-COMPATIBLE · NOT CURRENT DELIVERY'],
                      ].filter(([status]) => mode === 'all' || status === 'required' || status === 'alert') as [FlowType, string][]
                    ).map(([t, label]) => (
                      <span key={t} className="flex items-center gap-2">
                        <svg width="28" height="8" className="shrink-0">
                          <line
                            x1="0"
                            y1="4"
                            x2="28"
                            y2="4"
                            stroke={FLOW_COLOR[t]}
                            strokeWidth="2"
                            strokeDasharray={t === 'future-compatible' ? '5 4' : undefined}
                          />
                          <circle cx="14" cy="4" r="3" fill={FLOW_COLOR[t]} />
                        </svg>
                        <span className="font-mono text-[8px] uppercase tracking-wide text-ink-soft">{label}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                      Cross-cutting concerns
                    </span>
                    {['Security & PKI', 'Time Sync', 'Health', 'Governance', 'Interoperability'].map((title) => (
                      <span
                        key={title}
                        className="rounded-md border border-band-border bg-container px-2 py-1 font-mono text-[9px] font-semibold text-ink"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <>
              {/* legend */}
              <div className="rounded-xl border border-band-border bg-band p-4 shadow-xs">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">Legend</div>
                <ul className="mt-3 space-y-2.5">
                  {(
                    [
                      ['required', 'REQUIRED · DELIVERED CAPABILITY'],
                      ['site-dependent', 'SITE-DEPENDENT · MEDIA CHOSEN LOCALLY'],
                      ['alert', 'ALERT / ESCALATION PATH'],
                      ['future-compatible', 'FUTURE-COMPATIBLE · NOT CURRENT DELIVERY'],
                    ].filter(([status]) => mode === 'all' || status === 'required' || status === 'alert') as [FlowType, string][]
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
                          strokeDasharray={t === 'future-compatible' ? '5 4' : undefined}
                        />
                        <circle cx="17" cy="4" r="3" fill={FLOW_COLOR[t]} />
                      </svg>
                      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">{label}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 pt-1">
                    <span className="h-4 w-[34px] shrink-0 rounded border border-band-border bg-container" />
                    <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">REQUIRED-SYSTEM COMPONENT</span>
                  </li>
                  {mode === 'all' ? (
                    <li className="flex items-center gap-2.5">
                      <span className="h-4 w-[34px] shrink-0 rounded border border-flow-all-soft bg-tint-all" />
                      <span className="font-mono text-[9px] uppercase tracking-wide text-ink-soft">SITE-DEPENDENT COMPONENT</span>
                    </li>
                  ) : null}
                </ul>
              </div>

              {/* cross-cutting concerns */}
              <div className="relative rounded-xl border border-dashed border-[#94A3B8] p-4 bg-band/80">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                  Cross-cutting concerns
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-wide text-ink-faint/70">
                  Scope stated for each control
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    ['i-shield', 'Security & PKI', 'Gateway, broker & platform certificates · CRL/OCSP'],
                    ['i-clock', 'Time Sync', 'Gateway timestamping · GPS/IRNSS fallback'],
                    ['i-gauge', 'Health', 'IoT, gateway & station-uplink visibility'],
                    ['i-file-json', 'Governance', 'Application logic, models & audit evidence'],
                    ['i-merge', 'Interoperability', 'Gateway conversion · maintenance/dashboard APIs'],
                  ].map(([icon, title, sub]) => (
                    <div key={title} className="diagram-card relative flex items-center gap-2.5 rounded-lg border border-band-border bg-container p-2.5 shadow-xs">
                      <span className="absolute -left-[21px] h-2 w-2 rotate-45 rounded-[2px] bg-flow-all" />
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
                  Each control names the components it governs; no scope is implied beyond those components.
                </p>
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-wide text-ink-faint">
                  Dashed grey paths are future-compatible only. Dashed orange paths are required control or
                  feedback links.
                </p>
              </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* hint strip */}
      <div className="mx-auto flex max-w-[1560px] flex-col gap-3 px-2 py-3 font-mono text-[10px] text-hint-text sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-[11px]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="relative inline-block h-2 w-16 overflow-hidden">
              <span className="hint-dot absolute h-2 w-2 rounded-full bg-flow-required" />
            </span>
            <b className="text-flow-required">Orange</b> is required delivery, field to users
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
            <b className="text-hint-muted">Grey dashed</b> is future-compatible; blue is site-dependent
          </span>
          <span className="hidden text-hint-dim xl:inline">
            Hover or focus any card for details · particles show live flow direction
          </span>
        </div>
        <span className="whitespace-nowrap uppercase tracking-[0.08em] text-hint-dim">Designed to RDSO/SPN/257/2025 v2.0</span>
      </div>
    </section>
  );
}
