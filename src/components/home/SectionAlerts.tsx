import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { Eyebrow, SpecChip } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';
import { Landmark, LayoutDashboard, Monitor, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ---------------- state machine ----------------

interface SmNode {
  id: string;
  short: string;
  x: number;
  y: number;
  color: string;
  tint: string;
  sub: string;
  entry: string;
  exit: string;
  detail: string;
}

const NW = 152;
const NH = 58;

const NODES: SmNode[] = [
  {
    id: 'NORMAL',
    short: 'NORMAL',
    x: 110,
    y: 64,
    color: '#15803D',
    tint: '#F0FDF4',
    sub: 'parameter_f · 5 s',
    entry: 'All parameters inside LD bands',
    exit: 'Any value leaves its LD band',
    detail:
      'All parameters inside LD bands. parameter_f telemetry flows at 5 s; rolling averages update per asset state.',
  },
  {
    id: 'PREDICTIVE',
    short: 'PREDICTIVE',
    x: 360,
    y: 64,
    color: '#B45309',
    tint: '#FFFBEB',
    sub: 'LD1 / LD2 · dwell 15 s',
    entry: 'LD1/LD2 crossed and held 15 s',
    exit: 'Value returns to band, or HD breach',
    detail:
      'A value crosses LD1/LD2 and stays out for the 15 s prediction dwell. Predictive alert raised; maintenance advised.',
  },
  {
    id: 'FAILURE',
    short: 'FAILURE',
    x: 610,
    y: 64,
    color: '#DC2626',
    tint: '#FEF2F2',
    sub: 'HD breach · dwell 10 s',
    entry: 'HD threshold held 10 s',
    exit: 'Maintainer ack + feedback class',
    detail:
      'HD threshold breach held for the 10 s failure dwell. Failure alert fires within ≤1 min end-to-end; escalation ladder starts.',
  },
  {
    id: 'HEALTH DEGRADED',
    short: 'HEALTH DEGRADED',
    x: 110,
    y: 216,
    color: '#2563EB',
    tint: '#EFF6FF',
    sub: '2 health packets missed',
    entry: 'Two 30-min health packets missed',
    exit: 'Health packet received',
    detail:
      'Two consecutive 30-min health packets missed — the asset is assumed blind, not healthy. Comms alert raised.',
  },
  {
    id: 'MAINTENANCE MODE',
    short: 'MAINTENANCE MODE',
    x: 360,
    y: 216,
    color: '#52525B',
    tint: '#F4F4F6',
    sub: 'alerts suppressed',
    entry: 'Set by JE/SSE for planned work',
    exit: 'Cleared by JE/SSE',
    detail:
      'Set by JE/SSE during planned work. Suppresses new alerts for the asset; telemetry continues to flow and is tagged.',
  },
];

const W = 720;
const H = 310;

/** Orthogonal path with rounded corners, so edges read as routed wiring not raw polylines. */
function ortho(pts: [number, number][], r = 12) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    d += ` L ${cx - ((cx - px) / d1) * rr} ${cy - ((cy - py) / d1) * rr}`;
    d += ` Q ${cx} ${cy} ${cx + ((nx - cx) / d2) * rr} ${cy + ((ny - cy) / d2) * rr}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
}

interface SmEdge {
  d: string;
  label: string;
  at: [number, number];
  tone: 'step' | 'branch' | 'return';
}

const EDGES: SmEdge[] = [
  { d: 'M 186 64 L 278 64', label: 'dwell 15 s', at: [232, 64], tone: 'step' },
  { d: 'M 436 64 L 528 64', label: 'dwell 10 s', at: [482, 64], tone: 'step' },
  { d: 'M 110 93 L 110 181', label: 'health missed 2×', at: [110, 137], tone: 'branch' },
  { d: 'M 360 93 L 360 181', label: 'maintenance set', at: [360, 137], tone: 'branch' },
  {
    d: ortho([
      [610, 93],
      [610, 288],
      [18, 288],
      [18, 64],
      [28, 64],
    ]),
    label: 'feedback closed · ack',
    at: [400, 288],
    tone: 'return',
  },
];

const EDGE_STROKE: Record<SmEdge['tone'], string> = {
  step: '#DC2626',
  branch: '#A1A1AA',
  return: '#71717A',
};

const TOKEN_PATH = ortho([
  [110, 64],
  [610, 64],
  [610, 288],
  [18, 288],
  [18, 64],
  [110, 64],
]);

function EdgeLabel({ text, at, tone }: { text: string; at: [number, number]; tone: SmEdge['tone'] }) {
  const w = text.length * 5.1 + 20;
  return (
    <g>
      <rect x={at[0] - w / 2} y={at[1] - 10} width={w} height={20} rx={10} fill="#FFFFFF" stroke="#E4E4E7" />
      <text
        x={at[0]}
        y={at[1] + 3.5}
        textAnchor="middle"
        fill={tone === 'step' ? '#DC2626' : '#52525B'}
        fontFamily="Geist, sans-serif"
        fontSize="9"
        fontWeight="600"
      >
        {text}
      </text>
    </g>
  );
}

function StateMachine() {
  const [selected, setSelected] = useState<SmNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // selecting a state freezes the traversal token
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (selected) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [selected]);

  return (
    <div className="grid gap-6 lg:grid-cols-[62fr_38fr]">
      <div className="relative overflow-hidden rounded-2xl border border-stroke-default bg-container p-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
            Alert state machine
          </div>
          <SpecChip>8 s traversal loop</SpecChip>
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full">
          <defs>
            {(['step', 'branch', 'return'] as SmEdge['tone'][]).map((t) => (
              <marker
                key={t}
                id={`sm-arrow-${t}`}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L8 4 L0 8 z" fill={EDGE_STROKE[t]} />
              </marker>
            ))}
          </defs>

          {EDGES.map((e, i) => (
            <path
              key={`e${i}`}
              d={e.d}
              fill="none"
              stroke={EDGE_STROKE[e.tone]}
              strokeWidth="1.5"
              strokeDasharray={e.tone === 'branch' ? '5 4' : undefined}
              markerEnd={`url(#sm-arrow-${e.tone})`}
            />
          ))}

          {NODES.map((n) => {
            const active = selected?.id === n.id;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                onClick={() => setSelected(active ? null : n)}
                className="cursor-pointer"
                opacity={selected && !active ? 0.42 : 1}
                style={{ transition: 'opacity 0.3s' }}
              >
                <rect
                  x={-NW / 2}
                  y={-NH / 2}
                  width={NW}
                  height={NH}
                  rx="12"
                  fill={n.tint}
                  stroke={n.color}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <rect x={-NW / 2 + 1} y={-NH / 2 + 10} width="3" height={NH - 20} rx="1.5" fill={n.color} />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill={n.color}
                  fontFamily="Geist, sans-serif"
                  fontSize="12"
                  fontWeight="700"
                >
                  {n.short}
                </text>
                <text x="0" y="12" textAnchor="middle" fill="#52525B" fontFamily="Geist, sans-serif" fontSize="8.5">
                  {n.sub}
                </text>
              </g>
            );
          })}

          {EDGES.map((e, i) => (
            <EdgeLabel key={`l${i}`} text={e.label} at={e.at} tone={e.tone} />
          ))}

          {/* traversal token  rides the loop in viewBox space */}
          <g className="state-token-svg">
            <circle r="7" fill="#DC2626" opacity="0.18" />
            <circle r="4" fill="#DC2626" />
            <animateMotion dur="8s" repeatCount="indefinite" path={TOKEN_PATH} />
          </g>
        </svg>
        <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
          <span>token walks NORMAL → PREDICTIVE → FAILURE → ack → NORMAL</span>
          {selected && (
            <button onClick={() => setSelected(null)} className="text-flow-poc underline cursor-pointer">
              resume loop
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-stroke-default bg-container p-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">State detail</div>
        {selected ? (
          <>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: selected.color }} />
              <span className="font-display text-xl font-bold" style={{ color: selected.color }}>
                {selected.id}
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">{selected.detail}</p>
            <dl className="mt-4 space-y-2">
              {(
                [
                  ['Entry', selected.entry],
                  ['Exit', selected.exit],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex gap-3 rounded-lg border border-stroke-muted bg-raised px-3 py-2">
                  <dt className="w-10 shrink-0 font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
                    {k}
                  </dt>
                  <dd className="font-mono text-[11px] leading-snug text-text-secondary">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              Click any state to pause the traversal token and read its entry/exit conditions. Alerts are raised
              one-per-asset and cleared only through the feedback workflow.
            </p>
            <ul className="mt-4 space-y-2">
              {NODES.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setSelected(n)}
                    className="flex w-full items-center gap-2.5 rounded-lg border border-stroke-muted bg-raised px-3 py-2 text-left transition-colors hover:border-stroke-active cursor-pointer"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: n.color }} />
                    <span className="font-mono text-[11px] font-semibold text-text-primary">{n.id}</span>
                    <span className="ml-auto font-mono text-[10px] text-text-tertiary">{n.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <SpecChip>≤1 min event-to-alert</SpecChip>
          <SpecChip tone="slate">one-alert-per-asset</SpecChip>
        </div>
      </div>
    </div>
  );
}

// ---------------- escalation ladder (GSAP pinned) ----------------

const TIERS = [
  { role: 'Maintainer', when: 'immediate', channel: 'mobile push + Ack', Icon: Smartphone },
  { role: 'JE / SE', when: '30 min', channel: 'web dashboard', Icon: Monitor },
  { role: 'SSE', when: '1 h', channel: 'web dashboard', Icon: LayoutDashboard },
  { role: 'ASTE / DSTE', when: '2 h', channel: 'divisional console', Icon: Landmark },
];

function EscalationLadder() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-tier]', el);
      const nodes = gsap.utils.toArray<HTMLElement>('[data-node]', el);
      const meters = gsap.utils.toArray<HTMLElement>('[data-meter]', el);
      const bar = el.querySelector<HTMLElement>('[data-progress]');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 15%',
          end: '+=150%',
          scrub: 0.6,
          pin: true,
        },
      });
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 4, ease: 'none' }, 0);
      cards.forEach((card, i) => {
        // no y-shift: the cards stay locked to the rail, only their state reads as "reached"
        tl.to(card, { borderColor: 'rgba(220,38,38,0.45)', boxShadow: '0 10px 30px rgba(220,38,38,0.10)', duration: 0.4 }, i + 0.4);
        tl.to(nodes[i], { backgroundColor: '#DC2626', borderColor: '#DC2626', color: '#FFFFFF', duration: 0.4 }, i + 0.4);
        tl.to(meters[i], { scaleX: 1, duration: 0.4 }, i + 0.4);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="rounded-2xl border border-stroke-default bg-container p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
          Escalation ladder · auto-escalates if unacknowledged
        </div>
        <SpecChip>≤1 min event-to-alert latency · one-alert-per-asset rule</SpecChip>
      </div>

      <div className="relative mt-10">
        {/* the rail the tier nodes sit on */}
        <div className="absolute left-0 right-0 top-4 h-px bg-band-border" />
        <div
          data-progress
          className="absolute left-0 right-0 top-4 h-px origin-left bg-alert"
          style={{ transform: 'scaleX(0)' }}
        />

        <div className="relative grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TIERS.map((t, i) => (
            <div key={t.role} className="relative pt-11">
              <span
                data-node
                className="absolute left-1/2 top-4 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-band-border bg-container font-mono text-[11px] font-bold text-text-tertiary"
              >
                {i + 1}
              </span>

              <div
                data-tier
                className="flex h-full flex-col rounded-xl border border-stroke-default bg-container p-4 transition-none"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-alert/20 bg-alert/10 text-alert">
                    <t.Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="rounded-full border border-alert/20 bg-alert/10 px-2 py-0.5 font-mono text-[10px] font-bold text-alert">
                    T+{t.when}
                  </span>
                </div>

                <div className="mt-3 font-display text-[15px] font-semibold leading-tight text-text-primary">
                  {t.role}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
                  {t.channel}
                </div>

                {/* severity grows down the ladder */}
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-raised-2">
                  <div
                    data-meter
                    className="h-full origin-left rounded-full bg-alert"
                    style={{ width: `${25 * (i + 1)}%`, transform: 'scaleX(0)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- KPI count-up ----------------

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function Meter({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className="mt-3">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-raised-2">
        <motion.div
          className="h-full rounded-full bg-ok"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wide text-text-quaternary">
        <span>0%</span>
        <span className="text-ok">target ≥60% · 6 mo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

const KPIS = [
  { metric: 'fail_alert_per', note: 'Failure alerts that a maintainer confirmed as a true failure.' },
  { metric: 'pred_alert_per', note: 'Predictive alerts that matured into a real failure in time.' },
  { metric: 'actual_fail_alert_per', note: 'Actual failures that the system raised an alert for.' },
];

const FEEDBACK = [
  ['T', 'true  confirmed failure', 'bg-ok'],
  ['PT', 'partially true', 'bg-amber'],
  ['F', 'false alarm', 'bg-alert'],
  ['M', 'missed  found without alert', 'bg-slate-400'],
] as const;

export default function SectionAlerts() {
  return (
    <section id="dd-alerts" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24">
      <Reveal>
        <Eyebrow className="text-alert">03 · Alert lifecycle</Eyebrow>
        <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
          From threshold breach to a maintainer's thumb.
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <StateMachine />
      </Reveal>

      <div className="mt-10">
        <EscalationLadder />
      </div>

      <Reveal className="mt-10">
        <div className="grid items-start gap-6 lg:grid-cols-[42fr_58fr]">
          <div className="rounded-2xl border border-stroke-default bg-container p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              Feedback classes · JE/SSE arbitration → ML labelling pipeline
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {FEEDBACK.map(([k, v, dot]) => (
                <li
                  key={k}
                  className="flex items-center gap-2.5 rounded-lg border border-stroke-muted bg-raised px-3 py-2.5"
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold text-white',
                      dot,
                    )}
                  >
                    {k}
                  </span>
                  <span className="text-[11px] leading-snug text-text-secondary">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
              Every alert returns as maintainer feedback. Disagreements are arbitrated by JE/SSE, and the final label
              feeds the ML training pipeline  closing the loop between hard logic and AI analytics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {KPIS.map((k) => (
              <div
                key={k.metric}
                className="diagram-card flex flex-col rounded-xl border border-stroke-default bg-container p-5"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
                  {k.metric}
                </div>
                <div className="mt-2 font-display text-[38px] font-bold leading-none tracking-tight-display text-text-primary">
                  <CountUp to={60} suffix="%" />
                </div>
                <Meter value={60} />
                <p className="mt-4 border-t border-stroke-muted pt-3 text-[11px] leading-snug text-text-secondary">
                  {k.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
