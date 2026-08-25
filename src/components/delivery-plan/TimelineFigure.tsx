import { motion } from 'framer-motion'
import { EASE, FONT_MONO } from '@/components/field-assets/shared'
import { MermaidDiagram } from '@/components/MermaidDiagram'
import { TIMELINE_MERMAID } from '@/lib/mermaidDiagrams'
import { PHASES } from './phases'

const GATES = ['G0', 'G1', 'G2', 'G3', 'G4']

export default function TimelineFigure({
  activePhase,
  onPhaseHover,
}: {
  activePhase: string | null
  onPhaseHover: (id: string | null) => void
}) {
  const scrollToPhase = (id: string) => {
    document.getElementById(`phase-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-3xl border border-stroke-default bg-container p-4 shadow-xl sm:p-6"
      >
        <div className="overflow-x-auto overflow-y-hidden rounded-2xl border border-stroke-default bg-raised p-3 sm:p-4">
          <MermaidDiagram
            chart={TIMELINE_MERMAID}
            ariaLabel="RDPMS Delivery Plan timeline P0 to P5 across M1–M18 with phase gates"
            className="min-h-[360px]"
          />
        </div>

        {/* Interactive phase strip — mirrors Gantt rows, keeps hover ↔ card sync */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => onPhaseHover(p.id)}
              onMouseLeave={() => onPhaseHover(null)}
              onFocus={() => onPhaseHover(p.id)}
              onBlur={() => onPhaseHover(null)}
              onClick={() => scrollToPhase(p.id)}
              aria-label={`Jump to phase ${p.id} — ${p.title}`}
              className={`rounded-xl border px-3 py-2.5 text-left transition-colors duration-300 cursor-pointer ${
                activePhase === p.id
                  ? 'border-flow-required/50 bg-flow-required-bg'
                  : 'border-stroke-default bg-container hover:border-flow-required/30 hover:bg-flow-required-bg/50'
              }`}
            >
              <div className={`${FONT_MONO} text-[10px] font-bold uppercase tracking-wide text-flow-required`}>
                {p.pill} · {p.months}
              </div>
              <div className="mt-0.5 text-[12px] font-semibold leading-snug text-text-primary">{p.title}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className={`${FONT_MONO} text-[11px] uppercase tracking-[0.12em] text-text-tertiary`}>
            RDPMS Delivery Plan — overlapping, compliance-led phasing (M1–M18)
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {GATES.map((g, i) => (
              <motion.span
                key={g}
                initial={{ scale: 1, opacity: 0.5 }}
                whileInView={{ scale: [1, 1.45, 1], opacity: [0.5, 1, 1] }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-1.5"
              >
                <span className="inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-flow-required" />
                <span className={`${FONT_MONO} text-[10px] text-text-secondary`}>{g}</span>
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
