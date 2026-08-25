import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ICON_IMAGES } from '@/components/home/diagramModel';

/** Sprite-based line icon (public/icon-sprite.svg). */
export function Icon({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={cn('h-6 w-6', className)} aria-hidden="true">
      <use href={`/icon-sprite.svg#${id}`} />
    </svg>
  );
}

/** Locally stored 3D JPEG artwork from public/icons. */
export function Icon3D({ id, className }: { id: string; className?: string }) {
  const src = ICON_IMAGES[id];
  if (!src) {
    throw new Error(`Unknown diagram icon: ${id}`);
  }
  return <img src={src} alt="" className={cn('h-full w-full object-contain', className)} />;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('font-mono text-xs font-semibold uppercase tracking-eyebrow text-flow-required', className)}>
      {children}
    </div>
  );
}

export function NumberPill({ n, className }: { n: string; className?: string }) {
  return (
    <span
      className={cn(
        'flex h-7 w-8 items-center justify-center rounded-md bg-flow-required font-mono text-[13px] font-bold text-white',
        className,
      )}
    >
      {n}
    </span>
  );
}

export function SpecChip({ children, tone = 'required' }: { children: React.ReactNode; tone?: 'required' | 'slate' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-medium',
        tone === 'required' ? 'bg-flow-required-bg text-flow-required-bright' : 'bg-raised text-text-secondary',
      )}
    >
      {children}
    </span>
  );
}

/** Very small JSON syntax highlighter: keys green, strings amber, numbers blue. */
function highlightJson(json: string) {
  const esc = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m, str, colon, kw, num) => {
      if (str) {
        return colon
          ? `<span style="color:#15803D">${str}</span>${colon}`
          : `<span style="color:#B45309">${str}</span>`;
      }
      if (kw) return `<span style="color:#7C3AED">${kw}</span>`;
      if (num) return `<span style="color:#1D4ED8">${num}</span>`;
      return m;
    },
  );
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="relative overflow-hidden rounded-xl border border-stroke-default bg-code-bg">
      <div className="flex items-center justify-between border-b border-stroke-default px-4 py-2">
        <span className="font-mono text-[11px] text-text-quaternary">{title ?? 'json'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-text-tertiary transition-colors hover:bg-raised-2 hover:text-text-primary cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-code-green" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-text-secondary">
        <code dangerouslySetInnerHTML={{ __html: highlightJson(code) }} />
      </pre>
    </div>
  );
}

export function PhotoPlate({
  src,
  caption,
  chip,
  className,
}: {
  src: string;
  caption: string;
  chip?: string;
  className?: string;
}) {
  return (
    <figure className={cn('overflow-hidden rounded-2xl border border-band-border bg-band shadow-lg shadow-black/10', className)}>
      <div className="relative">
        <img src={src} alt={caption} className="aspect-[16/10] w-full object-cover" loading="lazy" />
        {chip && (
          <span className="absolute right-3 top-3">
            <SpecChip>{chip}</SpecChip>
          </span>
        )}
      </div>
      <figcaption className="border-t border-band-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">
        {caption}
      </figcaption>
    </figure>
  );
}

export function KpiCard({
  value,
  suffix,
  caption,
  status = 'ok',
}: {
  value: string;
  suffix?: string;
  caption: string;
  status?: 'ok' | 'amber' | 'alert';
}) {
  const dot = status === 'ok' ? 'bg-ok' : status === 'amber' ? 'bg-amber' : 'bg-alert';
  return (
    <div className="diagram-card rounded-xl border border-band-border bg-band p-5">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold text-ink">{value}</span>
        {suffix && <span className="font-display text-lg font-semibold text-ink-soft">{suffix}</span>}
        <span className={cn('ml-auto h-2.5 w-2.5 rounded-full', dot)} />
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">{caption}</div>
    </div>
  );
}
