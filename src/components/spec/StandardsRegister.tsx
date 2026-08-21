import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import SectionHeader, { EASE_OUT_EXPO } from './SectionHeader';
import { STANDARDS } from './data';
import type { Standard } from './data';

const ACCENT_CLASSES: Record<Standard['accent'], string> = {
  orange: 'bg-flow-poc/15 text-flow-poc border border-flow-poc/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  slate: 'bg-raised text-text-secondary border border-stroke-default',
};

const DRIFT_PX_PER_S = 12;

export default function StandardsRegister() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);
  const dragState = useRef({ startX: 0, startScroll: 0, dragging: false });

  // slow auto-drift (ping-pong), paused on hover / drag / reduced motion
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    let dir = 1;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!pausedRef.current && !dragState.current.dragging) {
        el.scrollLeft += dir * DRIFT_PX_PER_S * dt;
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max - 1) dir = -1;
        else if (el.scrollLeft <= 1) dir = 1;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    if (!el) return;
    dragState.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      dragging: true,
    };
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging || !stripRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    stripRef.current.scrollLeft = dragState.current.startScroll - dx;
  };

  const endDrag = () => {
    dragState.current.dragging = false;
    setDragging(false);
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
      <SectionHeader
        eyebrow="Standards Register · Referenced Bodies"
        title="Six bodies, zero proprietary silos"
        sub="The design rests strictly on published Indian and international standards  C-DOT CCSP, IEC, ISO/IEC, ITU-T, BIS, and NCCS ITSAR."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-20% 0px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
        className="relative -mx-4 sm:-mx-6"
      >
        {/* gradient fades at edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-page to-transparent sm:w-12"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-page to-transparent sm:w-12"
        />

        <div
          ref={stripRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={() => {
            pausedRef.current = false;
            endDrag();
          }}
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          className={cn(
            'flex select-none gap-4 overflow-x-auto px-4 pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden',
            dragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
        >
          {STANDARDS.map((std) => (
            <motion.article
              key={std.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
              }}
              whileHover={{ y: -6 }}
              className="w-[260px] shrink-0 rounded-xl border border-stroke-default bg-container p-5 transition-all duration-200 hover:border-stroke-active hover:shadow-[0_12px_32px_rgba(9,9,11,0.10)]"
            >
              <span
                className={cn(
                  'inline-block rounded-md px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]',
                  ACCENT_CLASSES[std.accent],
                )}
              >
                {std.body}
              </span>
              <h3 className="mt-3 font-display text-[16px] font-semibold tracking-[-0.01em] text-text-primary">
                {std.name}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-text-secondary">{std.role}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
