export type Phase = {
  id: string
  pill: string
  title: string
  months: string
  body: string
  deliverables: string[]
  gate: string
}

export const PHASES: Phase[] = [
  {
    id: 'P0',
    pill: 'P0',
    title: 'Mobilization & Design',
    months: 'M1–M3',
    body: 'Station survey, sensor placement design, identifier allocation (stngw_id/para_id maps), RDSO design approval.',
    deliverables: ['Station survey report', 'Sensor placement design', 'stngw_id / para_id maps', 'RDSO design approval'],
    gate: 'Design dossier signed off.',
  },
  {
    id: 'P1',
    pill: 'P1',
    title: 'Lab Bench Validation',
    months: 'M2–M6',
    body: 'Bench-simulated assets, full packet suite (all 12 types) validated against the ISP sandbox, second-vendor simulator (vcc/vgc) stood up.',
    deliverables: ['Bench-simulated asset rig', 'All 12 packet types validated', 'ISP sandbox interop', 'vcc/vgc simulator live'],
    gate: 'Interop test report.',
  },
  {
    id: 'P2',
    pill: 'P2',
    title: 'Certifications & Type Tests',
    months: 'M5–M10',
    body: 'IEC 60688 Class 1 verification, EMC, environmental, TEC 31318 declaration, STQC safe-to-host initiated.',
    deliverables: ['IEC 60688 Class 1 verification', 'EMC & environmental type tests', 'TEC 31318 declaration', 'STQC safe-to-host initiated'],
    gate: 'Certificates issued.',
  },
  {
    id: 'P3',
    pill: 'P3',
    title: 'Field Installation & Commissioning',
    months: 'M8–M11',
    body: 'Non-intrusive sensor fitment during traffic blocks, gateway + network commissioning (OFC/MPLS + 4G/5G), earthing per RDSO/SPN/197.',
    deliverables: ['Sensors fitted in traffic blocks', 'Gateway + OFC/MPLS/4G/5G commissioned', 'Earthing per RDSO/SPN/197'],
    gate: 'Station go-live.',
  },
  {
    id: 'P4',
    pill: 'P4',
    title: 'Monitored Soak & AI/ML Maturation',
    months: 'M11–M17',
    body: 'Live soak, 15-day rolling averages stabilize, hard-logic tuning, cold-start AI/ML ladder climbs, feedback workflow (T/PT/F/M) accumulates labels.',
    deliverables: ['15-day rolling averages stable', 'Hard-logic tuning complete', 'Cold-start AI/ML ladder climbing', 'T/PT/F/M feedback labels'],
    gate: 'KPI review vs >60% targets.',
  },
  {
    id: 'P5',
    pill: 'P5',
    title: 'Evaluation & Graduation',
    months: 'M16–M18',
    body: 'Requirement 16 availability computation, alert KPI audit, requirement 13.9 AI/ML review, graduation recommendation to RDSO.',
    deliverables: ['Requirement 16 availability computation', 'Alert KPI audit', 'Requirement 13.9 AI/ML review', 'Graduation recommendation'],
    gate: 'Delivery acceptance report.',
  },
]

export const REQUIRED_SCOPE = [
  'Single interlocked station (all mandatory requirement module C assets)',
  'Point machines (≥8 sensors, 20 ms signatures)',
  'DC track circuits (9 parameters per circuit)',
  'Signals (main 3+2, calling-on 3, shunt 6)',
  'IPS + 7 equipment room classes (F0–F6)',
  'IoT node + Station Gateway with MQTT over mTLS',
  'ISP middleware + requirement module E web dashboard + requirement module G app',
  'Second vendor simulation (vcc / vgc codes)',
]

export const ALL_FLOW_SCOPE = [
  'Division-wide / zone-wide multi-station rollouts',
  'Commercial Railway Telecom billing interfaces',
  'Integration with SMMS / COIS legacy ticketing systems',
  'Non-signalling asset monitoring (traction, civil, rolling stock)',
  'Production oneM2M / CCSP full schema transition',
]

export interface KpiItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
}

export const KPIS: KpiItem[] = [
  { label: 'availability target', value: 99, prefix: '≥', suffix: '%' },
  { label: 'fail_alert_per KPI', value: 60, prefix: '>', suffix: '%' },
  { label: 'pred_alert_per KPI', value: 60, prefix: '>', suffix: '%' },
  { label: 'actual_fail_alert_per', value: 60, prefix: '>', suffix: '%' },
]
