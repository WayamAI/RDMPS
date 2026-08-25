export interface RequirementModule {
  letter: string;
  title: string;
  role: string;
  chips: string[];
}

export const REQUIREMENT_MODULES: RequirementModule[] = [
  {
    letter: 'A',
    title: 'Standard field and packet naming',
    role: 'Defines identifiers and names shared by packets, interfaces, reports and screens.',
    chips: ['Naming', 'Identifiers', 'Sampling'],
  },
  {
    letter: 'B',
    title: 'Gateway and application data exchange',
    role: 'Defines publish-subscribe messages, topics, security and maintenance-system exchange.',
    chips: ['Messages', 'Topics', 'Security'],
  },
  {
    letter: 'C',
    title: 'Failure, prediction and AI model guidance',
    role: 'Defines approved threshold logic and guidance for developing and reviewing predictive models.',
    chips: ['Failure', 'Prediction', 'AI models'],
  },
  {
    letter: 'D',
    title: 'Alert workflow and application processes',
    role: 'Defines alert types, feedback, maintenance mode, escalation and performance measures.',
    chips: ['Alerts', 'Feedback', 'Escalation'],
  },
  {
    letter: 'E',
    title: 'Desktop application interface',
    role: 'Provides the desktop screen template for dashboards, alerts, telemetry and reports.',
    chips: ['Desktop', 'Reports', 'Operations'],
  },
  {
    letter: 'F',
    title: 'Common dashboard APIs',
    role: 'Defines management-report interfaces for alerts, telemetry, assets and performance.',
    chips: ['Management', 'Reports', 'APIs'],
  },
  {
    letter: 'G',
    title: 'Mobile application interface',
    role: 'Provides the mobile screen template for field monitoring and maintenance actions.',
    chips: ['Mobile', 'Monitoring', 'Maintenance'],
  },
];

export interface RequirementMapping {
  ref: string;
  requirement: string;
  lands: string;
  design: string;
}

export const REQUIREMENT_MAPPINGS: RequirementMapping[] = [
  {
    ref: 'Station uplinks',
    requirement: 'Optical or IP primary path with mandatory cellular redundancy',
    lands: 'Network and gateway',
    design:
      'The station gateway uses the Railway optical or IP network as its primary application path. LTE, 4G or 5G operates in parallel as the mandatory redundant channel, with at least 10 Mbps provisioned.',
  },
  {
    ref: 'Data custody',
    requirement: 'Data copy to Railway Cloud',
    lands: 'Station gateway or intermediate platform',
    design:
      'Image packets and parameter packets are sent to Railway Cloud from the station gateway or intermediate service platform, with the source selected by Railway management for technical feasibility.',
  },
  {
    ref: 'Model review',
    requirement: 'Periodic review of AI and machine-learning usefulness',
    lands: 'Analytics governance',
    design:
      'RDSO and Zonal Railways periodically review model usefulness. Vendors implement the resulting feedback and support the separately issued evaluation mechanism.',
  },
  {
    ref: 'Health availability',
    requirement: 'Availability reporting for field-system health',
    lands: 'Health summary and reporting',
    design:
      'Availability is calculated from accumulated healthy time over the selected duration for sensors, IoT devices, station gateways and networks. The approved document does not set a 99% target.',
  },
  {
    ref: 'Platform trust',
    requirement: 'Certificate-authenticated publish-subscribe connections',
    lands: 'Intermediate service platform',
    design:
      'Publishers and subscribers authenticate with certificates from a trusted authority. TLS protects communication, topic authorization limits access, and CRL or OCSP checks block revoked certificates.',
  },
  {
    ref: 'Event retention',
    requirement: 'IoT and gateway first-in, first-out buffers',
    lands: 'IoT devices and station gateway',
    design:
      'Each IoT device stores at least 10 lakh events and each station gateway stores at least 50 lakh events. Both retain the newest records and prevent event loss during power or communication failures.',
  },
  {
    ref: 'Fast event capture',
    requirement: 'Configurable 20 ms operation-signature sampling',
    lands: 'Point machines and electric lifting barriers',
    design:
      'Voltage and current are captured every 20 ms or faster during a point-machine or electric lifting-barrier operation. This event-specific requirement does not mandate continuous 20 ms sampling for every channel.',
  },
  {
    ref: 'Event updates',
    requirement: 'Event-to-application update time',
    lands: 'Gateway-to-application flow',
    design:
      'The existing packet scheme normally updates an event at the application within one minute. The timing may change if the approved packet-sending scheme changes.',
  },
  {
    ref: 'Alert escalation',
    requirement: 'Maintainer, engineering and officer notifications',
    lands: 'Application alert workflow',
    design:
      'Alerts go to the maintainer immediately, then to JE or SE after 30 minutes, SSE after one hour, and ASTE or DSTE after two hours. Railway configuration may change these indicative durations.',
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
    role: 'Approved requirements for remote diagnostics and predictive maintenance of signalling.',
    accent: 'orange',
  },
  {
    body: 'RDSO',
    name: 'SPN/144',
    role: 'Environmental, quality and software-change requirements for signalling equipment.',
    accent: 'orange',
  },
  {
    body: 'IEC',
    name: '60688 Class 1',
    role: 'Accuracy requirement for electrical measuring transducers; current sensors may be 2% or better.',
    accent: 'slate',
  },
  {
    body: 'IEC',
    name: '61326',
    role: 'Industrial electromagnetic-immunity requirements for field sensors and IoT devices.',
    accent: 'slate',
  },
  {
    body: 'NCCS',
    name: 'ITSAR',
    role: 'Source for permitted cryptographic controls in mutual-TLS connections.',
    accent: 'slate',
  },
  {
    body: 'TEC',
    name: '31318:2025',
    role: 'Security code of practice and declaration requirement for IoT devices and gateways.',
    accent: 'slate',
  },
  {
    body: 'STQC',
    name: 'Safe-to-Host',
    role: 'Application security and vulnerability clearance against the latest OWASP Top 10.',
    accent: 'slate',
  },
  {
    body: 'ISO/IEC',
    name: 'JTC 1/SC 42',
    role: 'Referenced family for machine-learning and artificial-intelligence algorithms.',
    accent: 'blue',
  },
  {
    body: 'C-DOT',
    name: 'CCSP / oneM2M',
    role: 'Programme recommendation: preserve future compatibility with the shared-service platform over MQTT.',
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
  { figure: 'Intermediate service platform', band: '05' },
  { figure: 'Station gateway and network', band: '03–04' },
  { figure: 'IoT devices', band: '02' },
  { figure: 'Sensors and equipment interfaces', band: '01' },
];
