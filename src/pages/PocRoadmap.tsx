import { useState } from 'react'
import { motion } from 'framer-motion'
import PhaseCards from '@/components/poc-roadmap/PhaseCards'
import RoadmapCrossLinks from '@/components/poc-roadmap/RoadmapCrossLinks'
import ScopeContract from '@/components/poc-roadmap/ScopeContract'
import TimelineFigure from '@/components/poc-roadmap/TimelineFigure'
import { CharRise, EASE, Eyebrow, FONT_BODY, SpecChip } from '@/components/field-assets/shared'

const STAT_CHIPS = ['6 phases', '5 phase gates', '≥99% availability target', '>60% alert KPIs @ 6 months']

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-page"
      style={{ backgroundImage: "url('/hero-texture.svg')", backgroundRepeat: 'repeat' }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-16 pt-24 lg:pt-32">
        <Eyebrow>POC Pilot · M1–M18</Eyebrow>
        <CharRise
          text="Eighteen months, six phases, one station."
          className="mt-5 max-w-[900px] text-[40px] leading-[1.05] sm:text-[48px]"
          delay={0.1}
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
          className={`${FONT_BODY} mt-6 max-w-[640px] text-[17px] leading-relaxed text-text-secondary`}
        >
          A compliance-led, overlapping phase plan  certifications run in parallel with the lab
          bench so the field never waits on paper.
        </motion.p>
        <div className="mt-8 flex flex-wrap gap-2">
          {STAT_CHIPS.map((c, i) => (
            <SpecChip key={c} delay={0.65 + i * 0.06}>
              {c}
            </SpecChip>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function PocRoadmap() {
  const [activePhase, setActivePhase] = useState<string | null>(null)

  return (
    <div className="min-h-[100dvh] w-full bg-page">
      <Hero />
      <TimelineFigure activePhase={activePhase} onPhaseHover={setActivePhase} />
      <PhaseCards activePhase={activePhase} onPhaseHover={setActivePhase} />
      <ScopeContract />
      <RoadmapCrossLinks />
    </div>
  )
}
