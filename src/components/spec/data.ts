export interface Annexure {
  letter: string;
  title: string;
  role: string;
  chips: string[];
}

export const ANNEXURES: Annexure[] = [
  {
    letter: 'A',
    title: 'System architecture & topology',
    role: 'The five-layer reference model (Figures 1–2) every band on this site is drawn from.',
    chips: ['Bands 01–07'],
  },
  {
    letter: 'B',
    title: 'Communication protocol',
    role: 'MQTT topic tree, 12 packet types, and the identifier grammar (stngw_id, para_id…).',
    chips: ['Band 05', '§5', 'Deep-dive 01/02'],
  },
  {
    letter: 'C',
    title: 'Asset set & hard logics',
    role: '65 prediction + 77 failure logics with LD/HD constants per asset class.',
    chips: ['Band 06', 'Deep-dive 04'],
  },
  {
    letter: 'D',
    title: 'Sensor & IoT hardware',
    role: 'Transducer classes, scan resolution, buffering and enclosure requirements.',
    chips: ['Bands 01–02'],
  },
  {
    letter: 'E',
    title: 'Web dashboard screens',
    role: 'Role-scoped screens for JE / SSE / ASTE / DSTE with drill-down hierarchy.',
    chips: ['Band 07'],
  },
  {
    letter: 'F',
    title: 'Common-dashboard APIs',
    role: 'Five REST endpoints feeding the Railway-board common dashboard.',
    chips: ['Band 07'],
  },
  {
    letter: 'G',
    title: 'Mobile app & Ack workflow',
    role: 'Maintainer app with acknowledgement, escalation and closure flow.',
    chips: ['Band 07', 'Deep-dive 03'],
  },
];

export interface Clause {
  ref: string;
  requirement: string;
  lands: string;
  design: string;
}

export const CLAUSES: Clause[] = [
  {
    ref: '§7.2',
    requirement: 'Redundant communication paths per gateway',
    lands: 'Band 04  OFC/MPLS + 4G/5G failover',
    design:
      'Every gateway carries two uplinks. OFC/MPLS is the primary path (solid orange connector); the 4G/5G cellular link is drawn as the failover pair. Broker sessions re-establish on path switch without packet loss because of the Band-03 store-&-forward buffer.',
  },
  {
    ref: '§11.12',
    requirement: 'Data copy to Railway Cloud',
    lands: 'Band 06/07  dashed replication link',
    design:
      'A one-way replication connector from the analytics store to Railway Cloud is drawn dashed gray  a proposed interface, not part of the POC pilot path. It carries no alert traffic and can be severed without affecting the pilot.',
  },
  {
    ref: '§13.9',
    requirement: 'AI/ML governance & review',
    lands: 'Cross-cutting  Governance; cold-start ladder',
    design:
      'Models ship behind a governance gate: shadow → advisory → actuating. The cold-start ladder (deep-dive 04) encodes the review cadence, and the Governance card in the cross-cutting rail owns model versioning and sign-off records.',
  },
  {
    ref: '§16',
    requirement: 'Availability formulas & KPI computation',
    lands: 'Cross-cutting  Availability; ≥99% POC target',
    design:
      'Availability = MTBF / (MTBF + MTTR) computed per asset class and rolled up to station level. The POC target of ≥99% is rendered as the KPI card status dot; the formula lives in the Availability cross-cutting panel.',
  },
  {
    ref: 'Port 8883 / mTLS',
    requirement: 'Broker requires client certificates',
    lands: 'Band 05  broker card',
    design:
      'The MQTT broker card shows port 8883 with mutual TLS: every gateway and subscriber presents a client certificate. The spec chip "port 8883 · mTLS" sits on the broker card and the security cross-cutting panel lists the PKI chain.',
  },
  {
    ref: '≥10 lakh / ≥50 lakh',
    requirement: 'IoT FIFO / gateway store-&-forward buffers',
    lands: 'Bands 02/03',
    design:
      'IoT sensor nodes buffer ≥10 lakh packets in FIFO; edge gateways store & forward ≥50 lakh. Both numbers appear as spec chips on the Band-02 node card and the Band-03 gateway card, sized against worst-case outage windows.',
  },
  {
    ref: '≤20 ms',
    requirement: 'Configurable scan resolution; event bursts',
    lands: 'Bands 02, parameter_e',
    design:
      'parameter_e configures the scan resolution down to 20 ms. Fast scans catch transient signatures (point-machine current spikes); event bursts ride the same MQTT topic as periodic telemetry with a burst flag.',
  },
  {
    ref: '≤1 min',
    requirement: 'Event-to-alert latency',
    lands: 'Band 06 alert engine',
    design:
      'The alert engine budget: field event → MQTT publish → rule evaluation → alert dispatch in under one minute. The latency chip on the Band-06 card is the head-of-line KPI for the whole pilot path.',
  },
  {
    ref: 'Escalation 0/30 m/1 h/2 h',
    requirement: 'Maintainer → JE/SE → SSE → ASTE/DSTE',
    lands: 'Deep-dive 03 ladder',
    design:
      'Unacknowledged alerts climb the ladder: maintainer at T+0, JE/SE at +30 min, SSE at +1 h, ASTE/DSTE at +2 h. The pinned escalation-ladder sequence in deep-dive 03 animates each rung with the red alert-flow color.',
  },
];

export interface Standard {
  body: string;
  name: string;
  role: string;
  accent: 'orange' | 'slate' | 'blue';
}

export const STANDARDS: Standard[] = [
  {
    body: 'RDSO',
    name: 'SPN/257/2025 v2.0',
    role: 'The parent spec  Remote Diagnostics & Predictive Maintenance for signalling.',
    accent: 'orange',
  },
  {
    body: 'RDSO',
    name: 'SPN/197',
    role: 'Earthing & bonding practice for signalling installations.',
    accent: 'orange',
  },
  {
    body: 'IEC',
    name: '60688 Class 1',
    role: 'Measuring transducers  accuracy class for analog telemetry channels.',
    accent: 'slate',
  },
  {
    body: 'ISO/IEC',
    name: '5338',
    role: 'AI system life-cycle processes  governs model build & retirement.',
    accent: 'blue',
  },
  {
    body: 'ISO/IEC',
    name: '42001',
    role: 'AI management systems  the org-level governance frame.',
    accent: 'blue',
  },
  {
    body: 'ISO/IEC',
    name: '23894',
    role: 'AI risk management  feeds the cold-start ladder & review gates.',
    accent: 'blue',
  },
  {
    body: 'NCCS',
    name: 'ITSAR',
    role: 'Cipher suites & telecom security baseline for the 4G/5G path.',
    accent: 'slate',
  },
  {
    body: 'TEC',
    name: '31318',
    role: 'IoT device declaration  conformity for field sensor hardware.',
    accent: 'slate',
  },
  {
    body: 'STQC',
    name: 'Safe-to-Host',
    role: 'Cloud hosting certification for the analytics & dashboard tier.',
    accent: 'slate',
  },
  {
    body: 'C-DOT',
    name: 'CCSP / oneM2M',
    role: 'Future platform migration target  drawn as dashed proposed links.',
    accent: 'blue',
  },
];

export interface LayerMapping {
  figure: string;
  band: string;
}

export const LAYER_MAP: LayerMapping[] = [
  { figure: 'Users', band: '07' },
  { figure: 'Application', band: '06' },
  { figure: 'ISP', band: '05' },
  { figure: 'Gateway', band: '03 (+ Network 04)' },
  { figure: 'IoT', band: '02' },
  { figure: 'Sensors', band: '01' },
];
