import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Check, Flag } from 'lucide-react'
import { EASE, FONT_BODY, FONT_DISPLAY, FONT_MONO } from '@/components/field-assets/shared'
import { PHASES } from './phases'
import type { Phase } from './phases'

function PhaseCard({
  phase,
  active,
  onHover,
}: {
  phase: Phase
  active: boolean
  onHover: (id: string | null) => void
}) {
  return (
    <motion.article
      id={`phase-${phase.id}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: EASE }}
      onMouseEnter={() => onHover(phase.id)}
      onMouseLeave={() => onHover(null)}
      className={`relative scroll-mt-28 rounded-2xl border p-6 transition-all duration-300 sm:p-8 ${
        active
          ? 'border-flow-required bg-container shadow-[0_12px_40px_rgba(234,88,12,0.15)]'
          : 'border-stroke-default bg-container hover:border-stroke-active'
      }`}
    >
      {/* node on the spine rail */}
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
        className="absolute -left-[29px] top-9 hidden h-4 w-4 items-center justify-center lg:flex"
      >
        <span
          className={`inline-block h-3.5 w-3.5 rotate-45 rounded-[3px] border-2 ${
            active ? 'border-flow-required bg-flow-required' : 'border-flow-required bg-raised'
          }`}
        />
      </motion.span>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`${FONT_MONO} inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-flow-required px-2 text-[13px] font-bold text-white`}
        >
          {phase.pill}
        </span>
        <h3 className={`${FONT_DISPLAY} text-lg sm:text-[20px] font-semibold tracking-[-0.02em] text-text-primary`}>
          {phase.title}
        </h3>
        <span
          className={`${FONT_MONO} ml-auto rounded-full border border-stroke-default bg-raised px-3 py-1 text-[11px] text-text-secondary`}
        >
          {phase.months}
        </span>
      </div>

      <p className={`${FONT_BODY} mt-4 text-[15px] leading-relaxed text-text-secondary`}>{phase.body}</p>

      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {phase.deliverables.map((d) => (
          <li key={d} className={`${FONT_MONO} flex items-center gap-2 text-[11px] text-text-secondary`}>
            <Check size={13} className="shrink-0 text-ok" strokeWidth={2.5} />
            {d}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-flow-required/30 bg-flow-required/10 px-4 py-3">
        <Flag size={15} className="shrink-0 text-flow-required" />
        <p className={`${FONT_MONO} text-[11px] uppercase tracking-[0.1em] text-flow-required font-semibold`}>
          Gate · {phase.gate}
        </p>
      </div>
    </motion.article>
  )
}

export default function PhaseCards({
  activePhase,
  onPhaseHover,
}: {
  activePhase: string | null
  onPhaseHover: (id: string | null) => void
}) {
  const railRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.75', 'end 0.6'] })
  const spineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-24">
      <div className="mb-12">
        <p className={`${FONT_MONO} text-[11px] uppercase tracking-[0.14em] text-flow-required`}>
          Phase plan · P0–P5
        </p>
        <h2 className={`${FONT_DISPLAY} mt-3 text-[26px] font-bold tracking-tight text-text-primary sm:text-[32px]`}>
          Six phases, five gates.
        </h2>
      </div>

      <div ref={railRef} className="relative">
        {/* spine rail */}
        <div className="absolute bottom-4 left-0 top-4 w-px bg-stroke-default" />
        <motion.div
          style={{ scaleY: spineScale }}
          className="absolute bottom-4 left-0 top-4 w-px origin-top bg-flow-required"
        />

        <div className="flex flex-col gap-6 pl-0 lg:pl-10">
          {PHASES.map((p) => (
            <PhaseCard
              key={p.id}
              phase={p}
              active={activePhase === p.id}
              onHover={onPhaseHover}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
