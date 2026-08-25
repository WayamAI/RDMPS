import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useDiagram } from '@/lib/diagram-context';

const LINKS = [
  { to: '/deep-dive', label: 'Deep Dive' },
  { to: '/field-assets', label: 'Field Assets' },
  { to: '/delivery-plan', label: 'Delivery Plan' },
  { to: '/spec', label: 'Requirements' },
];

export default function Footer() {
  const { downloadSvg, controlsReady } = useDiagram();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-0 bg-page"
    >
      {/* particle divider hairline */}
      <div className="relative h-px w-full bg-stroke-default">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="divider-dot absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-flow-required"
            style={{ animationDelay: `${i * 1}s` }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/wayam-favicon.svg" alt="Wayam logo" className="h-10 w-10 rounded-lg" />
            <div>
              <div className="font-display text-lg font-bold text-text-primary">RDPMS LLD</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-quaternary">
                Remote Diagnostics &amp; Predictive Maintenance
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-tertiary">
            Animated low-level design for the required RDPMS system: seven layers from field sensors to the RDPMS
            cloud, built to RDSO/SPN/257/2025 v2.0.
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-quaternary">Pages</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-text-tertiary transition-colors hover:text-text-primary">
                LLD Diagram
              </Link>
            </li>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-text-tertiary transition-colors hover:text-text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            {controlsReady && (
              <>
                <li>
                  <button
                    onClick={() => downloadSvg('landscape')}
                    className="flex items-center gap-1.5 text-text-tertiary transition-colors hover:text-text-primary cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download SVG
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => downloadSvg('portrait')}
                    className="flex items-center gap-1.5 text-text-tertiary transition-colors hover:text-text-primary cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Vertical SVG
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-quaternary">Program</div>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-quaternary">
            REQUIRED SYSTEM · SINGLE INTERLOCKED STATION
            <br />
            18-MONTH DELIVERY PLAN · REQUIRED ASSET SET
            <br />
            MQTT/mTLS · ISP MIDDLEWARE
          </p>
        </div>
      </div>

      <div className="border-t border-stroke-muted">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-6 py-4 font-mono text-[11px] text-text-quaternary">
          <span>RDPMS LLD · built to RDSO/SPN/257/2025 v2.0</span>
          <div className="flex items-center gap-2">
            <span>Engineering dossier · seven layers · one station</span>
            <span className="mx-1 h-3 w-px bg-stroke-default" />
            <span className="flex items-center gap-1.5">
              Powered by
              <img src="/wayam-favicon.svg" alt="Wayam" className="h-4 w-4 rounded" />
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
