import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { animate, motion, useInView } from 'framer-motion';
import { ArrowUp, Check, Minus } from 'lucide-react';
import { Eyebrow, PhotoPlate } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';
import { useDiagram } from '@/lib/diagram-context';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const IN_SCOPE = [
  'Required 7-layer chain at the selected station',
  'Both parameter_f + parameter_e channels',
  'Alert lifecycle incl. feedback & escalation',
  'Requirement module F API stubs to common dashboard',
];
const OUT_SCOPE = [
  'Multi-station rollout',
  'Live SMMS integration',
  'CCSP / oneM2M migration',
  'Third-party real-time subscribers',
];

const SCOPE_STATS: [string, string][] = [
  ['1', 'station'],
  ['4+', 'asset classes'],
  ['2', 'vendors (1 real + 1 simulated)'],
  ['≥99%', 'availability target'],
  ['18', 'months'],
];

function StatCard({ value, label, i }: { value: string; label: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const numRef = useRef<HTMLSpanElement>(null);
  const numeric = /^[0-9]+$/.test(value);
  useEffect(() => {
    if (!inView || !numeric) return;
    const c = animate(0, parseInt(value, 10), {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        if (numRef.current) numRef.current.textContent = String(Math.round(v));
      },
    });
    return () => c.stop();
  }, [inView, value, numeric]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: i * 0.06, duration: 0.4, ease: EASE }}
      className="diagram-card rounded-xl border border-stroke-default bg-container p-4"
    >
      <div className="font-display text-3xl font-bold text-text-primary">
        {numeric ? <span ref={numRef}>0</span> : value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-text-tertiary">{label}</div>
    </motion.div>
  );
}

export default function SectionScope() {
  const { setMode } = useDiagram();
  const navigate = useNavigate();

  const jumpToDiagram = () => {
    setMode('required');
    navigate('/#diagram-top');
  };

  return (
    <section id="dd-scope" className="border-t border-stroke-default bg-page py-24">
      <div className="mx-auto max-w-[1200px] scroll-mt-24 px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <Eyebrow>06 · Required system</Eyebrow>
              <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
                One station. Every mandatory asset. Eighteen months.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                A single mid-size interlocked station carries the mandatory requirement module C asset set: point machines, DC
                track circuits, main / calling-on / shunt signals, IPS  plus equipment rooms F0–F6. A{' '}
                <b className="text-text-primary">simulated second vendor</b> (vendor codes{' '}
                <code className="rounded bg-flow-required/15 border border-flow-required/30 px-1.5 font-mono text-[12px] text-flow-required">vcc</code> /{' '}
                <code className="rounded bg-flow-required/15 border border-flow-required/30 px-1.5 font-mono text-[12px] text-flow-required">vgc</code>) proves
                interoperability end-to-end through the ISP topic namespace.
              </p>
            </Reveal>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Reveal y={40}>
                <div className="rounded-xl border border-ok/25 bg-ok/10 p-5">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ok">In scope</div>
                  <ul className="mt-3 space-y-2.5">
                    {IN_SCOPE.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[13px] text-text-primary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" strokeWidth={3} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal y={40} delay={0.1}>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-blue-400">
                    Site-dependent · Future-compatible
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {OUT_SCOPE.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[13px] text-text-primary">
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" strokeWidth={3} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal className="mt-6">
              <button
                onClick={jumpToDiagram}
                className="group flex items-center gap-2 rounded-lg bg-flow-required px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#C2410C] cursor-pointer"
              >
                View the Required system flow on the diagram
                <ArrowUp className="arrow-nudge h-4 w-4" />
              </button>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <PhotoPlate
                src="/photo-point-machine.jpg"
                caption="Point machine PT-01  the Required system's most-instrumented asset (≥8 sensors, 20 ms throw signatures)."
                chip="EOP · ≥8 sensors"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SCOPE_STATS.map(([v, l], i) => (
                  <StatCard key={l} value={v} label={l} i={i} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
