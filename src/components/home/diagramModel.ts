import { CAPABILITY_GROUPS } from '@/content/requirements';
import type { RequirementId, RequirementStatus } from '@/content/requirements';

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
export const BOARD_H = BOARD_PAD + BANDS_H + 32; // 2136

export type DiagramOrientation = 'landscape' | 'portrait';

const PORTRAIT_CARD = 118;
const PORTRAIT_PAIR = 2;
const PORTRAIT_CARD_GAP = 10;
const PORTRAIT_COL_PAD = 12;
const PORTRAIT_COL_W = PORTRAIT_COL_PAD * 2 + PORTRAIT_PAIR * PORTRAIT_CARD + PORTRAIT_CARD_GAP;
const PORTRAIT_COL_GAP = 18;
const PORTRAIT_COL_HEADER = 52;
const PORTRAIT_TITLE_H = 76;
const PORTRAIT_RAIL_GAP = 16;
const PORTRAIT_RAIL_H = 108;

/** Maps every diagram icon to its locally stored 3D JPEG in public/icons. */
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

export type FlowType = RequirementStatus | 'alert';
export type Scope = RequirementStatus;

export interface CardSpec {
  title: string;
  sub: string;
  icon: string;
  status: RequirementStatus;
  requirementIds: readonly [RequirementId, ...RequirementId[]];
  accent?: 'amber' | 'red' | 'blue';
  badge?: string;
  popoverImg?: string;
  popoverCaption?: string;
}

export interface BandSpec {
  num: string;
  title: string;
  requiredTint?: boolean;
  cards: CardSpec[];
}

const REQUIREMENT_STATUS = new Map(
  CAPABILITY_GROUPS.flatMap((group) =>
    group.requirements.map((requirement) => [requirement.id, requirement.status] as const),
  ),
);

function traced(
  requirementIds: readonly [RequirementId, ...RequirementId[]],
  card: Omit<CardSpec, 'status' | 'requirementIds'>,
): CardSpec {
  const statuses = new Set(requirementIds.map((id) => REQUIREMENT_STATUS.get(id)));
  if (statuses.has(undefined) || statuses.size !== 1) {
    throw new Error(`Invalid LLD requirement trace: ${requirementIds.join(', ')}`);
  }
  return { ...card, status: [...statuses][0] as RequirementStatus, requirementIds };
}

export const BANDS: BandSpec[] = [
  {
    num: '01',
    title: 'FIELD ASSETS · SURVEY-DRIVEN REQUIRED COVERAGE',
    requiredTint: true,
    cards: [
      traced(['field-asset-coverage'], { title: 'Point machines', sub: 'Point machines\nlifting barriers', icon: 'i-point' }),
      traced(['field-asset-coverage'], { title: 'Track circuits', sub: 'Track circuits\naxle counters', icon: 'i-track' }),
      traced(['field-asset-coverage'], { title: 'Signals', sub: 'Main · calling-on\nshunt signals', icon: 'i-signal' }),
      traced(['station-interfaces'], { title: 'Data loggers / IPS', sub: 'Existing station systems\nincluded by survey', icon: 'i-power' }),
      traced(['equipment-room-monitoring'], { title: 'Relay / equipment rooms', sub: 'Power · environment\nroom conditions', icon: 'i-room' }),
      traced(['purchaser-selected-assets'], { title: 'Additional assets', sub: 'Purchaser-selected additional assets\nfrom broad survey', icon: 'i-shield-bolt' }),
      traced(['current-sensing'], { title: 'Non-intrusive / isolated sensing', sub: 'No signalling-circuit\ninterference', icon: 'i-sensor' }),
    ],
  },
  {
    num: '02',
    title: 'IoT ACQUISITION · EVENT CAPTURE, BUFFERING & HEALTH',
    requiredTint: true,
    cards: [
      traced(['event-sampling'], { title: 'Event-based capture', sub: '≤20 ms during point-machine / lifting-barrier operation\nnot universal continuous sampling', icon: 'i-point' }),
      traced(['iot-buffer'], { title: 'IoT event retention', sub: '≥10 lakh event FIFO\npower / link outage resilience', icon: 'i-db' }),
      traced(['asset-telemetry'], { title: 'Asset telemetry', sub: 'Analogue / digital events\nsurvey-defined channels', icon: 'i-signal' }),
      traced(['iot-health', 'field-power'], { title: 'IoT health', sub: 'Device status · resources\n24V DC tolerance', icon: 'i-gauge' }),
      traced(['local-media'], { title: 'Field media', sub: 'Wired / optical / wireless\nselected for site conditions', icon: 'i-antenna', accent: 'blue' }),
    ],
  },
  {
    num: '03',
    title: 'STATION GATEWAY · CONVERSION, FIFO & CONTROL',
    requiredTint: true,
    cards: [
      traced(['station-interfaces'], {
        title: 'Protocol conversion',
        sub: 'Data Logger / IPS protocol conversion\nadditional interfaces as required',
        icon: 'i-merge',
        popoverImg: '/photo-edge-gateway.jpg',
        popoverCaption: 'DIN-rail edge gateway · relay-room cabinet',
      }),
      traced(['gateway-buffer'], { title: 'Gateway retention', sub: '≥50 lakh event FIFO\noutage-safe store / forward', icon: 'i-db' }),
      traced(['gateway-audit', 'gateway-time-sync'], { title: 'Gateway assurance', sub: 'health / audit\nGPS / IRNSS fallback', icon: 'i-clock' }),
      traced(['publish-subscribe'], { title: 'Secure publisher', sub: 'Publish-subscribe client\nqueued station uplink', icon: 'i-gateway' }),
    ],
  },
  {
    num: '04',
    title: 'NETWORK · MANDATORY PARALLEL STATION UPLINKS',
    requiredTint: true,
    cards: [
      traced(['station-uplinks'], { title: 'Primary Railway path', sub: 'Railway optical / IP primary\nstation-to-platform', icon: 'i-antenna' }),
      traced(['station-uplinks'], { title: 'Parallel mobile path', sub: 'parallel LTE / 4G / 5G · ≥10 Mbps\nmandatory redundancy', icon: 'i-sensor' }),
      traced(['system-health'], { title: 'Network health', sub: 'Device + network health\npath and link visibility', icon: 'i-gauge' }),
      traced(['future-platform'], { title: 'Shared-service migration', sub: 'Future-compatible C-DOT platform\noneM2M over MQTT', icon: 'i-cloud' }),
    ],
  },
  {
    num: '05',
    title: 'SECURE PUBLISH-SUBSCRIBE MIDDLEWARE',
    requiredTint: true,
    cards: [
      traced(['publish-subscribe', 'middleware-security'], { title: 'Publish-subscribe broker', sub: 'Secure message routing\nbroker settings evidence-backed', icon: 'i-broker' }),
      traced(['certificate-status'], { title: 'Certificate trust', sub: 'certificate authentication / revocation\nCRL or OCSP checks', icon: 'i-shield' }),
      traced(['middleware-access-audit'], { title: 'Authorization & audit', sub: 'Topic access control\nsecurity event evidence', icon: 'i-file-json' }),
      traced(['middleware-operations'], { title: 'Service operations', sub: 'Acknowledgment · retry · logging\nauditable transactions', icon: 'i-gauge' }),
    ],
  },
  {
    num: '06',
    title: 'RDPMS APPLICATION · DATA, LOGIC & MODEL LIFECYCLE',
    requiredTint: true,
    cards: [
      traced(['application-processing'], { title: 'Ingestion / logic', sub: 'Schema-aware ingestion\nrules and processing', icon: 'i-file-json' }),
      traced(['application-processing'], { title: 'Diagnostic logic', sub: 'Evidence-backed rules\nfailure / prediction outcomes', icon: 'i-gauge', accent: 'amber' }),
      traced(['model-lifecycle'], { title: 'Model lifecycle', sub: 'Training · validation · deployment\nfeedback-led improvement', icon: 'i-gauge' }),
      traced(['application-alerts', 'alert-performance'], { title: 'Alert lifecycle', sub: 'Create · route · acknowledge\nperformance measured after commissioning', icon: 'i-bell', accent: 'red' }),
      traced(['model-lifecycle'], { title: 'Operational feedback', sub: 'Maintainer outcome labels\nreview and governance', icon: 'i-users' }),
      traced(['data-retention'], { title: 'Operational history', sub: 'two-year storage\nserver data retention', icon: 'i-db' }),
      traced(['railway-cloud'], { title: 'Railway Cloud copies', sub: 'Railway Cloud image + parameter copies\nmanagement-selected route', icon: 'i-cloud' }),
    ],
  },
  {
    num: '07',
    title: 'USERS & REQUIRED RAILWAY INTEGRATIONS',
    requiredTint: true,
    cards: [
      traced(['application-users'], { title: 'Web users', sub: 'web / mobile / management users\nmaintainer workflows', icon: 'i-dashboard' }),
      traced(['application-users'], { title: 'Mobile users', sub: 'Field acknowledgement\noperational access', icon: 'i-phone', accent: 'red' }),
      traced(['application-users'], { title: 'Management users', sub: 'Station · division · HQ\nrole-appropriate views', icon: 'i-users' }),
      traced(['maintenance-integration'], { title: 'Maintenance integration', sub: 'maintenance APIs\nasset and parameter exchange', icon: 'i-db' }),
      traced(['dashboard-integration'], { title: 'Management integration', sub: 'common dashboard APIs\nalert · telemetry · performance', icon: 'i-dashboard' }),
      traced(['railway-cloud'], { title: 'Cloud packet delivery', sub: 'Image + parameter packets\nrequired Railway Cloud copy', icon: 'i-cloud' }),
    ],
  },
];

