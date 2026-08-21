import { motion } from 'framer-motion';
import { Eyebrow, PhotoPlate, SpecChip } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';
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
  const nodes = [
    {
      y: 20,
      title: 'Per-Vendor Root CA',
      sub: '4096-bit · offline HSM',
      fill: 'rgba(234, 88, 12, 0.15)',
      stroke: '#EA580C',
    },
    {
      y: 96,
      title: 'Entity Certificates',
      sub: '2048-bit · signed per device',
      fill: '#FFFFFF',
      stroke: 'rgba(9, 9, 11, 0.20)',
    },
  ];
  const leaves = [
    { x: 60, title: 'IoT Device' },
    { x: 200, title: 'Station Gateway' },
    { x: 340, title: 'RDPMS Application' },
  ];
  return (
    <div className="rounded-2xl border border-stroke-default bg-container p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">PKI chain · per vendor</div>
      <svg viewBox="0 0 400 260" className="mt-3 w-full">
        {/* links */}
        {[
          'M 200 52 L 200 92',
          ...leaves.map((l) => `M 200 128 C 200 150, ${l.x} 150, ${l.x} 168`),
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#EA580C"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: 'easeInOut' }}
          />
        ))}
        {/* revocation dashed stub */}
        <motion.path
          d="M 240 30 C 300 30, 320 30, 350 30"
          fill="none"
          stroke="#8B8B94"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <text x="300" y="18" textAnchor="middle" fontFamily="Geist, sans-serif" fontSize="8" fill="#71717A">
          CRL / OCSP (PROPOSED)
        </text>

        {nodes.map((n, i) => (
          <motion.g
            key={n.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
            style={{ transformOrigin: '200px 36px' }}
          >
            <rect x="120" y={n.y} width="160" height="36" rx="10" fill={n.fill} stroke={n.stroke} strokeWidth="1.5" />
            <text
              x="200"
              y={n.y + 16}
              textAnchor="middle"
              fill="#0A0A0A"
              fontFamily="Geist, sans-serif"
              fontSize="11"
              fontWeight="600"
            >
              {n.title}
            </text>
            <text
              x="200"
              y={n.y + 29}
              textAnchor="middle"
              fill="#52525B"
              fontFamily="Geist, sans-serif"
              fontSize="8"
            >
              {n.sub}
            </text>
          </motion.g>
        ))}

        {leaves.map((l, i) => (
          <motion.g
            key={l.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: EASE }}
          >
            <rect x={l.x - 52} y="168" width="104" height="34" rx="10" fill="#FFFFFF" stroke="rgba(9,9,11,0.15)" strokeWidth="1.5" />
            <text x={l.x} y="189" textAnchor="middle" fill="#0A0A0A" fontFamily="Geist, sans-serif" fontSize="10" fontWeight="600">
              {l.title}
            </text>
          </motion.g>
        ))}

        {/* broker annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <rect x="70" y="222" width="260" height="30" rx="8" fill="rgba(21, 128, 61, 0.10)" stroke="#15803D" strokeWidth="1.5" />
          <text x="200" y="241" textAnchor="middle" fill="#15803D" fontFamily="Geist, sans-serif" fontSize="9" fontWeight="600">
            broker: require_client_certificate · port 8883
          </text>
        </motion.g>
      </svg>
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
