import { motion } from 'framer-motion';
import { FileText, Layers, Landmark } from 'lucide-react';
import { EASE_OUT_EXPO } from './SectionHeader';

const HEADLINE = 'Requirements mapped to every design choice.';

const CHIPS = [
  { icon: FileText, label: '215 pp spec' },
  { icon: Layers, label: '7 requirement modules' },
  { icon: Landmark, label: '7 standards bodies' },
];

export default function SpecHero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle track-schematic texture behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'url(/hero-texture.svg)',
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-4 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-flow-required"
        >
          RDSO/SPN/257/2025 · Version 2.0
        </motion.p>

        <h1
          aria-label={HEADLINE}
          className="mt-5 max-w-3xl font-display text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-text-primary sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-[56px]"
        >
          {HEADLINE.split(' ').map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split('').map((ch, ci) => (
                <motion.span
                  key={ci}
                  aria-hidden
                  className="inline-block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE_OUT_EXPO,
                    delay: 0.15 + wi * 0.05 + ci * 0.014,
                  }}
                >
                  {ch}
                </motion.span>
              ))}
              {wi < HEADLINE.split(' ').length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.55 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary"
        >
          The RDPMS design is built from the approved RDSO specification. This page maps each
          requirement to the architecture.
        </motion.p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {CHIPS.map((chip, i) => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.7 + i * 0.06 }}
              className="inline-flex items-center gap-2 rounded-full border border-stroke-default bg-container px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary"
            >
              <chip.icon className="h-3.5 w-3.5 text-flow-required" strokeWidth={2} />
              {chip.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
