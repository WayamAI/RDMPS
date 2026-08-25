import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { EASE, FONT_BODY, FONT_MONO } from './shared'

export default function BandCrossLink() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col items-center rounded-3xl border border-stroke-default bg-container px-6 py-10 text-center shadow-xl sm:px-8 sm:py-14"
      >
        <p className={`${FONT_BODY} text-[17px] text-text-secondary`}>
          See these assets in the live diagram
        </p>
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 1.03 }}>
          <Link
            to="/"
            className={`${FONT_BODY} mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-flow-required px-6 py-3 text-center text-[15px] font-semibold text-white transition-shadow hover:shadow-[0_8px_28px_rgba(234,88,12,0.35)]`}
          >
            Open Layer 01 in the LLD
            <ArrowRight size={17} />
          </Link>
        </motion.div>
        <p className={`${FONT_MONO} mt-6 text-[11px] uppercase tracking-[0.12em] text-text-tertiary`}>
          All six asset classes above are mandatory for the Required system under requirement module C
        </p>
      </motion.div>
    </section>
  )
}
