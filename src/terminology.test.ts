/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const FORBIDDEN = new RegExp(
  ['po', 'c|annex', 'ure|clau', 'se|', String.fromCodePoint(0xa7)].join(''),
  'i',
);
const LEGACY_ROUTE = ['/po', 'c-roadmap'].join('');
const LEGACY_ROUTE_ELEMENT = new RegExp(
  [
    '<Route\\s+path="',
    LEGACY_ROUTE,
    '"\\s+element=\\{<Navigate\\s+to="/delivery-plan"\\s+replace\\s*/>\\}\\s*/>',
  ].join(''),
  'g',
);
const PACKAGE_LOCK = resolve(ROOT, 'package-lock.json');
const EXCLUDED_DIRECTORIES = new Set(['.git', 'dist', 'node_modules']);
const EXCLUDED_FILES = new Set([
  'Approved RDPMS SPN 31_12_25 signed.pdf',
  'RDPMS-Development-Roadmap-and-Technical-Delivery-Approach.md',
]);
const TEXT_EXTENSIONS = new Set([
  '.cjs',
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);
const SPDX_BSD_LICENSE = new RegExp(['^BSD-[23]-Clau', 'se$'].join(''));

function repositoryFiles(directory: string, paths: string[]): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) return [];
    if (entry.isFile() && EXCLUDED_FILES.has(entry.name)) return [];

    const path = resolve(directory, entry.name);
    paths.push(path);
    if (entry.isDirectory()) return repositoryFiles(path, paths);
    const isRootDotfile = directory === ROOT && entry.name.startsWith('.');
    return TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase()) || isRootDotfile ? [path] : [];
  });
}

function addViolation(violations: string[], location: string, value: string) {
  if (FORBIDDEN.test(value)) violations.push(`${location}: ${value.trim()}`);
}

function scanPackageLock(
  value: unknown,
  location: string,
  violations: string[],
  propertyName?: string,
) {
  if (typeof value === 'string') {
    if (propertyName === 'license' && SPDX_BSD_LICENSE.test(value)) return;
    addViolation(violations, location, value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanPackageLock(item, `${location}[${index}]`, violations));
    return;
  }
  if (!value || typeof value !== 'object') return;

  Object.entries(value).forEach(([key, child]) => {
    addViolation(violations, `${location} key`, key);
    scanPackageLock(child, `${location}.${key}`, violations, key);
  });
}

describe('repository terminology', () => {
  it('uses current terminology in repository text, package metadata, and paths', () => {
    const paths: string[] = [];
    const files = repositoryFiles(ROOT, paths);
    const violations: string[] = [];
    const appPath = resolve(ROOT, 'src', 'App.tsx');
    const appSource = readFileSync(appPath, 'utf8');
    const redirectPathAttribute = `path="${LEGACY_ROUTE}"`;

    paths.forEach((path) => {
      const repositoryPath = relative(ROOT, path).replaceAll('\\', '/');
      if (FORBIDDEN.test(repositoryPath)) violations.push(`path: ${repositoryPath}`);
    });

    for (const file of files) {
      const repositoryPath = relative(ROOT, file).replaceAll('\\', '/');
      if (file === PACKAGE_LOCK) continue;

      readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
        const content =
          file === appPath ? line.replace(redirectPathAttribute, 'path=""') : line;
        addViolation(violations, `${repositoryPath}:${index + 1}`, content);
      });
    }

    const lock: unknown = JSON.parse(readFileSync(PACKAGE_LOCK, 'utf8'));
    scanPackageLock(lock, 'package-lock', violations);

    expect(appSource.split(LEGACY_ROUTE)).toHaveLength(2);
    expect(appSource.split(redirectPathAttribute)).toHaveLength(2);
    expect(appSource.match(LEGACY_ROUTE_ELEMENT)).toHaveLength(1);
    expect(violations).toEqual([]);
  });

  it('allows only exact generated BSD license identifiers', () => {
    const bsd2 = ['BSD-2-Clau', 'se'].join('');
    const bsd3 = ['BSD-3-Clau', 'se'].join('');
    const allowed: string[] = [];
    const surrounded: string[] = [];
    const wrongProperty: string[] = [];

    scanPackageLock({ license: bsd2 }, 'package-lock', allowed);
    scanPackageLock({ license: `prefix ${bsd3} suffix` }, 'package-lock', surrounded);
    scanPackageLock({ description: bsd3 }, 'package-lock', wrongProperty);

    expect(allowed).toEqual([]);
    expect(surrounded).toHaveLength(1);
    expect(wrongProperty).toHaveLength(1);
  });

  it('exempts only the legacy route path attribute', () => {
    const redirectPathAttribute = `path="${LEGACY_ROUTE}"`;
    const otherObsoleteTerm = ['clau', 'se'].join('');
    const routeWithOtherJargon =
      `<Route ${redirectPathAttribute} element={<Navigate to="/delivery-plan" replace />} />` +
      ` // ${otherObsoleteTerm}`;
    const scannedContent = routeWithOtherJargon.replace(redirectPathAttribute, 'path=""');

    expect(FORBIDDEN.test(scannedContent)).toBe(true);
  });
});