// ---------- geometry helpers ----------

export function bandWidth(orientation: DiagramOrientation = 'landscape') {
  return orientation === 'portrait' ? PORTRAIT_COL_W : BAND_W;
}

export function bandX(b: number, orientation: DiagramOrientation = 'landscape') {
  if (orientation === 'landscape') return BOARD_PAD;
  return BOARD_PAD + b * (PORTRAIT_COL_W + PORTRAIT_COL_GAP);
}

export function bandHeight(b: number, orientation: DiagramOrientation = 'landscape') {
  if (orientation === 'landscape') return BAND_H;
  const rows = Math.ceil(BANDS[b].cards.length / PORTRAIT_PAIR);
  return PORTRAIT_COL_HEADER + rows * PORTRAIT_CARD + Math.max(0, rows - 1) * PORTRAIT_CARD_GAP + 12;
}

export function bandY(b: number, orientation: DiagramOrientation = 'landscape') {
  if (orientation === 'landscape') {
    return BOARD_PAD + TITLE_H + b * (BAND_H + BAND_GAP);
  }
  return BOARD_PAD + PORTRAIT_TITLE_H;
}

export function boardSize(orientation: DiagramOrientation = 'landscape') {
  if (orientation === 'landscape') return { w: BOARD_W, h: BOARD_H };
  const maxH = Math.max(...BANDS.map((_, i) => bandHeight(i, orientation)));
  return {
    w: BOARD_PAD * 2 + BANDS.length * PORTRAIT_COL_W + (BANDS.length - 1) * PORTRAIT_COL_GAP,
    h: BOARD_PAD + PORTRAIT_TITLE_H + maxH + PORTRAIT_RAIL_GAP + PORTRAIT_RAIL_H + BOARD_PAD,
  };
}

/**
 * Computes deterministic square position for each card.
 * Landscape: cards in one row per band. Portrait: layers as columns, two cards per row.
 */
export function cardRect(b: number, i: number, orientation: DiagramOrientation = 'landscape') {
  const n = BANDS[b].cards.length;
  if (orientation === 'portrait') {
    const col = i % PORTRAIT_PAIR;
    const row = Math.floor(i / PORTRAIT_PAIR);
    const colsInRow = Math.min(PORTRAIT_PAIR, n - row * PORTRAIT_PAIR);
    const rowW = colsInRow * PORTRAIT_CARD + Math.max(0, colsInRow - 1) * PORTRAIT_CARD_GAP;
    const originX = bandX(b, orientation) + (PORTRAIT_COL_W - rowW) / 2;
    return {
      x: originX + col * (PORTRAIT_CARD + PORTRAIT_CARD_GAP),
      y: bandY(b, orientation) + PORTRAIT_COL_HEADER + row * (PORTRAIT_CARD + PORTRAIT_CARD_GAP),
      w: PORTRAIT_CARD,
      h: PORTRAIT_CARD,
    };
  }
  const availW = BAND_W - BAND_PAD_X * 2;
  const totalCardsW = n * CARD_SIZE;
  const gap = n > 1 ? (availW - totalCardsW) / (n - 1) : 0;
  const x = BOARD_PAD + BAND_PAD_X + i * (CARD_SIZE + gap);
  const y = bandY(b) + CARD_TOP;
  return { x, y, w: CARD_SIZE, h: CARD_SIZE };
}

