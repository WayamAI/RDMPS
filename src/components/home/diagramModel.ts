// Deterministic geometry model for the 7-band LLD diagram board with square blocks.
// All coordinates are in board-inner space (origin = top-left of the board padding box).

export const BOARD_PAD = 32;
export const BAND_W = 1180;
export const RAIL_W = 260;
export const RAIL_GAP = 24;
export const TITLE_H = 108;
export const BAND_H = 236;
export const BAND_GAP = 52;
export const CARD_SIZE = 150; // Square blocks: 150px x 150px
export const CARD_W = CARD_SIZE;
export const CARD_H = CARD_SIZE;
export const BAND_PAD_X = 16;
export const HEADER_H = 30; // band title chip height  cards clear it by CARD_TOP - HEADER_H
export const CARD_TOP = 66; // card y offset inside a band
/** Routing lane band inside the band top strip, between the header chip and the cards. */
export const LANE_Y = [40, 52];

export const BOARD_W = BOARD_PAD * 2 + BAND_W + RAIL_GAP + RAIL_W; // 1528
export const BANDS_H = TITLE_H + 7 * BAND_H + 6 * BAND_GAP; // 108 + 1652 + 312 = 2072
export const BOARD_H = BOARD_PAD + BANDS_H + 32; // 2052

/** Maps card icon ids to the 3D rendered artwork in public/icons. */
export const ICON_IMAGES: Record<string, string> = {
  'i-bell': '/icons/3D_alarm_bell_icon_202608211337.jpeg',
  'i-file-json': '/icons/3D_data_document_icon_202608211337.jpeg',
  'i-track': '/icons/3D_isometric_railway_track_icon_202608211337.jpeg',
  'i-shield': '/icons/Certificate_shield_key_icon_202608211337.jpeg',
  'i-cloud': '/icons/Cloud_outline_3D_icon_202608211337.jpeg',
  'i-db': '/icons/Database_cylinder_3D_icon_202608211337.jpeg',
  'i-gateway': '/icons/Gateway_node_icon_render_202608211337.jpeg',
  'i-gauge': '/icons/Gauge_icon_3D_render_202608211337.jpeg',
  'i-phone': '/icons/Handheld_device_3D_icon_202608211337.jpeg',
  'i-merge': '/icons/Icon_showing_merge_node_202608211337.jpeg',
  'i-dashboard': '/icons/Isometric_dashboard_screen_icon_202608211337.jpeg',
  'i-shield-bolt': '/icons/Lightning_protective_shield_icon_202608211337.jpeg',
  'i-antenna': '/icons/Mast_antenna_3D_icon_202608211337.jpeg',
  'i-clock': '/icons/Master_clock_icon_radiating_signals_202608211337.jpeg',
  'i-broker': '/icons/Message_broker_3D_icon_202608211337.jpeg',
  'i-power': '/icons/Power_supply_icon_202608211337.jpeg',
  'i-signal': '/icons/Railway_colour-light_signal_icon_202608211337.jpeg',
  'i-point': '/icons/Railway_point_switch_icon_202608211337.jpeg',
  'i-room': '/icons/Relay_room_isometric_icon_202608211337.jpeg',
  'i-sensor': '/icons/Split-core_clamp_sensor_icon_202608211337.jpeg',
  'i-users': '/icons/Two_people_3D_icon_202608211337.jpeg',
};

export type FlowType = 'poc' | 'full' | 'alert' | 'dashed';
export type Scope = 'poc' | 'full';

export interface CardSpec {
  title: string;
  sub: string;
  icon: string;
  scope: Scope;
  dashed?: boolean; // dashed-outline future card
  accent?: 'amber' | 'red' | 'blue';
  badge?: string;
  popoverImg?: string;
  popoverCaption?: string;
}

export interface BandSpec {
  num: string;
  title: string;
  pocTint?: boolean;
  cards: CardSpec[];
}

