import { motion } from 'framer-motion'
import { Gauge, Magnet, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EASE, FONT_BODY, FONT_DISPLAY, FONT_MONO } from './shared'

const COLS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Magnet,
    title: 'Non-intrusive current',
    body: 'Hall-effect split-core CTs clamp around conductors; the signalling circuit never sees the sensor.',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated voltage',
    body: '≥2.5 kV withstand isolation between measured circuit and acquisition electronics.',
  },
  {
    icon: Gauge,
    title: 'Metrology',
    body: 'IEC 60688 Class 1 transducers · 2% accuracy · drift <2% per year with calibration evidence per §16.',
  },
]

function TechColumn({ icon: Icon, title, body, index }: { icon: LucideIcon; title: string; body: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
      className="flex flex-col items-start gap-4"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* draw-in ring behind the icon */}
        <motion.svg
          viewBox="0 0 64 64"
          className="absolute inset-0 h-full w-full"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: index * 0.12 + 0.2 }}
          />
        </motion.svg>
        <Icon size={26} className="text-flow-poc" strokeWidth={1.5} />
      </div>
      <h3 className={`${FONT_DISPLAY} text-[18px] font-semibold text-text-primary`}>{title}</h3>
      <p className={`${FONT_BODY} text-[14px] leading-relaxed text-text-secondary`}>{body}</p>
    </motion.div>
  )
}

export default function SensorTechStrip() {
  return (
    <section className="w-full bg-navy">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24"
      >
        <p className={`${FONT_MONO} text-[11px] uppercase tracking-[0.14em] text-flow-poc`}>
          Sensor technology · why it is safe to retrofit
        </p>
        <h2
          className={`${FONT_DISPLAY} mt-3 max-w-[640px] text-[26px] font-bold tracking-[-0.02em] text-text-primary sm:text-[28px] lg:text-[32px]`}
        >
          Measurement without touching the circuit.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3">
          {COLS.map((c, i) => (
            <TechColumn key={c.title} icon={c.icon} title={c.title} body={c.body} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
