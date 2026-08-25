// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { DiagramProvider, useDiagram } from '@/lib/diagram-context';
import Navbar from '@/components/Navbar';
import DiagramStage from './DiagramStage';

function iconResponse(input: RequestInfo | URL) {
  const src = String(input);
  const bytes = readFileSync(new URL(`../../../public${src}`, import.meta.url));
  return new Response(bytes, { headers: { 'Content-Type': 'image/jpeg' } });
}

function DiagramHarness() {
  const { setMode } = useDiagram();
  return (
    <>
      <button type="button" onClick={() => setMode('required')}>
        Show required only
      </button>
      <DiagramStage />
    </>
  );
}

function renderDiagram() {
  return render(
    <DiagramProvider>
      <DiagramHarness />
    </DiagramProvider>,
  );
}

describe('DiagramStage interactions', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => iconResponse(input)));
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1200,
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('rearranges the live board into side-by-side layers when vertical view is selected', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DiagramProvider>
          <Navbar />
          <DiagramStage />
        </DiagramProvider>
      </MemoryRouter>,
    );

    const field0 = screen.getByRole('article', { name: /Point machines/i });
    const field2 = screen.getByRole('article', { name: /^Signals/i });
    expect(field2.style.top).toBe(field0.style.top);

    await user.click(screen.getByRole('tab', { name: 'Vertical' }));

    expect(Number.parseFloat(field2.style.top)).toBeGreaterThan(Number.parseFloat(field0.style.top));
    expect(screen.getByRole('tab', { name: 'Vertical' }).getAttribute('aria-selected')).toBe('true');
  });

  it('renders locally stored 3D JPEG artwork on diagram cards', () => {
    renderDiagram();
    const card = screen.getByRole('article', { name: /Point machines/i });
    const icon = card.querySelector('img');
    expect(icon?.getAttribute('src')).toMatch(/^\/icons\/.+\.jpeg$/);
  });

  it('removes site-dependent and future cards when required-only is selected', async () => {
    const user = userEvent.setup();
    renderDiagram();

    expect(screen.getByRole('article', { name: /Field media/i })).toBeTruthy();
    expect(screen.getByRole('article', { name: /Shared-service migration/i })).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Show required only' }));

    expect(screen.queryByRole('article', { name: /Field media/i })).toBeNull();
    expect(screen.queryByRole('article', { name: /Shared-service migration/i })).toBeNull();
    expect(screen.getByRole('article', { name: /Point machines/i })).toBeTruthy();
  });

  it('changes the rendered view when keyboard pan and zoom controls are used', () => {
    renderDiagram();
    const region = screen.getByRole('region', { name: /Interactive RDPMS/i });
    const transform = screen.getByTestId('diagram-transform');
    const initialScale = transform.getAttribute('data-view-scale');

    fireEvent.keyDown(region, { key: '+' });
    expect(transform.getAttribute('data-view-scale')).not.toBe(initialScale);

    const xAfterZoom = transform.getAttribute('data-view-x');
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(transform.getAttribute('data-view-x')).not.toBe(xAfterZoom);
  });

  it('does not prevent ordinary wheel scrolling but Ctrl and Meta wheel zoom', () => {
    renderDiagram();
    const region = screen.getByRole('region', { name: /Interactive RDPMS/i });
    const transform = screen.getByTestId('diagram-transform');

    const ordinaryWheel = createEvent.wheel(region, { deltaY: 100 });
    fireEvent(region, ordinaryWheel);
    expect(ordinaryWheel.defaultPrevented).toBe(false);

    const beforeCtrl = transform.getAttribute('data-view-scale');
    const ctrlWheel = createEvent.wheel(region, { deltaY: -100, ctrlKey: true });
    fireEvent(region, ctrlWheel);
    expect(ctrlWheel.defaultPrevented).toBe(true);
    expect(transform.getAttribute('data-view-scale')).not.toBe(beforeCtrl);

    const beforeMeta = transform.getAttribute('data-view-scale');
    const metaWheel = createEvent.wheel(region, { deltaY: 100, metaKey: true });
    fireEvent(region, metaWheel);
    expect(metaWheel.defaultPrevented).toBe(true);
    expect(transform.getAttribute('data-view-scale')).not.toBe(beforeMeta);
  });

  it('reveals semantic card details when the card receives keyboard focus', async () => {
    const user = userEvent.setup();
    renderDiagram();
    const card = screen.getByRole('article', { name: /Protocol conversion/i });
    const detailsId = card.getAttribute('aria-describedby');
    const details = document.getElementById(String(detailsId));

    expect(details?.getAttribute('aria-hidden')).toBe('true');
    await user.tab();
    while (document.activeElement !== card) await user.tab();
    expect(details?.getAttribute('aria-hidden')).toBe('false');
  });

  it('surfaces local icon loading failure as an alert', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('missing', { status: 404 })),
    );
    renderDiagram();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Unable to load diagram icons/i);
  });
});
