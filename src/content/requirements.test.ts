import { describe, expect, it } from 'vitest';
import { REQUIREMENT_MODULES, REQUIREMENT_MAPPINGS, STANDARDS } from '@/components/spec/data';
import { CAPABILITY_GROUPS } from './requirements';

const OBSOLETE_TERMS = new RegExp(
  ['po', 'c|annex', 'ure|clau', 'se|', String.fromCodePoint(0xa7)].join(''),
  'i',
);

const requirementCopy = () =>
  CAPABILITY_GROUPS.flatMap((group) => [
    group.title,
    group.summary,
    ...group.requirements.flatMap((requirement) => [requirement.title, requirement.detail]),
  ]);

describe('approved requirements register', () => {
  it('preserves the mandated numeric and interface requirements', () => {
    const copy = requirementCopy().join(' | ');

    [
      '20 ms or less',
      '10 lakh events',
      '50 lakh events',
      '70%',
      '10 Mbps',
      'two years',
      'three years',
      '72 hours',
      '24 hours',
      'more than 60%',
      '10% or two',
      'Class 1',
      '2% accuracy or better',
      'less than 2%',
      '24V DC (+20% / -30%)',
      'Data Logger',
      'Integrated Power Supply',
      'Railway Cloud',
      'maintenance APIs',
      'common dashboard APIs',
      'CRL or OCSP',
    ].forEach((claim) => expect(copy).toContain(claim));
  });

  it('limits fast sampling to point-machine and lifting-barrier operations', () => {
    const sampling = CAPABILITY_GROUPS.flatMap((group) => group.requirements).find(
      ({ id }) => id === 'event-sampling',
    );

    expect(sampling?.detail).toContain('during each point-machine or electric lifting-barrier operation');
    expect(sampling?.detail).toContain('not continuous sampling of every channel');
  });

  it('keeps traceability metadata separate and classifies delivery status', () => {
    const requirements = CAPABILITY_GROUPS.flatMap((group) => group.requirements);

    expect(requirements.every(({ source }) => source.pdfPage >= 1 && source.pdfPage <= 215)).toBe(true);
    expect(new Set(requirements.map(({ status }) => status))).toEqual(
      new Set(['required', 'site-dependent', 'future-compatible']),
    );
  });

  it('maps key claims to their exact approved PDF pages', () => {
    const pages = Object.fromEntries(
      CAPABILITY_GROUPS.flatMap((group) => group.requirements).map(({ id, source }) => [
        id,
        source.pdfPage,
      ]),
    );

    expect(pages).toMatchObject({
      'event-sampling': 68,
      'iot-buffer': 15,
      'gateway-buffer': 18,
      'resource-headroom': 18,
      'station-uplinks': 22,
      'railway-cloud': 69,
      'data-retention': 26,
      'alert-performance': 28,
      'type-endurance': 30,
      'acceptance-endurance': 30,
      warranty: 33,
      'certificate-status': 70,
    });
  });

  it('requires both packet families in the Railway Cloud copy', () => {
    const cloudRequirement = CAPABILITY_GROUPS.flatMap((group) => group.requirements).find(
      ({ id }) => id === 'railway-cloud',
    );
    const cloudMatrixEntry = REQUIREMENT_MAPPINGS.find(({ ref }) => ref === 'Data custody');

    expect(cloudRequirement?.detail).toContain('image packets');
    expect(cloudRequirement?.detail).toContain('parameter packets');
    expect(cloudMatrixEntry?.design.toLowerCase()).toContain('image packets');
    expect(cloudMatrixEntry?.design.toLowerCase()).toContain('parameter packets');
  });

  it('keeps user-facing register and central specification copy jargon-free', () => {
    const centralCopy = [
      ...requirementCopy(),
      ...REQUIREMENT_MODULES.flatMap(({ title, role, chips }) => [title, role, ...chips]),
      ...REQUIREMENT_MAPPINGS.flatMap(({ ref, requirement, lands, design }) => [
        ref,
        requirement,
        lands,
        design,
      ]),
      ...STANDARDS.flatMap(({ body, name, role }) => [body, name, role]),
    ].join(' | ');

    expect(centralCopy).not.toMatch(OBSOLETE_TERMS);
  });

  it('maps the approved document modules accurately', () => {
    expect(REQUIREMENT_MODULES.map(({ letter, title }) => [letter, title])).toEqual([
      ['A', 'Standard field and packet naming'],
      ['B', 'Gateway and application data exchange'],
      ['C', 'Failure, prediction and AI model guidance'],
      ['D', 'Alert workflow and application processes'],
      ['E', 'Desktop application interface'],
      ['F', 'Common dashboard APIs'],
      ['G', 'Mobile application interface'],
    ]);
  });

  it('does not present unsupported targets or standards as approved requirements', () => {
    const copy = JSON.stringify({ REQUIREMENT_MAPPINGS, STANDARDS });
    const standardNames = STANDARDS.map(({ name }) => name);
    const recommendations = STANDARDS.filter(({ role }) =>
      role.startsWith('Programme recommendation:'),
    );

    expect(copy).not.toMatch(/[≥>]99%/);
    ['5338', '42001', '23894'].forEach((forbidden) => {
      expect(standardNames.some((name) => name.includes(forbidden))).toBe(false);
    });
    expect(recommendations).toHaveLength(1);
    expect(recommendations[0]).toMatchObject({ body: 'C-DOT', accent: 'blue' });
  });
});
