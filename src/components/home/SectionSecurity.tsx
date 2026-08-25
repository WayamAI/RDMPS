import { motion } from 'framer-motion';
import { Eyebrow, PhotoPlate, SpecChip } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { PKI_MERMAID } from '@/lib/mermaidDiagrams';
import { Check } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const CHECKLIST = [
  ['NCCS ITSAR cipher suites only (MQTT over TLS 1.2/1.3)', 'ITSAR'],
  ["Per-vendor CA segregation  one vendor's compromise can't cross-authenticate", 'PKI'],
  ['STQC safe-to-host certification before cloud go-live', 'STQC'],
  ['TEC 31318 declaration for IoT devices', 'TEC 31318'],
  ['Audit logging at ISP per topic ACL', 'ACL'],
  ['Key rotation & cert expiry monitored via health packets', 'ROTATION'],
];

function PkiChain() {
  return (
    <div className="rounded-2xl border border-stroke-default bg-container p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">PKI chain · per vendor</div>
      <MermaidDiagram
        chart={PKI_MERMAID}
        ariaLabel="Per-vendor PKI chain from root CA to IoT, gateway, and application certificates"
        className="mt-3 min-h-[280px]"
      />
      <div className="mt-3 rounded-lg border border-ok/30 bg-ok/10 px-3 py-2 text-center font-mono text-[10px] font-semibold text-ok">
        broker: require_client_certificate · port 8883
      </div>
    </div>
  );
}

export default function SectionSecurity() {
  return (
    <section id="dd-security" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24">
      <Reveal>
        <Eyebrow>05 · Zero trust on ballast</Eyebrow>
        <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
          Every packet is mutually authenticated.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <PkiChain />
          <div className="mt-4 flex flex-wrap gap-2">
            <SpecChip>mTLS both directions</SpecChip>
            <SpecChip tone="slate">per-vendor trust domain</SpecChip>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-stroke-default bg-container p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Compliance checklist</div>
            <ul className="mt-4 space-y-3">
              {CHECKLIST.map(([text, tag], i) => (
                <motion.li
                  key={tag}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.12, duration: 0.4, ease: EASE }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ok/15 border border-ok/30">
                    <Check className="h-3 w-3 text-ok" strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-snug text-text-secondary">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <PhotoPlate
            src="/photo-ips-room.jpg"
            caption="Relay & power room  physical security boundary"
            className="mt-6"
          />
        </Reveal>
      </div>
    </section>
  );
}
