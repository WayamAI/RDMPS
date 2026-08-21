import { motion } from 'framer-motion'
import AssetGallery from '@/components/field-assets/AssetGallery'
import BandCrossLink from '@/components/field-assets/BandCrossLink'
import SensorTechStrip from '@/components/field-assets/SensorTechStrip'
import { CharRise, EASE, Eyebrow, FONT_BODY, FONT_MONO, SpecChip } from '@/components/field-assets/shared'

const HERO_CHIPS = ['IEC 60688 Class 1', '2% accuracy', 'drift <2%/yr', '≥2.5 kV isolation', '≤20 ms scan']

function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-page"
      style={{ backgroundImage: "url('/hero-texture.svg')", backgroundRepeat: 'repeat' }}
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-32">
        <div>
          <Eyebrow>Layer 01 · Field Assets &amp; Sensors</Eyebrow>
          <CharRise
            text="The assets under the microscope."
            className="mt-5 text-[32px] leading-[1.05] sm:text-[40px] lg:text-[48px]"
            delay={0.1}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            className={`${FONT_BODY} mt-6 max-w-[640px] text-[17px] leading-relaxed text-text-secondary`}
          >
            Every band in the LLD begins here  at the rail. Non-intrusive sensors watch point
            machines, track circuits, signals and power systems without touching a single live
            conductor.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-2">
            {HERO_CHIPS.map((c, i) => (
              <SpecChip key={c} delay={0.55 + i * 0.06}>
                {c}
              </SpecChip>
            ))}
          </div>
        </div>

        {/* Tilted hero plate */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 60, rotate: 4, boxShadow: '0 4px 12px rgba(9,9,11,0.08)' }}
            animate={{ opacity: 1, x: 0, rotate: 1.5, boxShadow: '0 24px 56px rgba(9,9,11,0.16)' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            className="relative rounded-2xl border-2 border-flow-poc/40 bg-raised p-2"
          >
            <img
              src="/photo-point-machine.jpg"
              alt="Point machine at the POC pilot station"
              className="aspect-[16/10] w-full rounded-xl object-cover"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`${FONT_MONO} mt-4 text-right text-[10px] uppercase tracking-[0.12em] text-text-quaternary`}
          >
            Point machine, mid-size interlocked station  POC pilot site
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default function FieldAssets() {
  return (
    <div className="min-h-[100dvh] w-full bg-page">
      <Hero />
      <AssetGallery />
      <SensorTechStrip />
      <BandCrossLink />
    </div>
  )
}
