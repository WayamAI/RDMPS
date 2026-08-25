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
const REMOVED_PAGE = '/delivery-plan';
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

    paths.forEach((path) => {
      const repositoryPath = relative(ROOT, path).replaceAll('\\', '/');
      if (FORBIDDEN.test(repositoryPath)) violations.push(`path: ${repositoryPath}`);
    });

    for (const file of files) {
      const repositoryPath = relative(ROOT, file).replaceAll('\\', '/');
      if (file === PACKAGE_LOCK) continue;

      readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
        addViolation(violations, `${repositoryPath}:${index + 1}`, line);
      });
    }

    const lock: unknown = JSON.parse(readFileSync(PACKAGE_LOCK, 'utf8'));
    scanPackageLock(lock, 'package-lock', violations);

    expect(appSource).not.toContain(REMOVED_PAGE);
    expect(appSource).not.toContain(LEGACY_ROUTE);
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

  it('keeps the removed page and legacy roadmap route out of the app shell', () => {
    const appSource = readFileSync(resolve(ROOT, 'src', 'App.tsx'), 'utf8');
    expect(appSource).not.toContain(REMOVED_PAGE);
    expect(appSource).not.toContain(LEGACY_ROUTE);
    expect(appSource).not.toContain('DeliveryPlan');
  });
});
