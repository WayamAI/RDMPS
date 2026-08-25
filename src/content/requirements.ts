export type RequirementStatus = 'required' | 'site-dependent' | 'future-compatible';

export interface RequirementSource {
  pdfPage: number;
  section: string;
}

export interface Requirement {
  id: string;
  title: string;
  detail: string;
  status: RequirementStatus;
  source: RequirementSource;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  summary: string;
  requirements: readonly Requirement[];
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: 'field-acquisition',
    title: 'Field sensing and acquisition',
    summary: 'Capture dependable equipment signals without disturbing signalling circuits.',
    requirements: [
      {
        id: 'field-asset-coverage',
        title: 'Surveyed signalling-asset coverage',
        detail:
          'Monitor the specified point machines, electric lifting barriers, signals, track circuits and axle counters using the parameters and acquisition methods defined for those assets.',
        status: 'required',
        source: { pdfPage: 12, section: 'Outdoor assets and monitored parameters' },
      },
      {
        id: 'equipment-room-monitoring',
        title: 'Equipment-room environment monitoring',
        detail:
          'Record ambient temperature and humidity for battery, relay and power rooms and the specified outdoor locations.',
        status: 'required',
        source: { pdfPage: 14, section: 'Indoor assets and equipment-room environment' },
      },
      {
        id: 'purchaser-selected-assets',
        title: 'Purchaser-selected asset scope',
        detail:
          'Treat the signalling assets and quantities selected by the purchaser as required delivery scope, including optional asset classes only when selected in the schedule of work.',
        status: 'required',
        source: { pdfPage: 33, section: 'Information provided by purchaser Railway' },
      },
      {
        id: 'asset-telemetry',
        title: 'Analogue and digital asset telemetry',
        detail:
          'Capture asset parameters from sensors, digital inputs, potential-free contacts and diagnostic ports and transmit them through the station gateway.',
        status: 'required',
        source: { pdfPage: 15, section: 'IoT device data acquisition' },
      },
      {
        id: 'event-sampling',
        title: 'Event sampling at 20 ms or less (≤20 ms)',
        detail:
          'Capture voltage and current at 20 ms or less during each point-machine or electric lifting-barrier operation. This is event-based capture, not continuous sampling of every channel.',
        status: 'required',
        source: { pdfPage: 68, section: 'Event-based parameter exchange' },
      },
      {
        id: 'current-sensing',
        title: 'Non-intrusive current measurement',
        detail:
          'Use non-intrusive current sensors so measurement does not interfere with the signalling circuit.',
        status: 'required',
        source: { pdfPage: 10, section: 'External sensor requirements' },
      },
      {
        id: 'sensor-accuracy',
        title: 'Defined sensor accuracy',
        detail:
          'Use sensors compliant with IEC 60688 Class 1; current sensors may use 2% accuracy or better.',
        status: 'required',
        source: { pdfPage: 11, section: 'Sensor standards and accuracy' },
      },
      {
        id: 'sensor-drift',
        title: 'Annual calibration stability',
        detail: 'Check calibration annually and keep annual drift less than 2% (<2%).',
        status: 'required',
        source: { pdfPage: 11, section: 'Sensor calibration' },
      },
      {
        id: 'spare-channels',
        title: 'Capacity for field expansion',
        detail:
          'Provide max(10%, 2) spare IoT channels at each location: 10% or two channels, whichever is greater.',
        status: 'required',
        source: { pdfPage: 17, section: 'IoT expansion capacity' },
      },
      {
        id: 'field-power',
        title: 'Tolerant field power input',
        detail:
          'Operate IoT devices and station gateways from 24V DC (+20% / -30%), normally supplied by the station power system.',
        status: 'required',
        source: { pdfPage: 19, section: 'Station gateway power supply' },
      },
      {
        id: 'iot-health',
        title: 'IoT and sensor health reporting',
        detail:
          'Send periodic IoT-device and sensor health status to the station gateway for onward continuous monitoring by the application.',
        status: 'required',
        source: { pdfPage: 15, section: 'IoT and sensor health status' },
      },
    ],
  },
  {
    id: 'edge-network',
    title: 'Edge resilience and communications',
    summary: 'Retain events through outages and maintain independent station uplinks.',
    requirements: [
      {
        id: 'system-health',
        title: 'Device and network health monitoring',
        detail:
          'Continuously monitor sensors, IoT devices, station gateways and network infrastructure and alert on failures or malfunctions.',
        status: 'required',
        source: { pdfPage: 7, section: 'System health monitoring' },
      },
      {
        id: 'gateway-audit',
        title: 'Station-gateway audit access',
        detail:
          'Support authorized local access for configuration, real-time logs, unauthorized-access audit logs and saved data.',
        status: 'required',
        source: { pdfPage: 19, section: 'Station gateway logs and audit access' },
      },
      {
        id: 'gateway-time-sync',
        title: 'Gateway time synchronization fallback',
        detail:
          'Synchronize the station gateway from the application time source and use GPS with IRNSS reference when the network or API-based NTP source is unavailable.',
        status: 'required',
        source: { pdfPage: 20, section: 'Network time synchronization' },
      },
      {
        id: 'iot-buffer',
        title: 'IoT event retention',
        detail:
          'Each IoT device stores at least 10 lakh events (≥10 lakh) in first-in, first-out order without losing events during power or communication failure.',
        status: 'required',
        source: { pdfPage: 15, section: 'IoT event memory' },
      },
      {
        id: 'gateway-buffer',
        title: 'Gateway event retention',
        detail:
          'Each station gateway stores at least 50 lakh events (≥50 lakh) in first-in, first-out order without losing events during power or communication failure.',
        status: 'required',
        source: { pdfPage: 18, section: 'Station gateway event memory' },
      },
      {
        id: 'resource-headroom',
        title: 'Vital computing headroom',
        detail:
          'Keep normal use of CPU, memory and storage at or below 70% (≤70%), with utilization externally verifiable or visible in the system.',
        status: 'required',
        source: { pdfPage: 18, section: 'Station gateway hardware utilization' },
      },
      {
        id: 'station-uplinks',
        title: 'Primary and redundant station uplinks',
        detail:
          'Use the Railway optical or IP network as the primary station-to-platform path and provide mandatory LTE, 4G or 5G connectivity in parallel as the redundant path, with at least 10 Mbps (≥10 Mbps).',
        status: 'required',
        source: { pdfPage: 22, section: 'Station gateway network' },
      },
      {
        id: 'local-media',
        title: 'Site-planned field media',
        detail:
          'Select wired, optical or wireless media between field IoT devices and the station gateway to suit local conditions and Railway planning.',
        status: 'site-dependent',
        source: { pdfPage: 20, section: 'Field network media' },
      },
    ],
  },
  {
    id: 'platform-data',
    title: 'Platform data and interoperability',
    summary: 'Connect existing station systems and make operational data reusable across Railway services.',
    requirements: [
      {
        id: 'publish-subscribe',
        title: 'Publish-subscribe data exchange',
        detail:
          'Exchange station-gateway and application data using the specified publish-subscribe model and standard packet formats.',
        status: 'required',
        source: { pdfPage: 23, section: 'Standard publish-subscribe data format' },
      },
      {
        id: 'middleware-security',
        title: 'Encrypted middleware connections',
        detail:
          'Secure publisher, subscriber and intermediate-service-platform communication using TLS and certificate-based client authentication.',
        status: 'required',
        source: { pdfPage: 70, section: 'ISP technical and security considerations' },
      },
      {
        id: 'middleware-access-audit',
        title: 'Topic authorization and security audit',
        detail:
          'Restrict clients to authorized topics, reject unauthorized attempts, and log transactions, authentication events and security violations.',
        status: 'required',
        source: { pdfPage: 70, section: 'ISP access control, logging and monitoring' },
      },
      {
        id: 'middleware-operations',
        title: 'Reliable middleware transactions',
        detail:
          'Provide acknowledgment, retry, encryption, transaction logging and auditing for intermediate-service-platform exchanges.',
        status: 'required',
        source: { pdfPage: 69, section: 'Intermediate service platform operations' },
      },
      {
        id: 'application-processing',
        title: 'Application ingestion and diagnostic processing',
        detail:
          'Receive standard gateway packets and process them with standard logic, data analysis and machine-learning models for diagnostic and predictive outcomes.',
        status: 'required',
        source: { pdfPage: 23, section: 'RDPMS application processing' },
      },
      {
        id: 'application-alerts',
        title: 'Application alert delivery',
        detail:
          'Generate failure, prediction and health alerts with causes and deliver them to Railway mobile, desktop and divisional-control users.',
        status: 'required',
        source: { pdfPage: 23, section: 'RDPMS alerts and health inputs' },
      },
      {
        id: 'model-lifecycle',
        title: 'Machine-learning model lifecycle',
        detail:
          'Train, update and review predictive models using field and maintenance feedback, and implement feedback from periodic Railway review.',
        status: 'required',
        source: { pdfPage: 27, section: 'Machine-learning updates and review' },
      },
      {
        id: 'application-users',
        title: 'Web, mobile and management access',
        detail:
          'Provide web and mobile access with station, division, headquarters and guest roles and the specified desktop and mobile user interfaces.',
        status: 'required',
        source: { pdfPage: 24, section: 'Application access, roles and user interfaces' },
      },
      {
        id: 'station-interfaces',
        title: 'Existing station-system interfaces',
        detail:
          'Provide built-in interfaces and protocol conversion for the Data Logger and Integrated Power Supply, with additional equipment interfaces where required.',
        status: 'required',
        source: { pdfPage: 17, section: 'Station gateway interfaces' },
      },
      {
        id: 'railway-cloud',
        title: 'Railway Cloud copy',
        detail:
          'Send image packets and parameter packets to Railway Cloud from the station gateway or intermediate service platform, as Railway management decides.',
        status: 'required',
        source: { pdfPage: 69, section: 'Railway Cloud packet copy' },
      },
      {
        id: 'maintenance-integration',
        title: 'Maintenance-system integration',
        detail:
          'Provide maintenance APIs and data formats to receive asset details and return requested parameter values.',
        status: 'required',
        source: { pdfPage: 25, section: 'Maintenance system interlinking' },
      },
      {
        id: 'dashboard-integration',
        title: 'Management reporting integration',
        detail:
          'Provide common dashboard APIs for management reports, including alert, telemetry, asset and performance information.',
        status: 'required',
        source: { pdfPage: 180, section: 'Management dashboard interfaces' },
      },
      {
        id: 'data-retention',
        title: 'Operational history retention',
        detail: 'Provide two-year storage, retaining all server data for at least two years.',
        status: 'required',
        source: { pdfPage: 26, section: 'Application hosting and storage' },
      },
      {
        id: 'future-platform',
        title: 'Future shared-service compatibility',
        detail:
          'Be ready to support the C-DOT common service platform and oneM2M over MQTT if Railway planning adopts it later.',
        status: 'future-compatible',
        source: { pdfPage: 70, section: 'Future shared-service platform' },
      },
    ],
  },
  {
    id: 'assurance',
    title: 'Security, assurance and outcomes',
    summary: 'Protect trust relationships and prove the system over its operating life.',
    requirements: [
      {
        id: 'security-monitoring',
        title: 'Unauthorized-access monitoring',
        detail:
          'Detect unauthorized login attempts, suspicious activity and data theft and notify the relevant stakeholders.',
        status: 'required',
        source: { pdfPage: 7, section: 'System security monitoring' },
      },
      {
        id: 'certificate-status',
        title: 'Certificate revocation enforcement',
        detail:
          'Use certificate-based authentication and reject compromised or unauthorized certificates through CRL or OCSP status checks.',
        status: 'required',
        source: { pdfPage: 70, section: 'Platform security controls' },
      },
      {
        id: 'warranty',
        title: '3-year system warranty',
        detail:
          'Provide a warranty period of three years from commissioning, including covered hardware, software, networking accessories and specified support.',
        status: 'required',
        source: { pdfPage: 33, section: 'Warranty and support' },
      },
      {
        id: 'type-endurance',
        title: '72-hour type-test endurance',
        detail:
          'Demonstrate 72 hours of continuous complete-system operation without performance deterioration.',
        status: 'required',
        source: { pdfPage: 30, section: 'Type-test endurance' },
      },
      {
        id: 'acceptance-endurance',
        title: '24-hour acceptance-test endurance',
        detail:
          'Demonstrate 24 hours of continuous complete-system operation without performance deterioration.',
        status: 'required',
        source: { pdfPage: 30, section: 'Acceptance-test endurance' },
      },
      {
        id: 'alert-performance',
        title: 'Alert performance after commissioning',
        detail:
          'After six months, achieve more than 60% (>60%) for failure-alert correctness, predictive-alert correctness and detected-failure coverage.',
        status: 'required',
        source: { pdfPage: 28, section: 'Performance evaluation' },
      },
    ],
  },
] as const satisfies readonly CapabilityGroup[];

export type RequirementId =
  (typeof CAPABILITY_GROUPS)[number]['requirements'][number]['id'];
