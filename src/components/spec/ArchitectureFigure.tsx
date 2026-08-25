import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeader, { EASE_OUT_EXPO } from './SectionHeader';
import { LAYER_MAP } from './data';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { ARCHITECTURE_MERMAID } from '@/lib/mermaidDiagrams';

export default function ArchitectureFigure() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
      <SectionHeader
        eyebrow="Figure · Reference Architecture"
        title="The approved system path, mapped to seven bands"
        sub="The RDSO reference figures show the required field-to-application path. Each subsystem corresponds to one or more numbered bands in the design diagram."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
          className="overflow-hidden rounded-3xl border border-stroke-default bg-container p-4 shadow-xl md:p-6"
        >
          <div className="overflow-hidden rounded-2xl border border-stroke-default bg-raised p-3 md:p-4">
            <MermaidDiagram
              chart={ARCHITECTURE_MERMAID}
              ariaLabel="RDPMS reference architecture schematic"
              className="min-h-[420px]"
            />
          </div>
          <figcaption className="mt-4 px-1 pb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
            RDPMS reference architecture — design view based on RDSO/SPN/257/2025
          </figcaption>
        </motion.figure>

        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.12 }}
          className="h-fit rounded-2xl border border-stroke-default bg-container p-6"
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
            Figure layer → site band
          </p>
          <ul className="mt-4 divide-y divide-stroke-muted">
            {LAYER_MAP.map((row) => (
              <li
                key={row.figure}
                className="group flex items-center justify-between gap-3 py-2.5 transition-colors duration-200"
              >
                <span className="text-sm font-medium text-text-secondary transition-colors duration-200 group-hover:text-flow-required">
                  {row.figure}
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] text-text-tertiary transition-colors duration-200 group-hover:text-flow-required">
                  <ArrowRight
                    className="h-3 w-3 opacity-40 transition-opacity duration-200 group-hover:opacity-100"
                    strokeWidth={2}
                  />
                  Band {row.band}
                </span>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
