import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { DiagramProvider } from '@/lib/diagram-context';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import RequirementsIndex from './RequirementsIndex';
import ArchitectureFigure from './ArchitectureFigure';
import RequirementTraceability from './RequirementTraceability';
import ClosingCTA from './ClosingCTA';
import SpecHero from './SpecHero';
import StandardsRegister from './StandardsRegister';

const OBSOLETE_TERMS = new RegExp(
  ['po', 'c|annex', 'ure|clau', 'se|', String.fromCodePoint(0xa7)].join(''),
  'i',
);

const renderHtml = (Component: ComponentType, path = '/spec') =>
  renderToStaticMarkup(
    createElement(
      MemoryRouter,
      { initialEntries: [path] },
      createElement(DiagramProvider, null, createElement(Component)),
    ),
  );

const visibleText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

describe('specification page content', () => {
  it('keeps prohibited internal jargon out of rendered copy', () => {
    const rendered = [
      Navbar,
      SpecHero,
      ArchitectureFigure,
      RequirementsIndex,
      RequirementTraceability,
      StandardsRegister,
      ClosingCTA,
      Footer,
    ]
      .map((Component) => visibleText(renderHtml(Component)))
      .join(' ');

    expect(rendered).not.toMatch(OBSOLETE_TERMS);
  });

  it('renders the operation-specific 20 ms requirement in the matrix', () => {
    const rendered = visibleText(renderHtml(RequirementTraceability));

    expect(rendered).toContain('20 ms');
    expect(rendered).toContain('Point machines and electric lifting barriers');
  });

  it('offers a truthful working secondary action', () => {
    const rendered = renderHtml(ClosingCTA);

    expect(rendered).toContain('href="/field-assets"');
    expect(visibleText(rendered)).toContain('Explore field assets');
    expect(visibleText(rendered)).not.toContain('Download SVG');
  });
});
