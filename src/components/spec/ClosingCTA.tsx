import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { EASE_OUT_EXPO } from './SectionHeader';

export default function ClosingCTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 sm:px-6 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="rounded-3xl border border-stroke-default bg-container px-6 py-14 text-center shadow-xl md:py-20"
      >
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
          Traceability complete
        </p>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          From requirement to connector
        </h2>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.15 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-flow-required px-6 py-3 font-sans text-sm font-semibold text-white shadow-[0_8px_24px_rgba(234,88,12,0.28)] transition-colors duration-200 hover:bg-[#C2410C] sm:w-auto"
            >
              Open the animated LLD
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.25 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/field-assets"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stroke-default bg-raised px-6 py-3 font-sans text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-stroke-active sm:w-auto"
            >
              Explore field assets
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mx-auto mt-10 max-w-lg font-mono text-[11px] leading-relaxed tracking-[0.04em] text-text-tertiary"
        >
          This site is a design visualization; the governing document remains RDSO/SPN/257/2025
          v2.0.
        </motion.p>
      </motion.div>
    </section>
  );
}
