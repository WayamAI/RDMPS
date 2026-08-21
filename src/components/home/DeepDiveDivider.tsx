import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scrollToId } from '@/lib/lenis';

const CHIPS = [
  { id: 'dd-identifiers', label: '01 Identifiers' },
  { id: 'dd-packets', label: '02 Packets' },
  { id: 'dd-alerts', label: '03 Alerts' },
  { id: 'dd-hard-logic', label: '04 Hard Logic' },
  { id: 'dd-security', label: '05 Security' },
  { id: 'dd-scope', label: '06 POC Scope' },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function DeepDiveDivider() {
  const [active, setActive] = useState(CHIPS[0].id);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const title = 'Deep-Dive Technical Sections';

  useEffect(() => {
    const btn = chipRefs.current[active];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    CHIPS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mt-2 overflow-hidden border-y border-stroke-default">
      {/* control-centre backdrop strip, washed out under paper overlay */}
      <div className="absolute inset-0 bg-page">
        <img
          src="/photo-control-centre.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.14] saturate-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-page via-page/90 to-page/60" />
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(/hero-texture.svg)', backgroundSize: '800px 400px' }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 py-24">
        <div className="font-mono text-xs uppercase tracking-eyebrow text-flow-poc">Technical details</div>
        <h2 className="mt-4 font-display text-[40px] font-bold leading-tight tracking-tight-display text-text-primary">
          {title.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.018, duration: 0.5, ease: EASE }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] text-text-secondary">
          Identifiers · packets · alert lifecycle · hard logic · security · pilot scope  the engineering detail behind
          every band.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="sticky top-20 z-30 mt-10 flex flex-nowrap gap-2 overflow-x-auto rounded-2xl border border-stroke-default bg-container/90 p-2 backdrop-blur [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
        >
          {CHIPS.map((c) => (
            <motion.button
              ref={(el) => { chipRefs.current[c.id] = el; }}
              key={c.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
              onClick={() => scrollToId(c.id)}
              className={cn(
                'shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-colors cursor-pointer',
                active === c.id ? 'bg-flow-poc text-white' : 'bg-raised text-text-tertiary hover:bg-raised-2 hover:text-flow-poc',
              )}
            >
              {c.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
