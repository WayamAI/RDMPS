import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CAPABILITY_GROUPS } from '@/content/requirements';
import { BANDS, BOARD_W, ICON_IMAGES, buildConnectors, cardRect, exportSvg, loadIconDataUris } from './diagramModel';

const cards = BANDS.flatMap((band) => band.cards);
const modelCopy = () =>
  [
    ...BANDS.flatMap((band) => [band.title, ...band.cards.flatMap((card) => [card.title, card.sub])]),
    ...buildConnectors().flatMap((connector) => connector.label ?? []),
  ].join(' | ');

describe('LLD capability model', () => {
  it('structurally traces every required card to existing approved evidence', () => {
    const approvedIds = new Set(
      CAPABILITY_GROUPS.flatMap((group) => group.requirements.map(({ id }) => id)),
    );

    cards
      .filter(({ status }) => status === 'required')
      .forEach(({ requirementIds }) => {
        expect(requirementIds?.length).toBeGreaterThan(0);
        requirementIds?.forEach((id) => expect(approvedIds.has(id)).toBe(true));
      });
  });

  it('keeps every card claim attached to its exact evidence and status', () => {
    const actual = Object.fromEntries(
      cards.map(({ title, status, sub, requirementIds }) => [
        title,
        { status, sub, requirementIds },
      ]),
    );

    expect(actual).toEqual({
      'Point machines': { status: 'required', sub: 'Point machines\nlifting barriers', requirementIds: ['field-asset-coverage'] },
      'Track circuits': { status: 'required', sub: 'Track circuits\naxle counters', requirementIds: ['field-asset-coverage'] },
      Signals: { status: 'required', sub: 'Main · calling-on\nshunt signals', requirementIds: ['field-asset-coverage'] },
      'Data loggers / IPS': { status: 'required', sub: 'Existing station systems\nincluded by survey', requirementIds: ['station-interfaces'] },
      'Relay / equipment rooms': { status: 'required', sub: 'Power · environment\nroom conditions', requirementIds: ['equipment-room-monitoring'] },
      'Additional assets': { status: 'required', sub: 'Purchaser-selected additional assets\nfrom broad survey', requirementIds: ['purchaser-selected-assets'] },
      'Non-intrusive / isolated sensing': { status: 'required', sub: 'No signalling-circuit\ninterference', requirementIds: ['current-sensing'] },
      'Event-based capture': { status: 'required', sub: '≤20 ms during point-machine / lifting-barrier operation\nnot universal continuous sampling', requirementIds: ['event-sampling'] },
      'IoT event retention': { status: 'required', sub: '≥10 lakh event FIFO\npower / link outage resilience', requirementIds: ['iot-buffer'] },
      'Asset telemetry': { status: 'required', sub: 'Analogue / digital events\nsurvey-defined channels', requirementIds: ['asset-telemetry'] },
      'IoT health': { status: 'required', sub: 'Device status · resources\n24V DC tolerance', requirementIds: ['iot-health', 'field-power'] },
      'Field media': { status: 'site-dependent', sub: 'Wired / optical / wireless\nselected for site conditions', requirementIds: ['local-media'] },
      'Protocol conversion': { status: 'required', sub: 'Data Logger / IPS protocol conversion\nadditional interfaces as required', requirementIds: ['station-interfaces'] },
      'Gateway retention': { status: 'required', sub: '≥50 lakh event FIFO\noutage-safe store / forward', requirementIds: ['gateway-buffer'] },
      'Gateway assurance': { status: 'required', sub: 'health / audit\nGPS / IRNSS fallback', requirementIds: ['gateway-audit', 'gateway-time-sync'] },
      'Secure publisher': { status: 'required', sub: 'Publish-subscribe client\nqueued station uplink', requirementIds: ['publish-subscribe'] },
      'Primary Railway path': { status: 'required', sub: 'Railway optical / IP primary\nstation-to-platform', requirementIds: ['station-uplinks'] },
      'Parallel mobile path': { status: 'required', sub: 'parallel LTE / 4G / 5G · ≥10 Mbps\nmandatory redundancy', requirementIds: ['station-uplinks'] },
      'Network health': { status: 'required', sub: 'Device + network health\npath and link visibility', requirementIds: ['system-health'] },
      'Shared-service migration': { status: 'future-compatible', sub: 'Future-compatible C-DOT platform\noneM2M over MQTT', requirementIds: ['future-platform'] },
      'Publish-subscribe broker': { status: 'required', sub: 'Secure message routing\nbroker settings evidence-backed', requirementIds: ['publish-subscribe', 'middleware-security'] },
      'Certificate trust': { status: 'required', sub: 'certificate authentication / revocation\nCRL or OCSP checks', requirementIds: ['certificate-status'] },
      'Authorization & audit': { status: 'required', sub: 'Topic access control\nsecurity event evidence', requirementIds: ['middleware-access-audit'] },
      'Service operations': { status: 'required', sub: 'Acknowledgment · retry · logging\nauditable transactions', requirementIds: ['middleware-operations'] },
      'Ingestion / logic': { status: 'required', sub: 'Schema-aware ingestion\nrules and processing', requirementIds: ['application-processing'] },
      'Diagnostic logic': { status: 'required', sub: 'Evidence-backed rules\nfailure / prediction outcomes', requirementIds: ['application-processing'] },
      'Model lifecycle': { status: 'required', sub: 'Training · validation · deployment\nfeedback-led improvement', requirementIds: ['model-lifecycle'] },
      'Alert lifecycle': { status: 'required', sub: 'Create · route · acknowledge\nperformance measured after commissioning', requirementIds: ['application-alerts', 'alert-performance'] },
      'Operational feedback': { status: 'required', sub: 'Maintainer outcome labels\nreview and governance', requirementIds: ['model-lifecycle'] },
      'Operational history': { status: 'required', sub: 'two-year storage\nserver data retention', requirementIds: ['data-retention'] },
      'Railway Cloud copies': { status: 'required', sub: 'Railway Cloud image + parameter copies\nmanagement-selected route', requirementIds: ['railway-cloud'] },
      'Web users': { status: 'required', sub: 'web / mobile / management users\nmaintainer workflows', requirementIds: ['application-users'] },
      'Mobile users': { status: 'required', sub: 'Field acknowledgement\noperational access', requirementIds: ['application-users'] },
      'Management users': { status: 'required', sub: 'Station · division · HQ\nrole-appropriate views', requirementIds: ['application-users'] },
      'Maintenance integration': { status: 'required', sub: 'maintenance APIs\nasset and parameter exchange', requirementIds: ['maintenance-integration'] },
      'Management integration': { status: 'required', sub: 'common dashboard APIs\nalert · telemetry · performance', requirementIds: ['dashboard-integration'] },
      'Cloud packet delivery': { status: 'required', sub: 'Image + parameter packets\nrequired Railway Cloud copy', requirementIds: ['railway-cloud'] },
    });
  });

  it('keeps connector claims attached to exact flow scopes', () => {
    const labelledConnectors = Object.fromEntries(
      buildConnectors()
        .filter(({ label }) => label)
        .map(({ label, scope, type }) => [label, { scope, type }]),
    );

    expect(labelledConnectors).toEqual({
      'FIELD WIRING · ANALOGUE / DIGITAL': { scope: 'required', type: 'required' },
      '≥10 LAKH EVENT FIFO · 10%/2 SPARE CHANNELS': { scope: 'required', type: 'required' },
      'TIME_SYNC · 7d DISCOVERY → CROSS-CUTTING': { scope: 'required', type: 'required' },
      'MANDATORY PARALLEL / REDUNDANT PATHS': { scope: 'required', type: 'required' },
      'FUTURE SHARED-SERVICE MIGRATION': { scope: 'future-compatible', type: 'future-compatible' },
      'CERTIFICATE STATUS CHECK': { scope: 'required', type: 'required' },
      'PKI → SECURITY & PKI': { scope: 'required', type: 'required' },
      'FUTURE PLATFORM ADAPTER': { scope: 'future-compatible', type: 'future-compatible' },
      'ML LABELS': { scope: 'required', type: 'required' },
      '15-DAY ROLLING AVERAGES': { scope: 'required', type: 'required' },
    });
  });

  it('scopes 20 ms event capture exactly to point-machine and lifting-barrier operations', () => {
    const eventCard = cards.find(({ title }) => title === 'Event-based capture');

    expect(eventCard?.sub).toContain('point-machine');
    expect(eventCard?.sub).toContain('lifting-barrier');
    expect(eventCard?.sub).toContain('not universal continuous sampling');
    expect(eventCard?.sub).not.toMatch(/track|signal|axle|IPS/i);
  });

  it('uses the approved requirement statuses for every traced capability', () => {
    const approvedStatus = new Map(
      CAPABILITY_GROUPS.flatMap((group) =>
        group.requirements.map((requirement) => [requirement.id, requirement.status] as const),
      ),
    );

    expect(new Set(cards.map(({ status }) => status))).toEqual(
      new Set(['required', 'site-dependent', 'future-compatible']),
    );
    cards.forEach((card) => {
      card.requirementIds?.forEach((id) => expect(card.status).toBe(approvedStatus.get(id)));
    });
  });

  it('limits conditional and future capabilities to their truthful statuses', () => {
    expect(cards.find(({ title }) => title === 'Field media')?.status).toBe('site-dependent');
    expect(cards.find(({ title }) => title === 'Shared-service migration')?.status).toBe(
      'future-compatible',
    );

    const futureCopy = cards
      .filter(({ status }) => status === 'future-compatible')
      .flatMap(({ title, sub }) => [title, sub])
      .join(' | ');
    expect(futureCopy).toContain('C-DOT');
    expect(futureCopy).toContain('oneM2M');
  });

  it('does not repeat unsupported precision, reliability, QoS, alert-count or standards claims', () => {
    const copy = `${modelCopy()} | ${exportSvg('all')}`;

    expect(copy).not.toMatch(/µs|microsecond/i);
    expect(copy).not.toMatch(/[≥>]99%/);
    expect(copy).not.toMatch(/QoS\s*1/i);
    expect(copy).not.toMatch(/\b\d+\s*(?:pred|fail|alerts?)\b/i);
    expect(copy).not.toMatch(/ISO\/IEC\s*(?:5338|42001|23894)/i);
    expect(copy).not.toMatch(/20\s*ms\s*(?:continuous|scan|sample bursts?)/i);
    expect(copy).not.toMatch(/AUTO FAILOVER/i);
    expect(copy).not.toMatch(/per-vendor CA/i);
    expect(copy).not.toMatch(/applies to every layer/i);
  });

  it('omits non-required cards and connectors from required-only SVG export', () => {
    const svg = exportSvg('required');

    expect(svg).not.toContain('Field media');
    expect(svg).not.toContain('Shared-service migration');
    expect(svg).not.toContain('FUTURE SHARED-SERVICE MIGRATION');
    expect(svg).not.toContain('SITE-DEPENDENT');
    expect(svg).not.toContain('opacity="0.18"');
  });

  it('loads every used local 3D icon and embeds each one in SVG export', async () => {
    const usedIds = new Set(cards.map(({ icon }) => icon));
    expect(Object.keys(ICON_IMAGES).sort()).toEqual([...usedIds].sort());
    Object.values(ICON_IMAGES).forEach((src) => {
      expect(src).toMatch(/^\/icons\/.+\.jpeg$/);
      expect(readFileSync(new URL(`../../../public${src}`, import.meta.url)).length).toBeGreaterThan(0);
    });

    const icons = await loadIconDataUris(async (input) => {
      const src = String(input);
      const bytes = readFileSync(new URL(`../../../public${src}`, import.meta.url));
      return new Response(bytes, { headers: { 'Content-Type': 'image/jpeg' } });
    });

    usedIds.forEach((id) => expect(icons[id]).toMatch(/^data:image\/jpeg/));

    const svg = exportSvg('all', icons);
    usedIds.forEach((id) => {
      expect(svg).toContain(`id="ico-${id}"`);
      expect(svg).toContain(`href="#ico-${id}"`);
    });
  });

  it('surfaces icon loading failures instead of silently omitting artwork', async () => {
    await expect(
      loadIconDataUris(async () => new Response('missing', { status: 404 })),
    ).rejects.toThrow(/diagram icons/i);
  });

  it('exports the same status vocabulary and preserves offline animation hooks', () => {
    const svg = exportSvg('all');

    expect(svg).toContain('REQUIRED');
    expect(svg).toContain('SITE-DEPENDENT');
    expect(svg).toContain('FUTURE-COMPATIBLE');
    expect(svg).toContain('connector-draw');
    expect(svg).toContain('<animateMotion');
  });

  it('exports a compact side-by-side layers SVG', () => {
    const field0 = cardRect(0, 0, 'portrait');
    const field1 = cardRect(0, 1, 'portrait');
    const field2 = cardRect(0, 2, 'portrait');
    const iot0 = cardRect(1, 0, 'portrait');

    expect(field1.x).toBeGreaterThan(field0.x);
    expect(field1.y).toBe(field0.y);
    expect(field2.x).toBe(field0.x);
    expect(field2.y).toBeGreaterThan(field0.y);
    expect(iot0.x).toBeGreaterThan(field1.x);

    const svg = exportSvg('all', {}, 'portrait');
    const width = Number(svg.match(/width="(\d+(?:\.\d+)?)"/)?.[1]);
    const height = Number(svg.match(/height="(\d+(?:\.\d+)?)"/)?.[1]);

    expect(width).toBeGreaterThan(BOARD_W);
    expect(height).toBeLessThan(1100);
    cards.forEach(({ title }) => {
      expect(svg).toContain(title.split(/\s+/)[0]);
    });
    expect(svg).toContain('LEGEND');
    expect(svg).toContain('CROSS-CUTTING CONCERNS');
  });
});
