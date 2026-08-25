import { motion } from 'framer-motion';

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  sub?: string;
}

export default function SectionHeader({ eyebrow, title, sub }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
      className="mb-10"
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-flow-required">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{sub}</p>}
    </motion.div>
  );
}
