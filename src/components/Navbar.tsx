import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Minus, Plus, Check, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDiagram } from '@/lib/diagram-context';
import type { FlowMode } from '@/lib/diagram-context';

const NAV_LINKS = [
  { to: '/', label: 'LLD Diagram' },
  { to: '/deep-dive', label: 'Deep Dive' },
  { to: '/field-assets', label: 'Field Assets' },
  { to: '/delivery-plan', label: 'Delivery Plan' },
  { to: '/spec', label: 'Requirements' },
];

function FlowToggle() {
  const { mode, setMode } = useDiagram();
  const options: { id: FlowMode; label: string }[] = [
    { id: 'all', label: 'All statuses' },
    { id: 'required', label: 'Required only' },
  ];
  return (
    <div className="flex items-center rounded-full bg-raised p-1" role="tablist" aria-label="Capability status filter">
      {options.map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => setMode(opt.id)}
            className={cn(
              'relative rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
              active ? (opt.id === 'required' ? 'text-flow-required' : 'text-flow-all') : 'text-text-tertiary hover:text-text-primary',
            )}
          >
            {active && (
              <motion.span
                layoutId="flow-toggle-thumb"
                className="absolute inset-0 rounded-full bg-raised-2 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { zoom, zoomIn, zoomOut, fit, downloadSvg, controlsReady } = useDiagram();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  const handleDownload = (orientation: 'landscape' | 'portrait' = 'landscape') => {
    downloadSvg(orientation);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const zoomBtn =
    'flex h-7 w-7 items-center justify-center rounded-md border border-stroke-default bg-container text-text-tertiary transition-colors hover:border-flow-required-soft hover:text-text-primary active:scale-95 cursor-pointer disabled:opacity-50';

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 h-16 w-full border-b border-stroke-default bg-page/95',
        scrolled && 'backdrop-blur-md bg-page/85',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1560px] items-center justify-between gap-3 px-4 lg:px-6">
        {/* Brand */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src="/wayam-favicon.svg" alt="Wayam logo" className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="min-w-0 leading-tight">
            <div className="font-display text-[17px] font-bold text-text-primary">RDPMS LLD</div>
            <div className="hidden truncate font-mono text-[10px] uppercase tracking-[0.08em] text-text-quaternary xl:block">
              Remote Diagnostics &amp; Predictive Maintenance · RDSO/SPN/257/2025
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-raised text-flow-required'
                    : 'text-text-tertiary hover:bg-raised hover:text-text-primary',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          {isHome && (
            <>
              <div className="hidden lg:block">
                <FlowToggle />
              </div>
              <div className="hidden items-center gap-1 md:flex" aria-label="Zoom controls">
                <motion.button whileTap={{ scale: 0.95 }} className={zoomBtn} onClick={zoomOut} disabled={!controlsReady} aria-label="Zoom out">
                  <Minus className="h-3.5 w-3.5" />
                </motion.button>
                <span className="w-10 text-center font-mono text-[11px] text-text-tertiary">{Math.round(zoom * 100)}%</span>
                <motion.button whileTap={{ scale: 0.95 }} className={zoomBtn} onClick={zoomIn} disabled={!controlsReady} aria-label="Zoom in">
                  <Plus className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="h-7 rounded-md border border-stroke-default bg-container px-2 font-mono text-[10px] font-medium text-text-tertiary transition-colors hover:border-flow-required-soft hover:text-text-primary active:scale-95 cursor-pointer disabled:opacity-50"
                  onClick={fit}
                  disabled={!controlsReady}
                >
                  FIT
                </motion.button>
              </div>
            </>
          )}

          {isHome && (
            <div className="hidden items-center gap-1 sm:flex">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDownload('landscape')}
                disabled={!controlsReady}
                className="flex h-8 items-center gap-2 rounded-lg bg-flow-required px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#c24a0a] disabled:opacity-50 cursor-pointer"
              >
                {saved ? <Check className="h-4 w-4 text-white" /> : <Download className="h-4 w-4" />}
                <span>{saved ? 'SVG saved' : 'Download SVG'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleDownload('portrait')}
                disabled={!controlsReady}
                className="flex h-8 items-center rounded-lg border border-stroke-default bg-container px-2.5 text-[12px] font-semibold text-text-secondary transition-colors hover:border-flow-required-soft hover:text-text-primary disabled:opacity-50 cursor-pointer"
              >
                Vertical
              </motion.button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-stroke-default bg-container text-text-tertiary md:hidden cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-stroke-default bg-page md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-[14px] font-medium transition-colors',
                      isActive ? 'bg-raised text-flow-required' : 'text-text-tertiary hover:bg-raised',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {isHome && (
                <div className="mt-2 flex flex-col gap-3 border-t border-stroke-default pt-3">
                  <div className="flex justify-center">
                    <FlowToggle />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button className={zoomBtn} onClick={zoomOut} disabled={!controlsReady} aria-label="Zoom out">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-11 text-center font-mono text-xs text-text-tertiary">{Math.round(zoom * 100)}%</span>
                    <button className={zoomBtn} onClick={zoomIn} disabled={!controlsReady} aria-label="Zoom in">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="h-8 rounded-md border border-stroke-default bg-container px-2.5 font-mono text-[11px] font-medium text-text-tertiary transition-colors hover:border-flow-required-soft hover:text-text-primary disabled:opacity-50"
                      onClick={fit}
                      disabled={!controlsReady}
                    >
                      FIT
                    </button>
                  </div>
                  <button
                    onClick={() => handleDownload('landscape')}
                    disabled={!controlsReady}
                    className="flex h-9 items-center justify-center gap-2 rounded-lg bg-flow-required px-3.5 text-[13px] font-semibold text-white disabled:opacity-50"
                  >
                    {saved ? <Check className="h-4 w-4 text-white" /> : <Download className="h-4 w-4" />}
                    <span>{saved ? 'SVG saved' : 'Download SVG'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('portrait')}
                    disabled={!controlsReady}
                    className="flex h-9 items-center justify-center rounded-lg border border-stroke-default bg-container px-3.5 text-[13px] font-semibold text-text-secondary disabled:opacity-50"
                  >
                    Vertical SVG
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