export const BANDS: BandSpec[] = [
  {
    num: '01',
    title: 'FIELD ASSETS & SENSORS · RDSO ANNEXURE C SET',
    pocTint: true,
    cards: [
      { title: 'Point Machines', sub: 'EOP · ≥8 sensors\n20 ms sample bursts', icon: 'i-point', scope: 'poc' },
      { title: 'DC Track Circuits', sub: 'DCT · 9 sensors\n±2% drift tracking', icon: 'i-track', scope: 'poc' },
      { title: 'Signals (Main/Call/Shunt)', sub: 'LED/LES/LEC/LER\n3+2 / 3 / 6 sensors', icon: 'i-signal', scope: 'poc' },
      { title: 'IPS Power Supply', sub: 'Asset 50\nVoltage/current/temp', icon: 'i-power', scope: 'poc' },
      { title: 'ELB / SPD / ELD', sub: 'SPD 51 · ELD 60\nSurge & leakage', icon: 'i-shield-bolt', scope: 'poc' },
      { title: 'Equipment Rooms', sub: 'RR·IPS·BATT·GEN\nF0–F6 environment', icon: 'i-room', scope: 'poc' },
      { title: 'Non-Intrusive Sensors', sub: 'Hall split-core\n≥2.5 kV isolation', icon: 'i-sensor', scope: 'poc' },
    ],
  },
  {
    num: '02',
    title: 'IoT DATA ACQUISITION · ≤20 MS SCAN',
    pocTint: true,
    cards: [
      { title: 'Point IoT Node', sub: 'param_f 5 s continuous\nparam_e 20 ms burst', icon: 'i-point', scope: 'poc' },
      { title: 'Track Circuit IoT', sub: '±2% change-based\nsignal sampling', icon: 'i-track', scope: 'poc' },
      { title: 'Signal IoT Node', sub: 'LED current monitor\nRelay PF contacts', icon: 'i-signal', scope: 'poc' },
      { title: 'IPS/Room IoT Node', sub: 'F0–F6 sensors\n24V DC +20%/−30%', icon: 'i-power', scope: 'poc' },
      { title: 'Edge-of-Network IoT', sub: 'LC Gate / IBH\nLoRa / Zigbee full', icon: 'i-antenna', scope: 'full', accent: 'blue' },
    ],
  },
  {
    num: '03',
    title: 'STATION GATEWAY · EDGE',
    pocTint: true,
    cards: [
      {
        title: 'Aggregator',
        sub: 'RS485 / Modbus RTU\nStation datalogger',
        icon: 'i-merge',
        scope: 'poc',
        popoverImg: '/photo-edge-gateway.jpg',
        popoverCaption: 'DIN-rail edge gateway  relay-room cabinet',
      },
      { title: 'Store & Forward', sub: '≥50 lakh events\n≤70% HW utilisation', icon: 'i-db', scope: 'poc' },
      { title: 'GPS / IRNSS Clock', sub: 'GPS master clock\nµs-grade sync', icon: 'i-clock', scope: 'poc' },
      { title: 'MQTT Client', sub: 'mTLS · QoS 1\nTopic pub/sub queue', icon: 'i-gateway', scope: 'poc' },
    ],
  },
  {
    num: '04',
    title: 'NETWORK & TRANSPORT',
    pocTint: true,
    cards: [
      { title: 'RailTel OFC / IP-MPLS', sub: 'Primary path\n≥10 Mbps dedicated', icon: 'i-antenna', scope: 'poc' },
      { title: '4G / 5G Backup', sub: 'Failover path\n≥10 Mbps dual SIM', icon: 'i-sensor', scope: 'poc' },
      { title: 'Power & Earthing', sub: '24V DC from IPS N+1\nRDSO/SPN/197 earth', icon: 'i-power', scope: 'poc' },
      { title: 'Future CCSP Network', sub: 'C-DOT CCSP standard\noneM2M migration', icon: 'i-cloud', scope: 'full', dashed: true },
    ],
  },
  {
    num: '05',
    title: 'ISP · MQTT MIDDLEWARE',
    pocTint: true,
    cards: [
      { title: 'MQTT Broker', sub: 'Port 8883 mTLS\nRequire client cert', icon: 'i-broker', scope: 'poc' },
      { title: 'Topic AuthZ & ACL', sub: '{role}/{snd}/{rcv}\nFull audit ledger', icon: 'i-file-json', scope: 'poc' },
      { title: 'Discovery Registry', sub: 'TIME_SYNC 7d\nINFO 30d · IMAGE 7d', icon: 'i-db', scope: 'poc' },
      { title: 'Per-Vendor PKI', sub: '4096-bit CA cert\nCRL / OCSP verify', icon: 'i-shield', scope: 'poc' },
    ],
  },
  {
    num: '06',
    title: 'RDPMS APPLICATION · CLOUD',
    pocTint: true,
    cards: [
      { title: 'Ingestion Engine', sub: 'Schema validation\nTwo-speed data store', icon: 'i-file-json', scope: 'poc' },
      { title: 'Hard-Logic Engine', sub: '65 pred + 77 fail\nAnnexure C logic', icon: 'i-gauge', scope: 'poc', accent: 'amber' },
      { title: 'AI / ML Analytics', sub: 'Staged cold-start\nISO/IEC 5338 model', icon: 'i-gauge', scope: 'poc' },
      { title: 'Alert Engine', sub: '1-alert-per-asset\n≤1 min SLA latency', icon: 'i-bell', scope: 'poc', accent: 'red' },
      { title: 'Feedback Loop', sub: 'T/PT/F/M tagging\nJE/SSE arbitration', icon: 'i-users', scope: 'poc' },
      { title: 'Web Dashboards', sub: 'Annexure E & G\nWeb + Mobile UI', icon: 'i-dashboard', scope: 'poc' },
      { title: 'Cloud Data Lake', sub: '≥2-yr time series\nRailway Cloud §11.12', icon: 'i-db', scope: 'poc' },
    ],
  },
  {
    num: '07',
    title: 'USERS & INTEGRATIONS',
    cards: [
      { title: 'Maintainer App', sub: 'Field Ack & reset\nAnnexure G workflow', icon: 'i-phone', scope: 'poc', accent: 'red' },
      { title: 'JE / SSE Dashboard', sub: 'Station console\nAnnexure E views', icon: 'i-dashboard', scope: 'poc' },
      { title: 'ASTE / DSTE Console', sub: 'Divisional tier\nEscalation tracker', icon: 'i-users', scope: 'poc' },
      { title: 'SMMS (CRIS)', sub: 'Maintenance API\nJob ticket sync', icon: 'i-db', scope: 'full', accent: 'blue' },
      { title: 'Railway Dashboard', sub: 'HQ visibility\n5 Annexure F APIs', icon: 'i-dashboard', scope: 'full', accent: 'blue' },
      { title: 'Railway Cloud Copy', sub: '§11.12 replication\nNational data sync', icon: 'i-cloud', scope: 'full', dashed: true },
    ],
  },
];

