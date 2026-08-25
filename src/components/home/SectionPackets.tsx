import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eyebrow, SpecChip, CodeBlock } from '@/components/home/atoms';
import Reveal from '@/components/home/Reveal';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { PACKET_FLOW_MERMAID } from '@/lib/mermaidDiagrams';

interface Packet {
  id: string;
  note: string;
  fields: [string, string][];
  json: string;
}

const PACKETS: Packet[] = [
  {
    id: 'parameter_f',
    note: 'Fixed / change-based slow channel  5 s fixed, ±2% change-based.',
    fields: [
      ['stngw_id', 'originating station gateway'],
      ['data[].para_id', '4-byte parameter address'],
      ['data[].val / unit', 'scaled engineering value (IEC 60688 Cl.1)'],
      ['data[].ts', 'µs timestamp, GPS-disciplined'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "parameter_f",
  "stngw_id": "0A010C01",
  "clt": 1739107200123,
  "data": [
    { "para_id": "0001000C", "val": 4.82, "unit": "A", "ts": 1739107200000 },
    { "para_id": "20010201", "val": 11.94, "unit": "V", "ts": 1739107200000 }
  ]
}`,
  },
  {
    id: 'parameter_e',
    note: '20 ms event burst  point throw signature, e.g. point throw N→R.',
    fields: [
      ['burst_id', 'correlates all samples of one event'],
      ['samples[]', '20 ms spaced DC-A current samples'],
      ['trigger', 'hard-logic event that opened the burst'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "parameter_e",
  "stngw_id": "0A010C01",
  "clt": 1739107204420,
  "burst_id": "PT01-NR-0042",
  "trigger": "point_throw_N_to_R",
  "samples": [
    { "para_id": "0001000C", "val": 0.12, "ts": 1739107204000 },
    { "para_id": "0001000C", "val": 1.87, "ts": 1739107204020 },
    { "para_id": "0001000C", "val": 4.66, "ts": 1739107204040 }
  ]
}`,
  },
  {
    id: 'health',
    note: '30-minute IoT / gateway heartbeat.',
    fields: [
      ['buffer_depth', 'events held in store & forward'],
      ['uptime_s', 'seconds since last restart'],
      ['channels', 'per-channel acquisition status'],
      ['supply_v', 'measured 24 V DC rail'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "health",
  "stngw_id": "0A010C01",
  "clt": 1739109000000,
  "buffer_depth": 41208,
  "uptime_s": 518400,
  "channels": { "total": 64, "active": 58, "spare": 6 },
  "supply_v": 24.6
}`,
  },
  {
    id: 'TIME_SYNC',
    note: 'Discovery class, 7-day retention  GPS/IRNSS offset + NTP fallback state.',
    fields: [
      ['source', 'gps | irnss | ntp_fallback'],
      ['offset_us', 'clock offset vs reference'],
      ['holdover', 'time since last fix'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "TIME_SYNC",
  "stngw_id": "0A010C01",
  "clt": 1739107200000,
  "source": "gps",
  "offset_us": 42,
  "ntp_fallback": "standby",
  "holdover_s": 0
}`,
  },
  {
    id: 'INFO',
    note: '30-day retention  device inventory, firmware, vendor codes.',
    fields: [
      ['vcc', 'vendor company code'],
      ['vgc', 'vendor gateway code'],
      ['fw', 'firmware version string'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "INFO",
  "stngw_id": "0A010C01",
  "clt": 1739107200000,
  "vcc": "VENDOR-A",
  "vgc": "GW-A-01",
  "fw": "2.4.1-rdso",
  "iot_nodes": 5
}`,
  },
  {
    id: 'IMAGE',
    note: '7-day retention  chunked firmware image transfer metadata.',
    fields: [
      ['image_id', 'firmware image identifier'],
      ['chunk / total', 'chunked transfer progress'],
      ['sha256', 'per-image integrity hash'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "IMAGE",
  "stngw_id": "0A010C01",
  "clt": 1739107200000,
  "image_id": "gw-fw-2.4.2",
  "chunk": 17,
  "total": 240,
  "sha256": "9f2c…e41a"
}`,
  },
  {
    id: 'config',
    note: 'config_id 01–04 pushed to gateway / IoT: scan rate, thresholds, channels, comms.',
    fields: [
      ['config_id', '01 scan · 02 thresholds · 03 channels · 04 comms'],
      ['params', 'config-class-specific payload'],
      ['apply_at', 'scheduled application time'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "config",
  "stngw_id": "0A010C01",
  "clt": 1739107200000,
  "config_id": "02",
  "params": { "LD1": 80, "LD2": 90, "HD": 150, "dwell_s": 15 },
  "apply_at": 1739110800000
}`,
  },
  {
    id: 'cmd',
    note: 'Command downlink with rqi correlation.',
    fields: [
      ['rqi', 'request id  echoed by ack'],
      ['cmd', 'command verb'],
      ['args', 'command arguments'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "cmd",
  "stngw_id": "0A010C01",
  "clt": 1739107200500,
  "rqi": "rq-8842",
  "cmd": "burst_capture",
  "args": { "para_id": "0001000C", "window_ms": 4000 }
}`,
  },
  {
    id: 'ack',
    note: 'Uplink ack echoing rqi + result code.',
    fields: [
      ['rqi', 'echoed request id'],
      ['resi', 'response id'],
      ['result', '0 = ok, non-zero = error code'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "ack",
  "stngw_id": "0A010C01",
  "clt": 1739107200712,
  "rqi": "rq-8842",
  "resi": "rs-8842",
  "result": 0
}`,
  },
  {
    id: 'alert',
    note: 'Alert engine output  id, asset ref, class, escalation tier, ack state.',
    fields: [
      ['alert_id', 'one-alert-per-asset identity'],
      ['class', 'failure | predictive'],
      ['tier', 'current escalation tier'],
      ['ack', 'acknowledgement state'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "alert",
  "alert_id": "AL-PT01-0007",
  "asset": { "stngw_id": "0A010C01", "para_id": "0001000C" },
  "class": "failure",
  "logic": "EOP-HD",
  "tier": 1,
  "ack": "pending",
  "clt": 1739107260000
}`,
  },
  {
    id: 'discovery',
    note: 'Registration announcement to the ISP registry.',
    fields: [
      ['role', 'publisher | subscriber | both'],
      ['topics', 'requested topic patterns'],
      ['cert_fp', 'client certificate fingerprint'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "discovery",
  "stngw_id": "0A010C01",
  "clt": 1739107200000,
  "role": "publisher",
  "topics": ["stngw/0A010C01/#"],
  "cert_fp": "SHA256:4ab1…90cd"
}`,
  },
  {
    id: 'error',
    note: 'Validation failure with the offending field path.',
    fields: [
      ['field', 'JSON pointer to the offending field'],
      ['expected', 'schema constraint violated'],
      ['pkt_ref', 'clt of the rejected packet'],
    ],
    json: `{
  "prv": "1.0",
  "prt": "error",
  "clt": 1739107200901,
  "field": "/data/0/val",
  "expected": "number within sensor range",
  "pkt_ref": 1739107200123
}`,
  },
];

const GLOSSARY: [string, string][] = [
  ['prv', 'protocol version'],
  ['prt', 'packet type'],
  ['clt', 'client timestamp (µs, GPS-disciplined)'],
  ['rqi', 'request id'],
  ['resi', 'response id'],
];

export default function SectionPackets() {
  const [active, setActive] = useState('parameter_f');
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const btn = triggerRefs.current[active];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <section id="dd-packets" className="border-t border-stroke-default bg-page py-24">
      <div className="mx-auto max-w-[1200px] scroll-mt-24 px-6">
        <Reveal>
          <Eyebrow>02 · On the wire</Eyebrow>
          <h2 className="mt-3 font-display text-[34px] font-bold tracking-tight-display text-text-primary">
            Twelve packets run the whole railway.
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {GLOSSARY.map(([k, v]) => (
              <span
                key={k}
                title={v}
                className="cursor-help rounded-full bg-raised border border-stroke-default px-3 py-1.5 font-mono text-[11px] text-text-secondary hover:border-stroke-active"
              >
                <b className="text-text-primary">{k}</b>  {v}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-stroke-default bg-container p-4 md:p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              Packet path · field to alert
            </div>
            <MermaidDiagram
              chart={PACKET_FLOW_MERMAID}
              ariaLabel="MQTT packet flow from IoT node through gateway, ISP, ingestion, logic, and alerts"
              className="mt-3 min-h-[160px]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Tabs value={active} onValueChange={setActive}>
            <TabsList className="flex h-auto flex-nowrap justify-start gap-1 overflow-x-auto bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
              {PACKETS.map((p) => (
                <TabsTrigger
                  ref={(el) => { triggerRefs.current[p.id] = el; }}
                  key={p.id}
                  value={p.id}
                  className="flex-none shrink-0 rounded-md border border-stroke-default bg-container px-3 py-1.5 font-mono text-[11px] text-text-secondary data-[state=active]:border-flow-required data-[state=active]:bg-flow-required/15 data-[state=active]:text-flow-required"
                >
                  {p.id}
                </TabsTrigger>
              ))}
            </TabsList>
            {PACKETS.map((p) => (
              <TabsContent key={p.id} value={p.id} className="mt-6">
                <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
                  <CodeBlock code={p.json} title={`${p.id}.json`} />
                  <div>
                    <div className="rounded-xl border border-flow-required/30 bg-flow-required/10 p-4 text-[13.5px] leading-relaxed text-text-primary">
                      {p.note}
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {p.fields.map(([f, d]) => (
                        <li key={f} className="flex items-baseline gap-3 text-[13px]">
                          <code className="shrink-0 rounded bg-raised border border-stroke-muted px-2 py-0.5 font-mono text-[11px] text-flow-required font-semibold">
                            {f}
                          </code>
                          <span className="text-text-secondary">{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex gap-2">
                      <SpecChip>QoS 1</SpecChip>
                      <SpecChip tone="slate">mTLS · port 8883</SpecChip>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
