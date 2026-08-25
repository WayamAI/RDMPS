import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './atoms';
import Reveal from '@/components/home/Reveal';

const ASSET_CODES: [string, string, string][] = [
  ['EOP', '00', 'point machine'],
  ['LED', '10', 'LED signal'],
  ['LES', '11', 'main signal'],
  ['LEC', '12', 'calling-on signal'],
  ['LER', '13', 'shunt signal'],
  ['DCT', '20', 'DC track circuit'],
  ['IPS', '50', 'power supply'],
  ['SPD', '51', 'surge protection'],
  ['ELD', '60', 'earth leakage'],
  ['ENV', 'F0–F6', 'equipment rooms'],
];

export default function SectionIdentifiers() {
  const [mode, setMode] = useState<'para' | 'gw'>('para');
  const [hex, setHex] = useState('0001000C');

  const clean = hex.replace(/[^0-9A-Fa-f]/g, '').slice(0, 8);
  const valid = clean.length === 8;
  const bytes = [clean.slice(0, 2), clean.slice(2, 4), clean.slice(4, 6), clean.slice(6, 8)];

  const decoded = valid
    ? mode === 'para'
      ? [
        `ASSET_TYPE\n${bytes[0] === '00' ? 'EOP  point machine' : bytes[0] === '20' ? 'DCT  track circuit' : bytes[0] === '50' ? 'IPS  power supply' : `type 0x${bytes[0]}`}`,
        `ASSET_NUMBER\nasset PT-${parseInt(bytes[1], 16) || 1}`,
        `PARAMETER_TYPE\n${bytes[2] === '00' ? 'DC-A current channel' : bytes[2] === '01' ? 'peak current' : bytes[2] === '02' ? 'stroke time' : `param 0x${bytes[2]}`}`,
        `REPRESENTATION\n${bytes[3] === '0C' ? 'normal current representation' : bytes[3] === '0D' ? 'peak current amp' : bytes[3] === '1E' ? 'time (s)' : `raw 0x${bytes[3]}`}`,
      ]
      : [
        `ZONE\n${bytes[0] === '00' ? 'Northern Railway' : bytes[0] === '01' ? 'Western' : bytes[0] === '02' ? 'Southern' : `Zone 0x${bytes[0]}`}`,
        `DIVISION\nDiv-${parseInt(bytes[1], 16)}`,
        `STATION\nStn-0x${bytes[2]}`,
        `GATEWAY #\nGW-${parseInt(bytes[3], 16)}`,
      ]
    : null;

  const labels = mode === 'para' ? ['asset_type', 'asset_number', 'parameter_type', 'representation'] : ['zone', 'division', 'station', 'gateway #'];

  return (
    <section id="dd-identifiers" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[55fr_45fr]">
        <Reveal>
          <Eyebrow>01 · Identifiers</Eyebrow>
          <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
            Every byte on the wire has an address.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
            RDPMS addresses every gateway and every measured parameter with 4-byte identifiers carried in each MQTT
            topic as <code className="rounded bg-flow-required/15 px-1.5 py-0.5 font-mono text-[13px] text-flow-required border border-flow-required/30">{'{role}/{sender_id}/{receiver_id}'}</code>{' '}
            and inside every packet payload.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="diagram-card rounded-xl border border-stroke-default bg-container p-4">
              <div className="font-mono text-[13px] font-bold text-text-primary">stngw_id  station gateway</div>
              <div className="mt-1 font-mono text-[11px] text-text-tertiary">4 bytes</div>
              <div className="mt-3 flex flex-wrap gap-1 font-mono text-[10px] text-text-secondary">
                {['zone', 'division', 'station', 'gateway #'].map((l) => (
                  <span key={l} className="rounded bg-raised px-2 py-1 border border-stroke-muted text-text-secondary">{l}</span>
                ))}
              </div>
            </div>
            <div className="diagram-card rounded-xl border border-stroke-default bg-container p-4">
              <div className="font-mono text-[13px] font-bold text-text-primary">para_id  parameter</div>
              <div className="mt-1 font-mono text-[11px] text-text-tertiary">4 bytes</div>
              <div className="mt-3 flex flex-wrap gap-1 font-mono text-[10px] text-text-secondary">
                {['asset_type', 'asset_number', 'parameter_type', 'representation'].map((l) => (
                  <span key={l} className="rounded bg-raised px-2 py-1 border border-stroke-muted text-text-secondary">{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* worked decode */}
          <div className="mt-6 rounded-xl border border-flow-required/30 bg-container p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-flow-required font-semibold">
              Worked decode · para_id = 0001000C
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                ['00', 'EOP point machine'],
                ['01', 'asset PT-01'],
                ['00', 'DC-A current channel'],
                ['0C', 'normal current representation'],
              ].map(([b, meaning]) => (
                <div key={b + meaning} className="relative">
                  <div className="rounded-lg border border-stroke-default bg-raised px-4 py-2.5 text-center">
                    <div className="font-mono text-lg font-bold text-text-primary">{b}</div>
                  </div>
                  <div className="mx-auto mt-1 h-3 w-px bg-flow-required/60" />
                  <div className="text-center font-mono text-[10px] text-text-tertiary mt-1">{meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* asset code table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-stroke-default bg-container">
            <table className="w-full text-left">
              <tbody>
                {ASSET_CODES.map(([code, hexCode, name], i) => (
                  <tr key={code} className={cn('border-b border-stroke-muted last:border-0', i % 2 === 1 && 'bg-raised/30')}>
                    <td className="px-4 py-2.5 font-mono text-[12px] font-bold text-text-primary">{code}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-flow-required font-semibold">{hexCode}</td>
                    <td className="px-4 py-2.5 text-[13px] text-text-secondary">{name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Hex decoder widget */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-container border border-stroke-default p-6 text-text-primary shadow-xl focus-within:ring-2 focus-within:ring-flow-required/60">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">Interactive hex decoder</div>
            <div className="mt-4 flex gap-2">
              {(
                [
                  ['para', 'para_id'],
                  ['gw', 'stngw_id'],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-full px-3 py-1.5 font-mono text-[11px] transition-colors cursor-pointer',
                    mode === m ? 'bg-flow-required text-white' : 'bg-raised text-text-tertiary hover:bg-raised-2 hover:text-text-primary border border-stroke-default',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 8))}
              className="mt-4 w-full rounded-lg border border-stroke-default bg-raised px-4 py-3 font-mono text-xl tracking-[0.3em] text-text-primary outline-none focus:border-flow-required"
              maxLength={8}
              spellCheck={false}
              aria-label="8 hex characters"
            />
            {!valid && (
              <div className="mt-2 font-mono text-[11px] text-amber">enter 8 hex characters (0–9, A–F)</div>
            )}
            <div className="mt-5 grid grid-cols-4 gap-2">
              {bytes.map((b, i) => (
                <div key={i}>
                  <div
                    key={`${b}-${i}`}
                    className={cn(
                      'byte-pop rounded-lg border px-2 py-3 text-center font-mono text-lg font-bold',
                      valid
                        ? decoded?.[i].includes('reserved')
                          ? 'border-amber/50 bg-amber/10 text-amber'
                          : 'border-code-green/40 bg-raised text-code-green'
                        : 'border-stroke-muted bg-raised text-text-quaternary',
                    )}
                  >
                    {b || '··'}
                  </div>
                  <div className="mt-1 text-center font-mono text-[9px] uppercase tracking-wide text-text-tertiary">
                    {labels[i]}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              {valid && decoded ? (
                decoded.map((d, i) => {
                  const [t, val] = d.split('\n');
                  return (
                    <div key={i} className="rounded-lg border border-stroke-muted bg-raised p-2.5 font-mono text-xs">
                      <span className="text-text-tertiary">{t}: </span>
                      <span className="font-semibold text-text-primary">{val}</span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg border border-dashed border-stroke-muted p-4 text-center font-mono text-xs text-text-quaternary">
                  enter 8 hex digits to decode
                </div>
              )}
            </div>
            <div className="mt-4 text-right font-mono text-[10px] text-text-tertiary">
              topic: <code className="text-flow-required font-semibold">{'{role}/{sender}/{receiver}'}</code> · 4-byte big-endian
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