// ---------- geometry helpers ----------

export function bandY(b: number) {
  return BOARD_PAD + TITLE_H + b * (BAND_H + BAND_GAP);
}

/**
 * Computes deterministic square position for each card.
 * Evenly distributes square cards inside the BAND_W container.
 */
export function cardRect(b: number, i: number) {
  const n = BANDS[b].cards.length;
  const availW = BAND_W - BAND_PAD_X * 2;
  const totalCardsW = n * CARD_SIZE;
  const gap = n > 1 ? (availW - totalCardsW) / (n - 1) : 0;
  const x = BOARD_PAD + BAND_PAD_X + i * (CARD_SIZE + gap);
  const y = bandY(b) + CARD_TOP;
  return { x, y, w: CARD_SIZE, h: CARD_SIZE };
}

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

export function anchor(b: number, i: number, side: AnchorSide): { x: number; y: number } {
  const r = cardRect(b, i);
  switch (side) {
    case 'top':
      return { x: r.x + r.w / 2, y: r.y };
    case 'bottom':
      return { x: r.x + r.w / 2, y: r.y + r.h };
    case 'left':
      return { x: r.x, y: r.y + r.h / 2 };
    default:
      return { x: r.x + r.w, y: r.y + r.h / 2 };
  }
}

/** Orthogonal elbow path with rounded corners. */
export function elbowPath(x1: number, y1: number, x2: number, y2: number, r = 10): string {
  if (Math.abs(x1 - x2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  if (Math.abs(y1 - y2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const midY = (y1 + y2) / 2;
  const dx = Math.sign(x2 - x1);
  const dy = Math.sign(y2 - y1);
  const rr = Math.max(0, Math.min(r, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2 - 1));
  return [
    `M ${x1} ${y1}`,
    `L ${x1} ${midY - dy * rr}`,
    `Q ${x1} ${midY} ${x1 + dx * rr} ${midY}`,
    `L ${x2 - dx * rr} ${midY}`,
    `Q ${x2} ${midY} ${x2} ${midY + dy * rr}`,
    `L ${x2} ${y2}`,
  ].join(' ');
}

export function hPath(x1: number, y: number, x2: number): string {
  return `M ${x1} ${y} L ${x2} ${y}`;
}

/**
 * Right edge of a band's title chip, deliberately over-estimated so routed
 * connectors always clear the text rather than disappearing behind it.
 * badge (30) + gap (10) + Michroma title + trailing padding.
 */
export function headerRight(b: number): number {
  return BOARD_PAD + BAND_PAD_X + 30 + 10 + BANDS[b].title.length * 10.2 + 14;
}

/** Orthogonal polyline with rounded corners; consecutive duplicate points are dropped. */
export function roundedPoly(points: { x: number; y: number }[], r = 10): string {
  const pts = points.filter((p, i) => i === 0 || Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) > 0.5);
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const prev = pts[i - 1];
    const next = pts[i + 1];
    const d1 = Math.hypot(p.x - prev.x, p.y - prev.y);
    const d2 = Math.hypot(next.x - p.x, next.y - p.y);
    const rr = Math.max(0, Math.min(r, d1 / 2, d2 / 2));
    const u1x = (p.x - prev.x) / d1;
    const u1y = (p.y - prev.y) / d1;
    const u2x = (next.x - p.x) / d2;
    const u2y = (next.y - p.y) / d2;
    d += ` L ${p.x - u1x * rr} ${p.y - u1y * rr}`;
    d += ` Q ${p.x} ${p.y} ${p.x + u2x * rr} ${p.y + u2y * rr}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/**
 * Routes a connector from a source point into the top edge of a card in `targetBand`.
 * When the entry column sits under the band's title chip the line detours to the right
 * of the chip, drops into the lane between chip and cards, and comes back  so it is
 * never hidden behind the header and never crosses the title text.
 */
export function bandEntry(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  targetBand: number,
  lane = 0,
): string {
  const bY = bandY(targetBand);
  const clear = headerRight(targetBand);
  const gapY = bY - 28 - lane * 12;

  if (x2 >= clear) {
    if (Math.abs(x1 - x2) < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
    return roundedPoly([
      { x: x1, y: y1 },
      { x: x1, y: gapY },
      { x: x2, y: gapY },
      { x: x2, y: y2 },
    ]);
  }

  const detourX = clear + 26 + lane * 16;
  const laneY = bY + (LANE_Y[lane] ?? LANE_Y[LANE_Y.length - 1]);
  return roundedPoly([
    { x: x1, y: y1 },
    { x: x1, y: gapY },
    { x: detourX, y: gapY },
    { x: detourX, y: laneY },
    { x: x2, y: laneY },
    { x: x2, y: y2 },
  ]);
}

export interface Connector {
  d: string;
  type: FlowType;
  scope: Scope;
  label?: string;
  labelAt?: { x: number; y: number };
  particles: number;
  /** merge-bus stubs end on a trunk, not on a card  no arrowhead */
  noArrow?: boolean;
  /** explicit end cap for connectors that stop in open board rather than on a card */
  terminator?: { x: number; y: number; kind: 'dot' | 'open' };
}

const FLOW_COLOR: Record<FlowType, string> = {
  poc: '#EA580C',
  full: '#2563EB',
  alert: '#DC2626',
  dashed: '#94A3B8',
};
export { FLOW_COLOR };

function vConn(b1: number, c1: number, b2: number, c2: number, type: FlowType, particles: number, opts?: { label?: string; dx1?: number; dx2?: number; lane?: number }): Connector {
  const a = anchor(b1, c1, 'bottom');
  const z = anchor(b2, c2, 'top');
  const x1 = a.x + (opts?.dx1 ?? 0);
  const x2 = z.x + (opts?.dx2 ?? 0);
  const scope: Scope = type === 'full' || type === 'dashed' ? 'full' : 'poc';
  return {
    d: bandEntry(x1, a.y, x2, z.y, b2, opts?.lane ?? 0),
    type,
    scope,
    particles,
    label: opts?.label,
    labelAt: opts?.label ? { x: (x1 + x2) / 2, y: (a.y + z.y) / 2 } : undefined,
  };
}

function hConn(b: number, c1: number, c2: number, type: FlowType, particles: number, opts?: { label?: string; dy?: number }): Connector {
  const a = anchor(b, c1, 'right');
  const z = anchor(b, c2, 'left');
  const y = a.y + (opts?.dy ?? 0);
  const scope: Scope = type === 'full' || type === 'dashed' ? 'full' : 'poc';
  return {
    d: hPath(a.x, y, z.x),
    type,
    scope,
    particles,
    label: opts?.label,
    labelAt: opts?.label ? { x: (a.x + z.x) / 2, y: y - 14 } : undefined,
  };
}

/** short stub ending in free space (no target card) */
function stub(b: number, c: number, side: AnchorSide, len: number, type: FlowType, label?: string): Connector {
  const a = anchor(b, c, side);
  const x2 = side === 'right' ? a.x + len : side === 'left' ? a.x - len : a.x;
  const y2 = side === 'bottom' ? a.y + len : side === 'top' ? a.y - len : a.y;
  return {
    d: `M ${a.x} ${a.y} L ${x2} ${y2}`,
    type,
    scope: type === 'full' || type === 'dashed' ? 'full' : 'poc',
    particles: 0,
    noArrow: true,
    terminator: { x: x2, y: y2, kind: type === 'dashed' ? 'open' : 'dot' },
    label,
    labelAt: label ? { x: (a.x + x2) / 2, y: y2 + (side === 'bottom' ? 20 : side === 'top' ? -20 : 0) } : undefined,
  };
}

const RAIL_X = BOARD_PAD + BAND_W + RAIL_GAP; // left edge of the rail
const RAIL_TAP_X = RAIL_X - 10; // dashed taps stop just short of the rail, on a visible cap

export function buildConnectors(): Connector[] {
  const c: Connector[] = [];

  // Band 01 -> 02 (cards 0..5 -> nodes 0..3)
  c.push(vConn(0, 0, 1, 0, 'poc', 2, { lane: 0 }));
  c.push(vConn(0, 1, 1, 1, 'poc', 2, { lane: 1 }));
  c.push(vConn(0, 2, 1, 2, 'poc', 2));
  c.push(vConn(0, 3, 1, 3, 'poc', 2, { dx2: -24 }));
  c.push(vConn(0, 4, 1, 3, 'poc', 1));
  c.push(vConn(0, 5, 1, 3, 'poc', 1, { dx2: 24 }));
  // card 7 sensors stub
  c.push(stub(0, 6, 'bottom', 26, 'poc', 'FIELD WIRING · ANALOGUE / DIGITAL'));

  // Band 02 -> 03 (nodes converge on aggregator, with FIFO chip)
  const aggTop = anchor(2, 0, 'top');
  const busX = headerRight(2) + 26;
  const busY = bandY(2) - 44;
  for (let i = 0; i < 4; i++) {
    const a = anchor(1, i, 'bottom');
    c.push({
      d: roundedPoly([
        { x: a.x, y: a.y },
        { x: a.x, y: busY },
        { x: busX, y: busY },
      ]),
      type: 'poc',
      scope: 'poc',
      particles: 1,
      noArrow: true,
    });
  }
  // single trunk off the merge bus into the aggregator, routed clear of the band-03 title
  c.push({
    d: roundedPoly([
      { x: busX, y: busY },
      { x: busX, y: bandY(2) + LANE_Y[0] },
      { x: aggTop.x, y: bandY(2) + LANE_Y[0] },
      { x: aggTop.x, y: aggTop.y },
    ]),
    type: 'poc',
    scope: 'poc',
    particles: 2,
  });
  // FIFO label sits on the bus, right of the merge point
  c.push({
    d: '',
    type: 'poc',
    scope: 'poc',
    particles: 0,
    label: '≥10 LAKH EVENT FIFO · 10%/2 SPARE CHANNELS',
    labelAt: { x: busX + 250, y: busY },
  });
  // blue edge-of-network node to gateway
  c.push(vConn(1, 4, 2, 3, 'full', 2));

  // Band 03 linear chain 0->1->2->3
  c.push(hConn(2, 0, 1, 'poc', 1));
  c.push(hConn(2, 1, 2, 'poc', 1));
  c.push(hConn(2, 2, 3, 'poc', 1));
  // GPS clock dashed tap  up into the band's clear lane, then out to the cross-cutting rail
  const gps = anchor(2, 2, 'top');
  const tapY = bandY(2) + LANE_Y[1];
  c.push({
    d: roundedPoly([
      { x: gps.x, y: gps.y },
      { x: gps.x, y: tapY },
      { x: RAIL_TAP_X, y: tapY },
    ]),
    type: 'dashed',
    scope: 'poc',
    particles: 0,
    noArrow: true,
    terminator: { x: RAIL_TAP_X, y: tapY, kind: 'open' },
    label: 'TIME_SYNC · 7d DISCOVERY → CROSS-CUTTING',
    labelAt: { x: (gps.x + RAIL_TAP_X) / 2, y: tapY },
  });

  // Band 03 -> 04 : MQTT client feeds OFC + 4G (parallel)
  c.push(vConn(2, 3, 3, 0, 'poc', 2, { lane: 0 }));
  c.push(vConn(2, 3, 3, 1, 'poc', 2, { dx1: 26 }));
  // failover loop between OFC and 4G with label cleanly below
  const ofc = cardRect(3, 0);
  const g4 = cardRect(3, 1);
  c.push({
    d: `M ${ofc.x + ofc.w - 18} ${ofc.y + ofc.h + 8} C ${ofc.x + ofc.w + 12} ${ofc.y + ofc.h + 36}, ${g4.x + 12} ${g4.y + g4.h + 36}, ${g4.x + 24} ${g4.y + g4.h + 8}`,
    type: 'poc',
    scope: 'poc',
    particles: 1,
    label: 'AUTO FAILOVER',
    labelAt: { x: (ofc.x + ofc.w + g4.x) / 2, y: ofc.y + ofc.h + 46 },
  });
  // future CCSP dashed continuation
  c.push(stub(3, 3, 'bottom', 26, 'dashed', 'CCSP MIGRATION'));

  // Band 04 -> 05 into broker
  c.push(vConn(3, 0, 4, 0, 'poc', 2, { dx2: -14, lane: 0 }));
  c.push(vConn(3, 1, 4, 0, 'poc', 2, { dx2: 14, lane: 1 }));
  // Band 05 chain broker -> authz -> registry
  c.push(hConn(4, 0, 1, 'poc', 1));
  c.push(hConn(4, 1, 2, 'poc', 1));
  // PKI dashed stubs
  c.push(stub(4, 3, 'bottom', 26, 'dashed', 'OCSP RESPONDER (PROPOSED)'));
  const pki = anchor(4, 3, 'right');
  c.push({
    d: `M ${pki.x} ${pki.y} L ${RAIL_TAP_X} ${pki.y}`,
    type: 'dashed',
    scope: 'poc',
    particles: 0,
    noArrow: true,
    terminator: { x: RAIL_TAP_X, y: pki.y, kind: 'open' },
    label: 'PKI → SECURITY & PKI',
    labelAt: { x: (pki.x + RAIL_TAP_X) / 2, y: pki.y - 20 },
  });
  c.push(stub(4, 0, 'bottom', 26, 'dashed', 'CCSP MIGRATION'));

  // Band 05 -> 06 : registry/broker -> ingestion
  c.push(vConn(4, 2, 5, 0, 'poc', 2, { lane: 0 }));

  // Band 06 internal: 0->1, 0->2, 1->3, 2->4, 1->6, 2->6
  c.push(hConn(5, 0, 1, 'poc', 1, { dy: -14 }));
  c.push(hConn(5, 1, 3, 'poc', 1, { dy: -14 }));
  // 0 -> 2 and 2 -> 4 routed below cards
  const r0 = cardRect(5, 0);
  const r2 = cardRect(5, 2);
  const r4 = cardRect(5, 4);
  const r6 = cardRect(5, 6);
  const r1 = cardRect(5, 1);
  c.push({
    d: `M ${r0.x + r0.w / 2} ${r0.y + r0.h} L ${r0.x + r0.w / 2} ${r0.y + r0.h + 16} L ${r2.x + r2.w / 2} ${r2.y + r2.h + 16} L ${r2.x + r2.w / 2} ${r2.y + r2.h}`,
    type: 'poc',
    scope: 'poc',
    particles: 1,
  });
  c.push({
    d: `M ${r2.x + r2.w / 2 + 16} ${r2.y + r2.h} L ${r2.x + r2.w / 2 + 16} ${r2.y + r2.h + 32} L ${r4.x + r4.w / 2} ${r4.y + r4.h + 32} L ${r4.x + r4.w / 2} ${r4.y + r4.h}`,
    type: 'poc',
    scope: 'poc',
    particles: 1,
  });
  // feedback labels back to ML (2 <- 4), dashed
  c.push({
    d: `M ${r4.x + r4.w / 2 - 16} ${r4.y + r4.h} L ${r4.x + r4.w / 2 - 16} ${r4.y + r4.h + 46} L ${r2.x + r2.w / 2 - 16} ${r2.y + r2.h + 46} L ${r2.x + r2.w / 2 - 16} ${r2.y + r2.h}`,
    type: 'dashed',
    scope: 'poc',
    particles: 0,
    label: 'ML LABELS',
    labelAt: { x: (r2.x + r4.x) / 2 - 30, y: r4.y + r4.h + 58 },
  });
  // taps to data lake (6) with rolling-averages chip
  c.push({
    d: `M ${r1.x + r1.w / 2 + 14} ${r1.y + r1.h} L ${r1.x + r1.w / 2 + 14} ${r1.y + r1.h + 32} L ${r6.x + r6.w / 2} ${r6.y + r6.h + 32} L ${r6.x + r6.w / 2} ${r6.y + r6.h}`,
    type: 'poc',
    scope: 'poc',
    particles: 1,
    label: '15-DAY ROLLING AVERAGES',
    labelAt: { x: (r1.x + r1.w + r6.x) / 2, y: r6.y + r6.h + 46 },
  });
  c.push({
    d: `M ${r2.x + r2.w / 2 + 40} ${r2.y + r2.h} L ${r2.x + r2.w / 2 + 40} ${r2.y + r2.h + 16} L ${r6.x + r6.w / 2 - 16} ${r6.y + r6.h + 16} L ${r6.x + r6.w / 2 - 16} ${r6.y + r6.h}`,
    type: 'poc',
    scope: 'poc',
    particles: 1,
  });

  // Band 06 -> 07
  // dashboards (5) -> users 0..2 (orange)
  c.push(vConn(5, 5, 6, 0, 'poc', 2, { dx1: -20, lane: 0 }));
  c.push(vConn(5, 5, 6, 1, 'poc', 2));
  c.push(vConn(5, 5, 6, 2, 'poc', 2, { dx1: 20 }));
  // alert engine (3) -> maintainer app (0), red
  c.push(vConn(5, 3, 6, 0, 'alert', 3, { dx2: 18, lane: 1 }));
  // blue: dashboards -> SMMS + common dashboard
  c.push(vConn(5, 5, 6, 3, 'full', 2, { dx1: 34 }));
  c.push(vConn(5, 5, 6, 4, 'full', 2, { dx1: 48 }));
  // dashed: data lake -> railway cloud copy
  c.push(vConn(5, 6, 6, 5, 'dashed', 0));

  return c;
}

// ---------- standalone SVG export ----------

export function exportSvg(mode: 'full' | 'poc'): string {
  const connectors = buildConnectors();
  const dim = (scope: Scope) => (mode === 'poc' && scope === 'full' ? ' opacity="0.22"' : '');
  let s = '';

  // defs with arrow markers
  s += `<defs>`;
  (['poc', 'full', 'alert', 'dashed'] as FlowType[]).forEach((t) => {
    s += `<marker id="arrow-${t}" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" fill="${FLOW_COLOR[t]}"/></marker>`;
  });
  s += `</defs>`;

  s += `<rect width="${BOARD_W}" height="${BOARD_H}" rx="24" fill="#FFFFFF" stroke="#E4E4E7"/>`;
  s += `<text x="${BOARD_PAD}" y="${BOARD_PAD + 28}" font-family="Michroma, sans-serif" font-size="26" font-weight="700" fill="#0A0A0A">RDPMS POC · ANIMATED LOW-LEVEL DESIGN</text>`;
  s += `<text x="${BOARD_PAD}" y="${BOARD_PAD + 52}" font-family="Geist, sans-serif" font-size="11" fill="#71717A" letter-spacing="1">REMOTE DIAGNOSTICS OF SIGNALLING ASSETS · SEVEN LAYERS FROM FIELD SENSORS TO THE RDPMS CLOUD · RDSO/SPN/257/2025 v2.0</text>`;

  BANDS.forEach((band, b) => {
    const y = bandY(b);
    const tintFill = mode === 'poc' && band.pocTint ? '#FFF1E3' : '#F4F4F6';
    s += `<rect x="${BOARD_PAD}" y="${y}" width="${BAND_W}" height="${BAND_H}" rx="16" fill="${tintFill}" stroke="${band.pocTint ? '#FB923C' : '#E4E4E7'}"${dim('poc')}/>`;
    s += `<rect x="${BOARD_PAD + BAND_PAD_X}" y="${y + 2}" width="30" height="26" rx="6" fill="#EA580C"/>`;
    s += `<text x="${BOARD_PAD + BAND_PAD_X + 15}" y="${y + 20}" font-family="Geist, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">${esc(band.num)}</text>`;
    s += `<text x="${BOARD_PAD + BAND_PAD_X + 40}" y="${y + 20}" font-family="Michroma, sans-serif" font-size="13" font-weight="600" fill="#0A0A0A" letter-spacing="1">${esc(band.title)}</text>`;
    band.cards.forEach((card, i) => {
      const r = cardRect(b, i);
      const dash = card.dashed ? ' stroke-dasharray="5 4"' : '';
      const stroke = card.scope === 'full' ? '#60A5FA' : card.accent === 'red' ? '#DC2626' : card.accent === 'amber' ? '#B45309' : '#E4E4E7';
      s += `<g${dim(card.scope)}><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14" fill="#FFFFFF" stroke="${card.dashed ? '#94A3B8' : stroke}"${dash}/>`;

      // Icon square
      const iconBg = card.scope === 'full' ? '#EFF6FF' : card.accent === 'red' ? '#FEF2F2' : card.accent === 'amber' ? '#FFFBEB' : '#FFF7ED';
      s += `<rect x="${r.x + 12}" y="${r.y + 12}" width="64" height="64" rx="14" fill="${iconBg}"/>`;
      const iconSrc = ICON_IMAGES[card.icon];
      if (iconSrc) {
        const clipId = `icon-clip-${b}-${i}`;
        s += `<clipPath id="${clipId}"><rect x="${r.x + 12}" y="${r.y + 12}" width="64" height="64" rx="14"/></clipPath>`;
        s += `<image href="${iconSrc}" x="${r.x + 12}" y="${r.y + 12}" width="64" height="64" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`;
      }

      // Title
      s += `<text x="${r.x + 12}" y="${r.y + 88}" font-family="Geist, sans-serif" font-size="11.5" font-weight="700" fill="#0A0A0A">${esc(clip(card.title, 19))}</text>`;

      // Subtitle lines
      const subLines = card.sub.split('\n');
      subLines.forEach((line, li) => {
        s += `<text x="${r.x + 12}" y="${r.y + 105 + li * 14}" font-family="Geist, sans-serif" font-size="9" fill="#52525B">${esc(line)}</text>`;
      });

      s += `</g>`;
    });
  });

  // Connectors with arrowheads
  connectors.forEach((cn) => {
    if (!cn.d) {
      // label-only connector (e.g. FIFO label)
      if (cn.label && cn.labelAt) {
        const w = cn.label.length * 5.4 + 20;
        s += `<g${dim(cn.scope)}><rect x="${cn.labelAt.x - w / 2}" y="${cn.labelAt.y - 11}" width="${w}" height="22" rx="11" fill="#FFFFFF" stroke="#E4E4E7" filter="drop-shadow(0 1px 3px rgba(9,9,11,0.14))"/>`;
        s += `<text x="${cn.labelAt.x}" y="${cn.labelAt.y + 4}" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#3F3F46" text-anchor="middle">${esc(cn.label)}</text></g>`;
      }
      return;
    }
    const dash = cn.type === 'dashed' ? ' stroke-dasharray="6 5"' : '';
    const marker = cn.type !== 'dashed' && !cn.noArrow ? ` marker-end="url(#arrow-${cn.type})"` : '';
    s += `<path d="${cn.d}" fill="none" stroke="${FLOW_COLOR[cn.type]}" stroke-width="2" stroke-linejoin="round"${dash}${marker}${dim(cn.scope)}/>`;
    if (cn.terminator) {
      const t = cn.terminator;
      s +=
        t.kind === 'open'
          ? `<circle cx="${t.x}" cy="${t.y}" r="4" fill="#FFFFFF" stroke="${FLOW_COLOR[cn.type]}" stroke-width="1.75"${dim(cn.scope)}/>`
          : `<circle cx="${t.x}" cy="${t.y}" r="3.5" fill="${FLOW_COLOR[cn.type]}"${dim(cn.scope)}/>`;
    }
    if (cn.label && cn.labelAt) {
      const w = cn.label.length * 5.4 + 20;
      s += `<g${dim(cn.scope)}><rect x="${cn.labelAt.x - w / 2}" y="${cn.labelAt.y - 11}" width="${w}" height="22" rx="11" fill="#FFFFFF" stroke="#E4E4E7" filter="drop-shadow(0 1px 3px rgba(9,9,11,0.14))"/>`;
      s += `<text x="${cn.labelAt.x}" y="${cn.labelAt.y + 4}" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#3F3F46" text-anchor="middle">${esc(cn.label)}</text></g>`;
    }
  });

  // ====== RIGHT RAIL ======
  const lx = RAIL_X;
  const ly = bandY(0);

  // --- Legend box ---
  s += `<rect x="${lx}" y="${ly}" width="${RAIL_W}" height="176" rx="12" fill="#F4F4F6" stroke="#E4E4E7"/>`;
  s += `<text x="${lx + 14}" y="${ly + 24}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">LEGEND</text>`;
  const items: [FlowType, string][] = [
    ['poc', 'POC PILOT FLOW  field to cloud'],
    ['full', 'FULL-SYSTEM ADDITIONS'],
    ['alert', 'ALERT / ESCALATION PATH'],
    ['dashed', 'PROPOSED / FUTURE (CCSP · OCSP)'],
  ];
  items.forEach(([t, label], i) => {
    const yy = ly + 48 + i * 24;
    const dash = t === 'dashed' ? ' stroke-dasharray="5 4"' : '';
    s += `<line x1="${lx + 14}" y1="${yy}" x2="${lx + 44}" y2="${yy}" stroke="${FLOW_COLOR[t]}" stroke-width="2"${dash}/><circle cx="${lx + 29}" cy="${yy}" r="3" fill="${FLOW_COLOR[t]}"/>`;
    s += `<text x="${lx + 54}" y="${yy + 3}" font-family="Geist, sans-serif" font-size="8.5" fill="#52525B">${esc(label)}</text>`;
  });
  // POC-scope + full-system component boxes
  const boxY1 = ly + 148;
  s += `<rect x="${lx + 14}" y="${boxY1}" width="34" height="14" rx="3" fill="#FFFFFF" stroke="#E4E4E7"/>`;
  s += `<text x="${lx + 54}" y="${boxY1 + 11}" font-family="Geist, sans-serif" font-size="8.5" fill="#52525B">POC-SCOPE COMPONENT</text>`;

  // --- Cross-cutting concerns ---
  const ccY = ly + 192;
  const ccItems = [
    ['Security & PKI', 'mTLS · per-vendor CA · CRL/OCSP'],
    ['Time Sync', 'GPS/IRNSS + NTP fallback'],
    ['Availability', '§16 formulas · ≥99% POC target'],
    ['Governance', 'RDSO approvals · clause 13.9 AI/ML'],
    ['Interoperability', 'Annexure F APIs · CCSP migration'],
  ];
  s += `<rect x="${lx}" y="${ccY}" width="${RAIL_W}" height="${52 + ccItems.length * 44}" rx="12" fill="#F4F4F6" stroke="#94A3B8" stroke-dasharray="5 4"/>`;
  s += `<text x="${lx + 14}" y="${ccY + 22}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">CROSS-CUTTING CONCERNS</text>`;
  s += `<text x="${lx + 14}" y="${ccY + 36}" font-family="Geist, sans-serif" font-size="9" fill="#71717A">Applies to every layer</text>`;
  ccItems.forEach(([title, sub], i) => {
    const iy = ccY + 52 + i * 44;
    s += `<rect x="${lx + 12}" y="${iy}" width="${RAIL_W - 24}" height="36" rx="8" fill="#FFFFFF" stroke="#E4E4E7"/>`;
    s += `<circle cx="${lx - 4}" cy="${iy + 18}" r="4" fill="#2563EB"/>`;
    s += `<text x="${lx + 22}" y="${iy + 16}" font-family="Geist, sans-serif" font-size="11" font-weight="600" fill="#0A0A0A">${esc(title)}</text>`;
    s += `<text x="${lx + 22}" y="${iy + 30}" font-family="Geist, sans-serif" font-size="8.5" fill="#71717A">${esc(sub)}</text>`;
  });

  // --- Notes box ---
  const notesY = ccY + 52 + ccItems.length * 44 + 16;
  const noteTexts = [
    'Applies to every layer  governance is a boundary',
    'around the pipeline, never a stage inside it.',
    '',
    'Dashed taps  each dashed connector marks a control',
    'point where policy is enforced and evidence captured.',
  ];
  s += `<rect x="${lx}" y="${notesY}" width="${RAIL_W}" height="${24 + noteTexts.length * 14}" rx="12" fill="#F4F4F6" stroke="#E4E4E7"/>`;
  noteTexts.forEach((line, i) => {
    if (line) {
      s += `<text x="${lx + 14}" y="${notesY + 20 + i * 14}" font-family="Geist, sans-serif" font-size="9" fill="#71717A">${esc(line)}</text>`;
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${BOARD_W}" height="${BOARD_H}" viewBox="0 0 ${BOARD_W} ${BOARD_H}">${s}</svg>`;
}

function esc(t: string) {
  if (!t) return '';
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
function clip(t: string, n: number) {
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}
