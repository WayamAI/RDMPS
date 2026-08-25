import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eyebrow, SpecChip } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STATS: [number, string, string][] = [
  [65, '', 'prediction logics'],
  [77, '', 'failure logics'],
  [7, '', 'asset groups'],
  [15, ' s', 'prediction dwell'],
  [10, ' s', 'failure dwell'],
  [15, '-day', 'rolling averages'],
];

const LOGIC_TABLE: [string, string, string][] = [
  ['Point machines', 'LD1 = 80 · LD2 = 90', 'HD = 150'],
  ['DC track circuits', 'LD1 = 80 · LD2 = 50 · LD3 = 90', 'HD1 = 120 · HD2 = 150'],
  ['Signals', 'LD = 80', 'HD = 120'],
  ['IPS', 'LD = 90', ''],
];

function StatChip({ value, suffix, label, i }: { value: number; suffix: string; label: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        if (numRef.current) numRef.current.textContent = String(Math.round(v));
      },
    });
    return () => c.stop();
  }, [inView, value]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
      className="diagram-card rounded-xl border border-stroke-default bg-container px-4 py-3 shadow-xs"
    >
      <div className="font-display text-2xl font-bold text-text-primary">
        <span ref={numRef}>0</span>
        <span className="text-base font-semibold text-text-secondary">{suffix}</span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">{label}</div>
    </motion.div>
  );
}

/** 15-day rolling-average band with a live trace drifting toward LD1. */
function AverageChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const trace =
    'M 0 46 C 30 44, 50 47, 80 45 S 130 48, 160 46 S 210 50, 240 52 S 290 58, 320 62 S 370 72, 400 78';
  return (
    <svg ref={ref} viewBox="0 0 400 110" className="w-full">
      {/* average band */}
      <rect x="0" y="34" width="400" height="24" fill="rgba(34, 197, 94, 0.12)" />
      <line x1="0" y1="46" x2="400" y2="46" strokeWidth="1" strokeDasharray="3 3" className="stroke-ok" />
      <text x="6" y="30" className="fill-ok font-mono text-[8px] font-semibold">
        15-DAY ROLLING AVERAGE (per state: N→R)
      </text>
      {/* LD1 line */}
      <line x1="0" y1="86" x2="400" y2="86" strokeWidth="1.5" strokeDasharray="6 4" className="stroke-amber" />
      <text x="6" y="98" className="fill-amber font-mono text-[8px] font-semibold">
        LD1 = 80
      </text>
      {/* live trace */}
      <motion.path
        d={trace}
        fill="none"
        strokeWidth="2"
        className="stroke-flow-required"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  );
}

/** Dwell-timer pill bars that fill on hover of the simulated breach trace. */
function DwellTimer({ label, seconds }: { label: string; seconds: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer rounded-xl border border-stroke-default bg-container p-4 hover:border-stroke-active transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-text-primary">{label}</span>
        <span className="font-mono text-[11px] text-amber font-bold">{seconds} s</span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-raised">
        <motion.div
          className="h-full rounded-full bg-amber"
          initial={false}
          animate={{ width: hover ? '100%' : '12%' }}
          transition={{ duration: hover ? seconds / 4 : 0.3, ease: 'linear' }}
        />
      </div>
      <div className="mt-2 font-mono text-[10px] text-text-tertiary">
        {hover ? 'breach persisting  dwell timer running…' : 'hover to simulate a sustained breach'}
      </div>
    </div>
  );
}

export default function SectionHardLogic() {
  return (
    <section id="dd-hard-logic" className="border-t border-stroke-default bg-page py-24">
      <div className="mx-auto max-w-[1200px] scroll-mt-24 px-6">
        <Reveal>
          <Eyebrow>04 · Requirement module C</Eyebrow>
          <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
            142 deterministic logics before any AI speaks.
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STATS.map(([v, s, l], i) => (
              <StatChip key={l} value={v} suffix={s} label={l} i={i} />
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-stroke-default bg-container">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stroke-default bg-raised">
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-text-tertiary">Asset group</th>
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-amber">Low thresholds</th>
                    <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-alert">High thresholds</th>
                  </tr>
                </thead>
                <tbody>
                  {LOGIC_TABLE.map(([g, lo, hi], i) => (
                    <tr key={g} className={cn('border-b border-stroke-muted last:border-0', i % 2 === 1 && 'bg-raised/30')}>
                      <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">{g}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-amber">{lo}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-alert">{hi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-text-secondary">
              LD/HD constants are validated against 15-day rolling averages computed <b className="text-text-primary">per asset state</b>  a point
              machine's N→R throw signature is averaged separately from R→N, so drift is detected against the right
              baseline.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-stroke-default bg-container p-4">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
                State-conditional average vs live trace
              </div>
              <AverageChart />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DwellTimer label="Prediction dwell" seconds={15} />
              <DwellTimer label="Failure dwell" seconds={10} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <SpecChip>dwell filters transient spikes</SpecChip>
              <SpecChip tone="slate">Requirement module C mandatory set</SpecChip>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
