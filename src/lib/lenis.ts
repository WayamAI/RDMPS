import Lenis from 'lenis';

let lenis: Lenis | null = null;
let raf = 0;

export function initLenis() {
  if (lenis) return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return lenis;
}

export function destroyLenis() {
  cancelAnimationFrame(raf);
  lenis?.destroy();
  lenis = null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.1 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
