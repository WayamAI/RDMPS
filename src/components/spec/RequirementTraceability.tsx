import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionHeader, { EASE_OUT_EXPO } from './SectionHeader';
import { REQUIREMENT_MAPPINGS } from './data';

export default function RequirementTraceability() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
      <SectionHeader
        eyebrow="Traceability Matrix · Requirement → Architecture"
        title="From the RDSO mandate to the wire"
        sub="The specification sets measurable requirements for sensing, buffering, communications, security and application behavior. Here is how each maps to a subsystem."
      />

      <div className="overflow-hidden rounded-2xl border border-stroke-default bg-container shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stroke-default bg-raised">
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary md:w-[180px] md:px-6">
                  Source area
                </th>
                <th className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary md:px-6">
                  Requirement
                </th>
                <th className="hidden px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary md:table-cell md:px-6">
                  Where it lands
                </th>
                <th className="w-10 px-3 py-3.5" aria-label="expand" />
              </tr>
            </thead>
            <tbody>
              {REQUIREMENT_MAPPINGS.map((requirement, i) => {
                const isOpen = open === i;
                return (
                  <motion.tr
                    key={requirement.ref}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay: i * 0.05 }}
                    className={cn(
                      'border-b border-stroke-muted align-top transition-colors duration-150 last:border-b-0',
                      isOpen ? 'bg-raised/60' : 'hover:bg-raised/30',
                    )}
                  >
                    <td colSpan={4} className="p-0">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="grid w-full cursor-pointer grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] items-start gap-0 px-5 py-4 text-left md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)_auto] md:px-6"
                      >
                        <span className="pr-4 font-mono text-[12.5px] font-bold text-flow-required">
                          {requirement.ref}
                        </span>
                        <span className="pr-4 text-sm font-medium leading-snug text-text-primary">
                          {requirement.requirement}
                        </span>
                        <span className="hidden pr-4 text-[12.5px] leading-snug text-text-secondary md:block">
                          {requirement.lands}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                          className="mt-0.5 text-text-tertiary"
                        >
                          <ChevronDown className="h-4 w-4" strokeWidth={2} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.3, ease: EASE_OUT_EXPO },
                              opacity: { duration: 0.2 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mx-5 mb-4 rounded-xl border border-stroke-default bg-raised px-5 py-4 md:mx-6">
                              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-flow-required">
                                DESIGN →
                              </p>
                              <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                                {requirement.design}
                              </p>
                              <p className="mt-3 font-mono text-[11px] text-text-tertiary md:hidden">
                                Lands: {requirement.lands}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