export type AnchorSide = 'top' | 'bottom' | 'left' | 'right';

export function anchor(
  b: number,
  i: number,
  side: AnchorSide,
  orientation: DiagramOrientation = 'landscape',
): { x: number; y: number } {
  const r = cardRect(b, i, orientation);
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
export function headerRight(b: number, orientation: DiagramOrientation = 'landscape'): number {
  if (orientation === 'portrait') {
    return bandX(b, orientation) + PORTRAIT_COL_W;
  }
  const titleW = BANDS[b].title.length * 10.2;
  const maxTitle = bandWidth(orientation) - BAND_PAD_X - 54;
  return BOARD_PAD + BAND_PAD_X + 30 + 10 + Math.min(titleW, maxTitle) + 14;
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
  orientation: DiagramOrientation = 'landscape',
): string {
  const bY = bandY(targetBand, orientation);
  const clear = headerRight(targetBand, orientation);
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
  dashed?: boolean;
  /** merge-bus stubs end on a trunk, not on a card  no arrowhead */
  noArrow?: boolean;
  /** explicit end cap for connectors that stop in open board rather than on a card */
  terminator?: { x: number; y: number; kind: 'dot' | 'open' };
}

const FLOW_COLOR: Record<FlowType, string> = {
  required: '#EA580C',
  'site-dependent': '#2563EB',
  'future-compatible': '#94A3B8',
  alert: '#DC2626',
};
export { FLOW_COLOR };

function vConn(
  b1: number,
  c1: number,
  b2: number,
  c2: number,
  type: FlowType,
  particles: number,
  opts?: { label?: string; dx1?: number; dx2?: number; lane?: number; orientation?: DiagramOrientation },
): Connector {
  const ori = opts?.orientation ?? 'landscape';
  const scope: Scope = type === 'alert' ? 'required' : type;
  if (ori === 'portrait') {
    const a = anchor(b1, c1, 'right', ori);
    const z = anchor(b2, c2, 'left', ori);
    const y1 = a.y + (opts?.dx1 ?? 0);
    const y2 = z.y + (opts?.dx2 ?? 0);
    const lane = opts?.lane ?? 0;
    const gapX = (a.x + z.x) / 2 + (lane - 0.5) * 8;
    return {
      d: roundedPoly([
        { x: a.x, y: y1 },
        { x: gapX, y: y1 },
        { x: gapX, y: y2 },
        { x: z.x, y: y2 },
      ]),
      type,
      scope,
      particles,
      label: opts?.label,
      labelAt: opts?.label ? { x: gapX, y: (y1 + y2) / 2 } : undefined,
    };
  }
  const a = anchor(b1, c1, 'bottom', ori);
  const z = anchor(b2, c2, 'top', ori);
  const x1 = a.x + (opts?.dx1 ?? 0);
  const x2 = z.x + (opts?.dx2 ?? 0);
  return {
    d: bandEntry(x1, a.y, x2, z.y, b2, opts?.lane ?? 0, ori),
    type,
    scope,
    particles,
    label: opts?.label,
    labelAt: opts?.label ? { x: (x1 + x2) / 2, y: (a.y + z.y) / 2 } : undefined,
  };
}

function hConn(
  b: number,
  c1: number,
  c2: number,
  type: FlowType,
  particles: number,
  opts?: { label?: string; dy?: number; orientation?: DiagramOrientation },
): Connector {
  const ori = opts?.orientation ?? 'landscape';
  const right = anchor(b, c1, 'right', ori);
  const left = anchor(b, c2, 'left', ori);
  const scope: Scope = type === 'alert' ? 'required' : type;
  if (Math.abs(right.y - left.y) < 8) {
    const y = right.y + (opts?.dy ?? 0);
    return {
      d: hPath(right.x, y, left.x),
      type,
      scope,
      particles,
      label: opts?.label,
      labelAt: opts?.label ? { x: (right.x + left.x) / 2, y: y - 14 } : undefined,
    };
  }
  const from = cardRect(b, c1, ori);
  const to = cardRect(b, c2, ori);
  const a = from.y <= to.y ? anchor(b, c1, 'bottom', ori) : anchor(b, c1, 'top', ori);
  const z = from.y <= to.y ? anchor(b, c2, 'top', ori) : anchor(b, c2, 'bottom', ori);
  return {
    d: roundedPoly([
      a,
      { x: a.x, y: (a.y + z.y) / 2 },
      { x: z.x, y: (a.y + z.y) / 2 },
      z,
    ]),
    type,
    scope,
    particles,
    label: opts?.label,
    labelAt: opts?.label ? { x: (a.x + z.x) / 2, y: (a.y + z.y) / 2 } : undefined,
  };
}

/** short stub ending in free space (no target card) */
function stub(
  b: number,
  c: number,
  side: AnchorSide,
  len: number,
  type: FlowType,
  label?: string,
  dashed = false,
  orientation: DiagramOrientation = 'landscape',
): Connector {
  const a = anchor(b, c, side, orientation);
  const x2 = side === 'right' ? a.x + len : side === 'left' ? a.x - len : a.x;
  const y2 = side === 'bottom' ? a.y + len : side === 'top' ? a.y - len : a.y;
  return {
    d: `M ${a.x} ${a.y} L ${x2} ${y2}`,
    type,
    scope: type === 'alert' ? 'required' : type,
    particles: 0,
    dashed,
    noArrow: true,
    terminator: { x: x2, y: y2, kind: dashed ? 'open' : 'dot' },
    label,
    labelAt: label ? { x: (a.x + x2) / 2, y: y2 + (side === 'bottom' ? 20 : side === 'top' ? -20 : 0) } : undefined,
  };
}

const RAIL_X = BOARD_PAD + BAND_W + RAIL_GAP; // left edge of the landscape rail
const RAIL_TAP_X = RAIL_X - 10; // dashed taps stop just short of the rail, on a visible cap

export function buildConnectors(orientation: DiagramOrientation = 'landscape'): Connector[] {
  const c: Connector[] = [];
  const rect = (b: number, i: number) => cardRect(b, i, orientation);
  const anc = (b: number, i: number, side: AnchorSide) => anchor(b, i, side, orientation);
  const bY = (b: number) => bandY(b, orientation);
  const hR = (b: number) => headerRight(b, orientation);
  const tapX =
    orientation === 'portrait'
      ? bandX(BANDS.length - 1, orientation) + PORTRAIT_COL_W + 8
      : RAIL_TAP_X;
  const vc = (
    b1: number,
    c1: number,
    b2: number,
    c2: number,
    type: FlowType,
    particles: number,
    opts?: { label?: string; dx1?: number; dx2?: number; lane?: number },
  ) => vConn(b1, c1, b2, c2, type, particles, { ...opts, orientation });
  const hc = (
    b: number,
    c1: number,
    c2: number,
    type: FlowType,
    particles: number,
    opts?: { label?: string; dy?: number },
  ) => hConn(b, c1, c2, type, particles, { ...opts, orientation });
  const st = (
    b: number,
    card: number,
    side: AnchorSide,
    len: number,
    type: FlowType,
    label?: string,
    dashed = false,
  ) => stub(b, card, side, len, type, label, dashed, orientation);

  // Band 01 -> 02 (cards 0..5 -> nodes 0..3)
  c.push(vc(0, 0, 1, 0, 'required', 2, { lane: 0 }));
  c.push(vc(0, 1, 1, 1, 'required', 2, { lane: 1 }));
  c.push(vc(0, 2, 1, 2, 'required', 2));
  c.push(vc(0, 3, 1, 3, 'required', 2, { dx2: -24 }));
  c.push(vc(0, 4, 1, 3, 'required', 1));
  c.push(vc(0, 5, 1, 3, 'required', 1, { dx2: 24 }));
  // card 7 sensors stub
  c.push(st(0, 6, 'bottom', 26, 'required', 'FIELD WIRING · ANALOGUE / DIGITAL'));

  // Band 02 -> 03 (nodes converge on aggregator, with FIFO chip)
  if (orientation === 'portrait') {
    const busX = bandX(2, orientation) - PORTRAIT_COL_GAP / 2;
    for (let i = 0; i < 4; i++) {
      const a = anc(1, i, 'right');
      c.push({
        d: `M ${a.x} ${a.y} L ${busX} ${a.y}`,
        type: 'required',
        scope: 'required',
        particles: 1,
        noArrow: true,
      });
    }
    const aggLeft = anc(2, 0, 'left');
    const busTop = anc(1, 0, 'right');
    c.push({
      d: roundedPoly([
        { x: busX, y: busTop.y },
        { x: busX, y: aggLeft.y },
        { x: aggLeft.x, y: aggLeft.y },
      ]),
      type: 'required',
      scope: 'required',
      particles: 2,
    });
    c.push({
      d: '',
      type: 'required',
      scope: 'required',
      particles: 0,
      label: '≥10 LAKH EVENT FIFO',
      labelAt: { x: busX, y: (busTop.y + aggLeft.y) / 2 },
    });
  } else {
    const aggTop = anc(2, 0, 'top');
    const busX = Math.min(hR(2) + 26, BOARD_PAD + bandWidth(orientation) - 80);
    const busY = bY(2) - 44;
    for (let i = 0; i < 4; i++) {
      const a = anc(1, i, 'bottom');
      c.push({
        d: roundedPoly([
          { x: a.x, y: a.y },
          { x: a.x, y: busY },
          { x: busX, y: busY },
        ]),
        type: 'required',
        scope: 'required',
        particles: 1,
        noArrow: true,
      });
    }
    c.push({
      d: roundedPoly([
        { x: busX, y: busY },
        { x: busX, y: bY(2) + LANE_Y[0] },
        { x: aggTop.x, y: bY(2) + LANE_Y[0] },
        { x: aggTop.x, y: aggTop.y },
      ]),
      type: 'required',
      scope: 'required',
      particles: 2,
    });
    c.push({
      d: '',
      type: 'required',
      scope: 'required',
      particles: 0,
      label: '≥10 LAKH EVENT FIFO · 10%/2 SPARE CHANNELS',
      labelAt: { x: busX + 250, y: busY },
    });
  }
  // blue edge-of-network node to gateway
  c.push(vc(1, 4, 2, 3, 'site-dependent', 2));

  // Band 03 linear chain 0->1->2->3
  c.push(hc(2, 0, 1, 'required', 1));
  c.push(hc(2, 1, 2, 'required', 1));
  c.push(hc(2, 2, 3, 'required', 1));
  // GPS clock dashed tap
  if (orientation === 'portrait') {
    c.push(st(2, 2, 'left', 22, 'required', 'TIME_SYNC', true));
  } else {
    const gps = anc(2, 2, 'top');
    const tapY = bY(2) + LANE_Y[1];
    c.push({
      d: roundedPoly([
        { x: gps.x, y: gps.y },
        { x: gps.x, y: tapY },
        { x: tapX, y: tapY },
      ]),
      type: 'required',
      scope: 'required',
      particles: 0,
      dashed: true,
      noArrow: true,
      terminator: { x: tapX, y: tapY, kind: 'open' },
      label: 'TIME_SYNC · 7d DISCOVERY → CROSS-CUTTING',
      labelAt: { x: (gps.x + tapX) / 2, y: tapY },
    });
  }

  // Band 03 -> 04 : MQTT client feeds OFC + 4G (parallel)
  c.push(vc(2, 3, 3, 0, 'required', 2, { lane: 0 }));
  c.push(vc(2, 3, 3, 1, 'required', 2, { dx1: 26 }));
  // mandatory parallel path relationship between Railway and mobile uplinks
  const ofc = rect(3, 0);
  const g4 = rect(3, 1);
  c.push({
    d: `M ${ofc.x + ofc.w - 18} ${ofc.y + ofc.h + 8} C ${ofc.x + ofc.w + 12} ${ofc.y + ofc.h + 36}, ${g4.x + 12} ${g4.y + g4.h + 36}, ${g4.x + 24} ${g4.y + g4.h + 8}`,
    type: 'required',
    scope: 'required',
    particles: 1,
    label: 'MANDATORY PARALLEL / REDUNDANT PATHS',
    labelAt: { x: (ofc.x + ofc.w + g4.x) / 2, y: ofc.y + ofc.h + 46 },
  });
  // future CCSP dashed continuation
  c.push(st(3, 3, 'bottom', 26, 'future-compatible', 'FUTURE SHARED-SERVICE MIGRATION', true));

  // Band 04 -> 05 into broker
  c.push(vc(3, 0, 4, 0, 'required', 2, { dx2: -14, lane: 0 }));
  c.push(vc(3, 1, 4, 0, 'required', 2, { dx2: 14, lane: 1 }));
  // Band 05 chain broker -> authz -> registry
  c.push(hc(4, 0, 1, 'required', 1));
  c.push(hc(4, 1, 2, 'required', 1));
  // PKI dashed stubs
  c.push(st(4, 3, 'bottom', 26, 'required', 'CERTIFICATE STATUS CHECK', true));
  if (orientation === 'portrait') {
    c.push(st(4, 3, 'right', 22, 'required', 'PKI', true));
  } else {
    const pki = anc(4, 3, 'right');
    c.push({
      d: `M ${pki.x} ${pki.y} L ${tapX} ${pki.y}`,
      type: 'required',
      scope: 'required',
      particles: 0,
      dashed: true,
      noArrow: true,
      terminator: { x: tapX, y: pki.y, kind: 'open' },
      label: 'PKI → SECURITY & PKI',
      labelAt: { x: (pki.x + tapX) / 2, y: pki.y - 20 },
    });
  }
  c.push(st(4, 0, 'bottom', 26, 'future-compatible', 'FUTURE PLATFORM ADAPTER', true));

  // Band 05 -> 06 : registry/broker -> ingestion
  c.push(vc(4, 2, 5, 0, 'required', 2, { lane: 0 }));

  // Band 06 internal: 0->1, 0->2, 1->3, 2->4, 1->6, 2->6
  c.push(hc(5, 0, 1, 'required', 1, { dy: -14 }));
  c.push(hc(5, 1, 3, 'required', 1, { dy: -14 }));
  // 0 -> 2 and 2 -> 4 routed below cards
  const r0 = rect(5, 0);
  const r2 = rect(5, 2);
  const r4 = rect(5, 4);
  const r6 = rect(5, 6);
  const r1 = rect(5, 1);
  c.push({
    d: `M ${r0.x + r0.w / 2} ${r0.y + r0.h} L ${r0.x + r0.w / 2} ${r0.y + r0.h + 16} L ${r2.x + r2.w / 2} ${r2.y + r2.h + 16} L ${r2.x + r2.w / 2} ${r2.y + r2.h}`,
    type: 'required',
    scope: 'required',
    particles: 1,
  });
  c.push({
    d: `M ${r2.x + r2.w / 2 + 16} ${r2.y + r2.h} L ${r2.x + r2.w / 2 + 16} ${r2.y + r2.h + 32} L ${r4.x + r4.w / 2} ${r4.y + r4.h + 32} L ${r4.x + r4.w / 2} ${r4.y + r4.h}`,
    type: 'required',
    scope: 'required',
    particles: 1,
  });
  // feedback labels back to ML (2 <- 4), dashed
  c.push({
    d: `M ${r4.x + r4.w / 2 - 16} ${r4.y + r4.h} L ${r4.x + r4.w / 2 - 16} ${r4.y + r4.h + 46} L ${r2.x + r2.w / 2 - 16} ${r2.y + r2.h + 46} L ${r2.x + r2.w / 2 - 16} ${r2.y + r2.h}`,
    type: 'required',
    scope: 'required',
    particles: 0,
    dashed: true,
    label: 'ML LABELS',
    labelAt: { x: (r2.x + r4.x) / 2 - 30, y: r4.y + r4.h + 58 },
  });
  // taps to data lake (6) with rolling-averages chip
  c.push({
    d: `M ${r1.x + r1.w / 2 + 14} ${r1.y + r1.h} L ${r1.x + r1.w / 2 + 14} ${r1.y + r1.h + 32} L ${r6.x + r6.w / 2} ${r6.y + r6.h + 32} L ${r6.x + r6.w / 2} ${r6.y + r6.h}`,
    type: 'required',
    scope: 'required',
    particles: 1,
    label: '15-DAY ROLLING AVERAGES',
    labelAt: { x: (r1.x + r1.w + r6.x) / 2, y: r6.y + r6.h + 46 },
  });
  c.push({
    d: `M ${r2.x + r2.w / 2 + 40} ${r2.y + r2.h} L ${r2.x + r2.w / 2 + 40} ${r2.y + r2.h + 16} L ${r6.x + r6.w / 2 - 16} ${r6.y + r6.h + 16} L ${r6.x + r6.w / 2 - 16} ${r6.y + r6.h}`,
    type: 'required',
    scope: 'required',
    particles: 1,
  });

  // Band 06 -> 07
  // dashboards (5) -> users 0..2 (orange)
  c.push(vc(5, 5, 6, 0, 'required', 2, { dx1: -20, lane: 0 }));
  c.push(vc(5, 5, 6, 1, 'required', 2));
  c.push(vc(5, 5, 6, 2, 'required', 2, { dx1: 20 }));
  // alert engine (3) -> maintainer app (0), red
  c.push(vc(5, 3, 6, 0, 'alert', 3, { dx2: 18, lane: 1 }));
  // required integrations: maintenance, common dashboard and Railway Cloud packet copy
  c.push(vc(5, 5, 6, 3, 'required', 2, { dx1: 34 }));
  c.push(vc(5, 5, 6, 4, 'required', 2, { dx1: 48 }));
  c.push(vc(5, 6, 6, 5, 'required', 1));

  return c;
}

// ---------- standalone SVG export ----------

function bytesToDataUri(bytes: ArrayBuffer, mime: string): string {
  const view = new Uint8Array(bytes);
  const chunk = 0x8000;
  let binary = '';
  for (let i = 0; i < view.length; i += chunk) {
    binary += String.fromCharCode(...view.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

/** Load each local 3D JPEG and build self-contained data URIs for SVG export. */
export async function loadIconDataUris(
  fetcher: typeof fetch = fetch,
): Promise<Record<string, string>> {
  const loaded = await Promise.all(
    Object.entries(ICON_IMAGES).map(async ([id, src]) => {
      const response = await fetcher(src);
      if (!response.ok) {
        throw new Error(`Unable to load diagram icons (${response.status}).`);
      }
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength === 0) {
        throw new Error(`Unable to load diagram icons: missing ${id}.`);
      }
      const mime = response.headers.get('Content-Type')?.split(';')[0].trim() || 'image/jpeg';
      return [id, bytesToDataUri(bytes, mime)] as const;
    }),
  );
  return Object.fromEntries(loaded);
}

export function exportSvg(
  mode: 'all' | 'required',
  iconDataUris: Record<string, string> = {},
  orientation: DiagramOrientation = 'landscape',
): string {
  const connectors = buildConnectors(orientation);
  const { w: boardW, h: boardH } = boardSize(orientation);
  let s = '';

  // Embedded CSS animations (connector draw-in + reduced-motion guard)
  s += `<style><![CDATA[
    .connector-draw {
      stroke-dasharray: 3000;
      stroke-dashoffset: 3000;
      animation: connector-draw 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes connector-draw {
      to { stroke-dashoffset: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .connector-draw { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
      .flow-particle { display: none; }
    }
  ]]></style>`;

  // defs: arrow markers + embedded icon images (data URIs) + per-card clip paths
  s += `<defs>`;
  (['required', 'site-dependent', 'future-compatible', 'alert'] as FlowType[]).forEach((t) => {
    s += `<marker id="arrow-${t}" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 z" fill="${FLOW_COLOR[t]}"/></marker>`;
  });
  Object.entries(iconDataUris).forEach(([id, dataUri]) => {
    if (!dataUri) return;
    // Escape & in data URIs for XML attribute safety; keep the payload otherwise intact.
    const safeHref = dataUri.replace(/&/g, '&amp;');
    s += `<symbol id="ico-${esc(id)}" viewBox="0 0 64 64"><image width="64" height="64" href="${safeHref}" preserveAspectRatio="xMidYMid slice"/></symbol>`;
  });
  BANDS.forEach((band, b) => {
    band.cards.forEach((_, i) => {
      const r = cardRect(b, i, orientation);
      const icon = orientation === 'portrait' ? 44 : 64;
      const inset = orientation === 'portrait' ? 8 : 12;
      s += `<clipPath id="icon-clip-${b}-${i}"><rect x="${r.x + inset}" y="${r.y + inset}" width="${icon}" height="${icon}" rx="10"/></clipPath>`;
    });
  });
  s += `</defs>`;

  s += `<rect width="${boardW}" height="${boardH}" rx="24" fill="#FFFFFF" stroke="#E4E4E7"/>`;
  const headingSize = orientation === 'portrait' ? 18 : 26;
  s += `<text x="${BOARD_PAD}" y="${BOARD_PAD + (orientation === 'portrait' ? 24 : 28)}" font-family="Michroma, sans-serif" font-size="${headingSize}" font-weight="700" fill="#0A0A0A">RDPMS · REQUIRED SYSTEM LOW-LEVEL DESIGN</text>`;
  s += `<text x="${BOARD_PAD}" y="${BOARD_PAD + (orientation === 'portrait' ? 44 : 52)}" font-family="Geist, sans-serif" font-size="${orientation === 'portrait' ? 10 : 11}" fill="#71717A" letter-spacing="1">REMOTE DIAGNOSTICS OF SIGNALLING ASSETS · SEVEN LAYERS FROM FIELD SENSORS TO THE RDPMS CLOUD · RDSO/SPN/257/2025 v2.0</text>`;

  BANDS.forEach((band, b) => {
    const x = orientation === 'portrait' ? bandX(b, orientation) : BOARD_PAD;
    const y = bandY(b, orientation);
    const w = bandWidth(orientation);
    const h = bandHeight(b, orientation);
    const tintFill = mode === 'required' && band.requiredTint ? '#FFF1E3' : '#F4F4F6';
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${tintFill}" stroke="${band.requiredTint ? '#FB923C' : '#E4E4E7'}"/>`;
    s += `<rect x="${x + 8}" y="${y + (orientation === 'portrait' ? 8 : 2)}" width="${orientation === 'portrait' ? 24 : 30}" height="${orientation === 'portrait' ? 20 : 26}" rx="6" fill="#EA580C"/>`;
    s += `<text x="${x + 8 + (orientation === 'portrait' ? 12 : 15)}" y="${y + (orientation === 'portrait' ? 22 : 20)}" font-family="Geist, sans-serif" font-size="${orientation === 'portrait' ? 11 : 13}" font-weight="700" fill="#FFFFFF" text-anchor="middle">${esc(band.num)}</text>`;
    const titleLines = wrapWords(band.title, orientation === 'portrait' ? 28 : 72, orientation === 'portrait' ? 2 : 2);
    titleLines.forEach((line, li) => {
      const titleX = x + (orientation === 'portrait' ? 36 : BAND_PAD_X + 40);
      const titleY = orientation === 'portrait' ? y + 22 + li * 12 : y + 20 + li * 14;
      s += `<text x="${titleX}" y="${titleY}" font-family="Michroma, sans-serif" font-size="${orientation === 'portrait' ? 8 : 13}" font-weight="600" fill="#0A0A0A" letter-spacing="${orientation === 'portrait' ? 0.2 : 1}">${esc(line)}</text>`;
    });
    band.cards.forEach((card, i) => {
      if (mode === 'required' && card.status !== 'required') return;
      const r = cardRect(b, i, orientation);
      const isFuture = card.status === 'future-compatible';
      const dash = isFuture ? ' stroke-dasharray="5 4"' : '';
      const stroke = card.status === 'site-dependent' ? '#60A5FA' : card.accent === 'red' ? '#DC2626' : card.accent === 'amber' ? '#B45309' : '#E4E4E7';
      s += `<g><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14" fill="#FFFFFF" stroke="${isFuture ? '#94A3B8' : stroke}"${dash}/>`;

      // Icon square
      const iconSize = orientation === 'portrait' ? 44 : 64;
      const iconInset = orientation === 'portrait' ? 8 : 12;
      const iconBg = card.status === 'site-dependent' ? '#EFF6FF' : isFuture ? '#F4F4F5' : card.accent === 'red' ? '#FEF2F2' : card.accent === 'amber' ? '#FFFBEB' : '#FFF7ED';
      s += `<rect x="${r.x + iconInset}" y="${r.y + iconInset}" width="${iconSize}" height="${iconSize}" rx="${orientation === 'portrait' ? 10 : 14}" fill="${iconBg}"/>`;
      if (iconDataUris[card.icon]) {
        s += `<g clip-path="url(#icon-clip-${b}-${i})"><use href="#ico-${esc(card.icon)}" x="${r.x + iconInset}" y="${r.y + iconInset}" width="${iconSize}" height="${iconSize}"/></g>`;
      }
      s += `<text x="${r.x + r.w - 6}" y="${r.y + 16}" font-family="Geist, sans-serif" font-size="${orientation === 'portrait' ? 5.5 : 6.5}" font-weight="700" fill="${card.status === 'required' ? '#EA580C' : card.status === 'site-dependent' ? '#2563EB' : '#71717A'}" text-anchor="end">${esc(card.status.toUpperCase())}</text>`;

      const cardTitleLines = wrapWords(card.title, orientation === 'portrait' ? 14 : 18, 2);
      const titleY0 = r.y + (orientation === 'portrait' ? 62 : 88);
      cardTitleLines.forEach((line, li) => {
        s += `<text x="${r.x + 8}" y="${titleY0 + li * (orientation === 'portrait' ? 11 : 13)}" font-family="Geist, sans-serif" font-size="${orientation === 'portrait' ? 9.5 : 11.5}" font-weight="700" fill="#0A0A0A">${esc(line)}</text>`;
      });

      const subLines = card.sub
        .split('\n')
        .flatMap((line) => wrapWords(line, orientation === 'portrait' ? 20 : 27, 2))
        .slice(0, orientation === 'portrait' ? 2 : 3);
      const subStart = r.y + (orientation === 'portrait' ? 86 : Math.max(105, 88 + cardTitleLines.length * 13 + 6));
      subLines.forEach((line, li) => {
        s += `<text x="${r.x + 8}" y="${subStart + li * (orientation === 'portrait' ? 11 : 13)}" font-family="Geist, sans-serif" font-size="${orientation === 'portrait' ? 7.5 : 9}" fill="#52525B">${esc(line)}</text>`;
      });

      s += `</g>`;
    });
  });

  // Connectors with arrowheads + draw-in animation
  connectors.forEach((cn, i) => {
    if (mode === 'required' && cn.scope !== 'required') return;
    if (!cn.d) {
      // label-only connector (e.g. FIFO label)
      if (cn.label && cn.labelAt) {
        const w = cn.label.length * 5.4 + 20;
        s += `<g><rect x="${cn.labelAt.x - w / 2}" y="${cn.labelAt.y - 11}" width="${w}" height="22" rx="11" fill="#FFFFFF" stroke="#E4E4E7"/>`;
        s += `<text x="${cn.labelAt.x}" y="${cn.labelAt.y + 4}" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#3F3F46" text-anchor="middle">${esc(cn.label)}</text></g>`;
      }
      return;
    }
    const isDashed = cn.dashed === true;
    const dash = isDashed ? ' stroke-dasharray="6 5"' : '';
    const marker = !isDashed && !cn.noArrow ? ` marker-end="url(#arrow-${cn.type})"` : '';
    const drawClass = isDashed ? '' : ` class="connector-draw" style="animation-delay:${(0.4 + (i % 14) * 0.06).toFixed(2)}s"`;
    s += `<path d="${cn.d}" fill="none" stroke="${FLOW_COLOR[cn.type]}" stroke-width="2" stroke-linejoin="round"${dash}${marker}${drawClass}/>`;
    if (cn.terminator) {
      const t = cn.terminator;
      s +=
        t.kind === 'open'
          ? `<circle cx="${t.x}" cy="${t.y}" r="4" fill="#FFFFFF" stroke="${FLOW_COLOR[cn.type]}" stroke-width="1.75"/>`
          : `<circle cx="${t.x}" cy="${t.y}" r="3.5" fill="${FLOW_COLOR[cn.type]}"/>`;
    }
    if (cn.label && cn.labelAt) {
      const w = cn.label.length * 5.4 + 20;
      s += `<g><rect x="${cn.labelAt.x - w / 2}" y="${cn.labelAt.y - 11}" width="${w}" height="22" rx="11" fill="#FFFFFF" stroke="#E4E4E7"/>`;
      s += `<text x="${cn.labelAt.x}" y="${cn.labelAt.y + 4}" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#3F3F46" text-anchor="middle">${esc(cn.label)}</text></g>`;
    }
  });

  // Flow particles (SMIL animateMotion — works in standalone SVG files)
  connectors.forEach((cn, i) => {
    if (!cn.d || cn.particles <= 0) return;
    if (mode === 'required' && cn.scope !== 'required') return;
    for (let j = 0; j < cn.particles; j++) {
      const delay = 1.2 + ((i * 7 + j * 13) % 20) / 10 + j * 1.1;
      const dur = cn.type === 'alert' ? 2.2 : 2.6 + ((i + j) % 3) * 0.6;
      s += `<circle class="flow-particle" r="3.5" fill="${FLOW_COLOR[cn.type]}" opacity="0">`;
      s += `<animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="${cn.d}"/>`;
      s += `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>`;
      s += `</circle>`;
    }
  });

  // ====== RIGHT RAIL (landscape) or BOTTOM RAIL (portrait) ======
  const lx = orientation === 'portrait' ? BOARD_PAD : RAIL_X;
  const maxColH = Math.max(...BANDS.map((_, i) => bandHeight(i, orientation)));
  const ly =
    orientation === 'portrait' ? BOARD_PAD + PORTRAIT_TITLE_H + maxColH + PORTRAIT_RAIL_GAP : bandY(0);
  const railW = orientation === 'portrait' ? boardW - BOARD_PAD * 2 : RAIL_W;
  const items: [FlowType, string][] = [
    ['required', 'REQUIRED · DELIVERED CAPABILITY'],
    ['site-dependent', 'SITE-DEPENDENT · MEDIA CHOSEN LOCALLY'],
    ['alert', 'ALERT / ESCALATION PATH'],
    ['future-compatible', 'FUTURE-COMPATIBLE · NOT CURRENT DELIVERY'],
  ].filter(([status]) => mode === 'all' || status === 'required' || status === 'alert') as [FlowType, string][];
  const ccItems = [
    ['Security & PKI', 'Gateway, broker & platform certificates · CRL/OCSP'],
    ['Time Sync', 'Gateway timestamping · GPS/IRNSS fallback'],
    ['Health', 'IoT, gateway & station-uplink visibility'],
    ['Governance', 'Application logic, models & audit evidence'],
    ['Interoperability', 'Gateway conversion · maintenance/dashboard APIs'],
  ];

  if (orientation === 'portrait') {
    s += `<rect x="${lx}" y="${ly}" width="${railW}" height="${PORTRAIT_RAIL_H}" rx="12" fill="#F4F4F6" stroke="#E4E4E7"/>`;
    s += `<text x="${lx + 14}" y="${ly + 20}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">LEGEND</text>`;
    items.forEach(([t, label], i) => {
      const xx = lx + 14 + i * 310;
      const dash = t === 'future-compatible' ? ' stroke-dasharray="5 4"' : '';
      s += `<line x1="${xx}" y1="${ly + 38}" x2="${xx + 28}" y2="${ly + 38}" stroke="${FLOW_COLOR[t]}" stroke-width="2"${dash}/><circle cx="${xx + 14}" cy="${ly + 38}" r="3" fill="${FLOW_COLOR[t]}"/>`;
      s += `<text x="${xx + 36}" y="${ly + 41}" font-family="Geist, sans-serif" font-size="8" fill="#52525B">${esc(label)}</text>`;
    });
    s += `<text x="${lx + 14}" y="${ly + 64}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">CROSS-CUTTING CONCERNS</text>`;
    ccItems.forEach(([title], i) => {
      const xx = lx + 14 + (i % 5) * 390;
      s += `<rect x="${xx}" y="${ly + 74}" width="372" height="24" rx="6" fill="#FFFFFF" stroke="#E4E4E7"/>`;
      s += `<circle cx="${xx + 10}" cy="${ly + 86}" r="3" fill="#2563EB"/>`;
      s += `<text x="${xx + 20}" y="${ly + 90}" font-family="Geist, sans-serif" font-size="9" font-weight="600" fill="#0A0A0A">${esc(title)}</text>`;
    });
  } else {
    const legendH = 210;
    s += `<rect x="${lx}" y="${ly}" width="${railW}" height="${legendH}" rx="12" fill="#F4F4F6" stroke="#E4E4E7"/>`;
    s += `<text x="${lx + 14}" y="${ly + 24}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">LEGEND</text>`;
    items.forEach(([t, label], i) => {
      const yy = ly + 48 + i * 24;
      const dash = t === 'future-compatible' ? ' stroke-dasharray="5 4"' : '';
      s += `<line x1="${lx + 14}" y1="${yy}" x2="${lx + 44}" y2="${yy}" stroke="${FLOW_COLOR[t]}" stroke-width="2"${dash}/><circle cx="${lx + 29}" cy="${yy}" r="3" fill="${FLOW_COLOR[t]}"/>`;
      s += `<text x="${lx + 54}" y="${yy + 3}" font-family="Geist, sans-serif" font-size="8.5" fill="#52525B">${esc(label)}</text>`;
    });
    const boxY1 = ly + 148;
    s += `<rect x="${lx + 14}" y="${boxY1}" width="34" height="14" rx="3" fill="#FFFFFF" stroke="#E4E4E7"/>`;
    s += `<text x="${lx + 54}" y="${boxY1 + 11}" font-family="Geist, sans-serif" font-size="8.5" fill="#52525B">REQUIRED-SYSTEM COMPONENT</text>`;
    if (mode === 'all') {
      const boxY2 = ly + 170;
      s += `<rect x="${lx + 14}" y="${boxY2}" width="34" height="14" rx="3" fill="#EFF6FF" stroke="#60A5FA"/>`;
      s += `<text x="${lx + 54}" y="${boxY2 + 11}" font-family="Geist, sans-serif" font-size="8.5" fill="#52525B">SITE-DEPENDENT COMPONENT</text>`;
    }
    const ccY = ly + legendH + 16;
    s += `<rect x="${lx}" y="${ccY}" width="${railW}" height="${52 + ccItems.length * 44}" rx="12" fill="#F4F4F6" stroke="#94A3B8" stroke-dasharray="5 4"/>`;
    s += `<text x="${lx + 14}" y="${ccY + 22}" font-family="Geist, sans-serif" font-size="10" font-weight="700" fill="#71717A" letter-spacing="1.5">CROSS-CUTTING CONCERNS</text>`;
    s += `<text x="${lx + 14}" y="${ccY + 36}" font-family="Geist, sans-serif" font-size="9" fill="#71717A">Scope stated for each control</text>`;
    ccItems.forEach(([title, sub], i) => {
      const iy = ccY + 52 + i * 44;
      s += `<rect x="${lx + 12}" y="${iy}" width="${railW - 24}" height="36" rx="8" fill="#FFFFFF" stroke="#E4E4E7"/>`;
      s += `<circle cx="${lx - 4}" cy="${iy + 18}" r="4" fill="#2563EB"/>`;
      s += `<text x="${lx + 22}" y="${iy + 16}" font-family="Geist, sans-serif" font-size="11" font-weight="600" fill="#0A0A0A">${esc(title)}</text>`;
      s += `<text x="${lx + 22}" y="${iy + 30}" font-family="Geist, sans-serif" font-size="8.5" fill="#71717A">${esc(sub)}</text>`;
    });
    const notesY = ccY + 52 + ccItems.length * 44 + 16;
    const noteTexts = [
      'Each control names the components it governs.',
      'No control is implied outside that stated scope.',
      '',
      'Grey dashed — future-compatible, not current delivery.',
      'Orange dashed — required control or feedback link.',
    ];
    s += `<rect x="${lx}" y="${notesY}" width="${railW}" height="${24 + noteTexts.length * 14}" rx="12" fill="#F4F4F6" stroke="#E4E4E7"/>`;
    noteTexts.forEach((line, i) => {
      if (line) {
        s += `<text x="${lx + 14}" y="${notesY + 20 + i * 14}" font-family="Geist, sans-serif" font-size="9" fill="#71717A">${esc(line)}</text>`;
      }
    });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}">${s}</svg>`;
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

/** Word-wrap for SVG text; last line may be ellipsized. */
function wrapWords(text: string, maxLen: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let cur = '';
  for (let wi = 0; wi < words.length; wi++) {
    const w = words[wi];
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLen) {
      cur = next;
      continue;
    }
    if (cur) lines.push(cur);
    if (lines.length >= maxLines - 1) {
      const rest = words.slice(wi).join(' ');
      lines.push(rest.length > maxLen ? rest.slice(0, maxLen - 1) + '…' : rest);
      return lines;
    }
    cur = w.length > maxLen ? w.slice(0, maxLen - 1) + '…' : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}
