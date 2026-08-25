/** Mermaid source for Spec · reference architecture (replaces static PNG). */
export const ARCHITECTURE_MERMAID = `
flowchart TB
  subgraph USERS["07 USERS"]
    direction LR
    WEB["Web UI"]
    MOB["Mobile app"]
    SMMS["SMMS"]
    DASH["Common Dashboard"]
  end

  subgraph APP["06 RDPMS APPLICATION"]
    direction LR
    RDPMS["RDPMS Application<br/>logics · AI/ML · alerts"]
    LAKE["Data lake<br/>5 s / 20 ms store"]
  end

  subgraph ISPL["05 ISP"]
    BROKER["MQTT Broker<br/>mTLS · QoS 1 · ACL"]
  end

  subgraph GWL["03 Station Gateway"]
    GATEWAY["Edge Gateway<br/>store & forward"]
  end

  subgraph IOT["02 IoT Devices"]
    direction LR
    INDOOR["Indoor cluster"]
    OUTDOOR["Outdoor cluster"]
    FAR["Far-field IoT"]
  end

  subgraph SENS["01 Sensors / Field"]
    direction LR
    PT["Point"]
    SIG["Signal"]
    TC["Track circuit"]
    IPS["IPS / rooms"]
  end

  PT --> INDOOR
  SIG --> INDOOR
  TC --> OUTDOOR
  IPS --> INDOOR
  INDOOR --> GATEWAY
  OUTDOOR --> GATEWAY
  FAR -.-> GATEWAY
  GATEWAY -->|"MQTT :8883"| BROKER
  BROKER --> RDPMS
  RDPMS <--> LAKE
  RDPMS --> WEB
  RDPMS --> MOB
  RDPMS -.-> SMMS
  RDPMS -.-> DASH

  classDef required fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0A0A0A
  classDef all fill:#EFF6FF,stroke:#60A5FA,stroke-width:1.5px,color:#0A0A0A
  class PT,SIG,TC,IPS,INDOOR,OUTDOOR,GATEWAY,BROKER,RDPMS,LAKE,WEB,MOB required
  class FAR,SMMS,DASH all
`;

/** Mermaid Gantt for the Delivery Plan · M1–M18 overlapping phases. */
export const TIMELINE_MERMAID = `
gantt
    title RDPMS Delivery Plan — overlapping, compliance-led phasing
    dateFormat YYYY-MM-DD
    axisFormat M%m
    tickInterval 1month

    section P0 Mobilization
    Design & survey          :p0, 2025-01-01, 2025-03-31

    section P1 Lab bench
    Bench + packet suite     :p1, 2025-02-01, 2025-06-30

    section P2 Certifications
    Type tests & TEC/STQC    :p2, 2025-05-01, 2025-10-31

    section P3 Field install
    Fitment & commissioning  :p3, 2025-08-01, 2025-11-30

    section P4 Soak & AI/ML
    Monitored soak           :p4, 2025-11-01, 2026-05-31

    section P5 Graduation
    Evaluation & close-out   :p5, 2026-04-01, 2026-06-30
`;

/** Deep Dive · MQTT packet / topic path. */
export const PACKET_FLOW_MERMAID = `
flowchart LR
  NODE["IoT Node<br/>param_f / param_e"] -->|scan ≤20 ms| GW["Station Gateway<br/>store & forward"]
  GW -->|"MQTT mTLS :8883"| ISP["ISP Broker<br/>ACL + audit"]
  ISP --> INGEST["Ingestion<br/>schema validate"]
  INGEST --> LOGIC["Hard-logic + AI/ML"]
  LOGIC --> ALERT["Alert Engine<br/>≤1 min SLA"]
  ALERT --> UI["Web + Mobile<br/>Requirement modules E / G"]

  classDef required fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0A0A0A
  classDef mid fill:#FFFFFF,stroke:#E4E4E7,stroke-width:1.5px,color:#0A0A0A
  classDef alert fill:#FEF2F2,stroke:#DC2626,stroke-width:1.5px,color:#0A0A0A
  class NODE,GW,ISP required
  class INGEST,LOGIC,UI mid
  class ALERT alert
`;

/** Deep Dive · alert escalation ladder. */
export const ESCALATION_MERMAID = `
flowchart TB
  A["Asset alert raised<br/>one-alert-per-asset"] --> B["Maintainer App<br/>Ack · Requirement module G"]
  B --> C["JE / SSE Dashboard<br/>station console"]
  C --> D["ASTE / DSTE<br/>divisional escalation"]
  D --> E["SMMS / Railway Dashboard<br/>all-flows path"]

  classDef step fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#0A0A0A
  classDef all fill:#EFF6FF,stroke:#60A5FA,stroke-width:1.5px,color:#0A0A0A
  class A,B,C,D step
  class E all
`;

/** Deep Dive · PKI / mTLS chain (complements SVG). */
export const PKI_MERMAID = `
flowchart TB
  ROOT["Per-Vendor Root CA<br/>4096-bit · offline HSM"] --> ENT["Entity certificates<br/>2048-bit · per device"]
  ENT --> IOT["IoT Device"]
  ENT --> GW["Station Gateway"]
  ENT --> APP["RDPMS Application"]
  ROOT -.->|CRL / OCSP proposed| REV["Revocation path"]

  classDef root fill:#FFF7ED,stroke:#EA580C,stroke-width:1.75px,color:#0A0A0A
  classDef leaf fill:#FFFFFF,stroke:#E4E4E7,stroke-width:1.5px,color:#0A0A0A
  classDef future fill:#F4F4F6,stroke:#94A3B8,stroke-width:1.5px,stroke-dasharray:5 4,color:#52525B
  class ROOT root
  class ENT,IOT,GW,APP leaf
  class REV future
`;
