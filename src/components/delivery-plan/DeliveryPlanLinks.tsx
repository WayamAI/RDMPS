import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { EASE, FONT_BODY, FONT_DISPLAY, FONT_MONO } from '@/components/field-assets/shared'

function CtaCard({
  to,
  title,
  sub,
  variant,
  delay,
}: {
  to: string
  title: string
  sub: string
  variant: 'orange' | 'ghost'
  delay: number
}) {
  const styles =
    variant === 'orange'
      ? 'bg-flow-required text-white border-transparent hover:shadow-[0_12px_36px_rgba(234,88,12,0.35)]'
      : 'bg-container text-text-primary border-stroke-default hover:border-stroke-active hover:shadow-[0_12px_32px_rgba(9,9,11,0.10)]'
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link
        to={to}
        className={`group flex h-full flex-col justify-between gap-8 rounded-2xl border p-7 transition-all ${styles}`}
      >
        <div>
          <h3 className={`${FONT_DISPLAY} text-lg sm:text-[20px] font-semibold tracking-tight`}>{title}</h3>
          <p
            className={`${FONT_BODY} mt-2 text-[14px] leading-relaxed ${variant === 'orange' ? 'text-white/80' : 'text-text-secondary'
              }`}
          >
            {sub}
          </p>
        </div>
        <span className="inline-flex items-center gap-2">
          <span className={`${FONT_MONO} text-[11px] uppercase tracking-[0.12em]`}>Open</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </span>
      </Link>
    </motion.div>
  )
}

export default function DeliveryPlanLinks() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pb-28">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <CtaCard
          to="/"
          title="Explore the animated LLD"
          sub="Seven bands, live flow particles, zoom and Required system/All flows toggle."
          variant="orange"
          delay={0}
        />
        <CtaCard
          to="/field-assets"
          title="Meet the field assets"
          sub="The machines under the microscope  six photo plates with sensor specs."
          variant="ghost"
          delay={0.1}
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className={`${FONT_MONO} mt-8 text-center text-[11px] uppercase tracking-[0.12em] text-text-tertiary`}
      >
        Phase overlap is deliberate  P2 certifications start on lab-bench hardware, not field hardware
      </motion.p>
    </section>
  )
}
