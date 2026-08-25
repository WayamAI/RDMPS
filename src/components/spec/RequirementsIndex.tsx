import { motion } from 'framer-motion';
import SectionHeader, { EASE_OUT_EXPO } from './SectionHeader';
import { REQUIREMENT_MODULES } from './data';

export default function RequirementsIndex() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
      <SectionHeader
        eyebrow="Requirements · Modules A–G"
        title="Seven requirement modules, one specification"
        sub="Each approved module defines part of the design. Cross-reference chips summarize the capability it governs."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REQUIREMENT_MODULES.map((module, i) => (
          <motion.article
            key={module.letter}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-25% 0px' }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group flex flex-col rounded-xl border border-stroke-default bg-container p-5 transition-all duration-200 hover:border-flow-required hover:shadow-[0_12px_32px_rgba(9,9,11,0.10)]"
          >
            <div style={{ perspective: 400 }}>
              <motion.div
                initial={{ rotateX: 90, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                viewport={{ once: true, margin: '-25% 0px' }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.15 }}
                className="flex h-14 w-14 items-center justify-center rounded-lg bg-flow-required/15 border border-flow-required/30 font-mono text-2xl font-bold text-flow-required transition-transform duration-200 group-hover:rotate-[4deg]"
                style={{ transformOrigin: 'bottom' }}
              >
                {module.letter}
              </motion.div>
            </div>

            <h3 className="mt-4 font-sans text-[15px] font-semibold leading-snug text-text-primary">
              Module {module.letter} · {module.title}
            </h3>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-text-secondary">
              {module.role}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {module.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md bg-flow-required/15 border border-flow-required/30 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-flow-required"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.article>
        ))}

        {/* filler card keeps the 4+3 grid rhythm honest */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25% 0px' }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay: REQUIREMENT_MODULES.length * 0.08 }}
          className="hidden items-center justify-center rounded-xl border border-dashed border-stroke-default bg-container/40 p-5 lg:flex"
        >
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
            Modules A–G
            <br />
            complete the spec
          </p>
        </motion.div>
      </div>
    </section>
  );
}
