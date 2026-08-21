import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { EASE, FONT_BODY, FONT_DISPLAY, FONT_MONO } from '@/components/field-assets/shared'
import { FULL_SCOPE, IN_SCOPE, KPIS } from './phases'

function CountUp({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className={`${FONT_DISPLAY} text-[32px] font-bold tracking-tight text-text-primary sm:text-[40px]`}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

function ScopeColumn({
  title,
  items,
  tone,
  side,
}: {
  title: string
  items: string[]
  tone: 'green' | 'blue'
  side: 'left' | 'right'
}) {
  const accentColor = tone === 'green' ? 'text-ok' : 'text-blue-400'
  const accentBg = tone === 'green' ? 'bg-ok' : 'bg-blue-500'
  const bg = tone === 'green' ? 'bg-ok/10 border border-ok/25' : 'bg-blue-500/10 border border-blue-500/20'
  const textColor = tone === 'green' ? 'text-text-primary' : 'text-text-primary'
  const Icon = tone === 'green' ? Check : Minus
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-stroke-default bg-container p-7 shadow-xl"
    >
      {/* accent bar draws top-to-bottom */}
      <motion.span
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
        className={`absolute left-0 top-0 h-full w-1 origin-top ${accentBg}`}
      />
      <h3 className={`${FONT_DISPLAY} text-base sm:text-[18px] font-semibold tracking-tight text-text-primary`}>
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((it, i) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.06 }}
            className={`${FONT_BODY} flex items-start gap-2.5 rounded-lg ${bg} px-3 py-2 text-[14px] leading-snug ${textColor}`}
          >
            <Icon size={15} className={`mt-0.5 shrink-0 ${accentColor}`} strokeWidth={2.5} />
            {it}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function ScopeContract() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-24">
      <div className="mb-12">
        <p className={`${FONT_MONO} text-[11px] uppercase tracking-[0.14em] text-flow-poc`}>
          POC scope contract
        </p>
        <h2 className={`${FONT_DISPLAY} mt-3 text-[26px] font-bold tracking-tight text-text-primary sm:text-[32px]`}>
          What the pilot proves  and what it defers.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScopeColumn title="In the pilot" items={IN_SCOPE} tone="green" side="left" />
        <ScopeColumn title="Full system only" items={FULL_SCOPE} tone="blue" side="right" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
            className="rounded-2xl border border-stroke-default bg-container p-6 shadow-xl"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-ok" />
              <CountUp value={k.value} prefix={k.prefix} suffix={k.suffix} />
            </div>
            <p className={`${FONT_MONO} mt-2 text-[11px] uppercase tracking-[0.1em] text-text-tertiary`}>
              {k.label}
            </p>
            <p className={`${FONT_BODY} mt-1 text-[12px] text-text-secondary`}>
              {k.label.startsWith('availability') ? 'per §16 formulas' : 'at 6 months of soak'}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
