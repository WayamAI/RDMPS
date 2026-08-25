import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';

let initialized = false;

function ensureMermaid() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif',
    themeVariables: {
      darkMode: false,
      background: '#FFFFFF',
      primaryColor: '#FFF7ED',
      primaryTextColor: '#0A0A0A',
      primaryBorderColor: '#EA580C',
      secondaryColor: '#F4F4F6',
      secondaryTextColor: '#0A0A0A',
      secondaryBorderColor: '#E4E4E7',
      tertiaryColor: '#EFF6FF',
      tertiaryTextColor: '#0A0A0A',
      tertiaryBorderColor: '#60A5FA',
      lineColor: '#EA580C',
      textColor: '#0A0A0A',
      mainBkg: '#FFFFFF',
      nodeBorder: '#E4E4E7',
      clusterBkg: '#F4F4F6',
      clusterBorder: '#E4E4E7',
      titleColor: '#0A0A0A',
      edgeLabelBackground: '#FFFFFF',
      actorBkg: '#FFF7ED',
      actorBorder: '#EA580C',
      actorTextColor: '#0A0A0A',
      signalColor: '#EA580C',
      signalTextColor: '#0A0A0A',
      labelBoxBkgColor: '#FFFFFF',
      labelBoxBorderColor: '#E4E4E7',
      labelTextColor: '#52525B',
      noteBkgColor: '#FFFBEB',
      noteTextColor: '#0A0A0A',
      noteBorderColor: '#B45309',
      // Gantt
      gridColor: '#E4E4E7',
      section0: '#FFF7ED',
      section1: '#EFF6FF',
      section2: '#F4F4F6',
      section3: '#FEF2F2',
      taskBkgColor: '#EA580C',
      taskBorderColor: '#C2410C',
      taskTextColor: '#FFFFFF',
      taskTextDarkColor: '#FFFFFF',
      taskTextLightColor: '#FFFFFF',
      taskTextOutsideColor: '#0A0A0A',
      activeTaskBkgColor: '#FB923C',
      activeTaskBorderColor: '#EA580C',
      doneTaskBkgColor: '#F4F4F6',
      doneTaskBorderColor: '#A1A1AA',
      critBkgColor: '#DC2626',
      critBorderColor: '#B91C1C',
      todayLineColor: '#2563EB',
    },
    flowchart: {
      curve: 'basis',
      padding: 16,
      htmlLabels: true,
      nodeSpacing: 36,
      rankSpacing: 48,
    },
    gantt: {
      fontSize: 12,
      sectionFontSize: 13,
      barHeight: 28,
      barGap: 10,
      topPadding: 48,
      leftPadding: 160,
      gridLineStartPadding: 12,
      numberSectionStyles: 4,
    },
    sequence: {
      actorMargin: 48,
      messageMargin: 36,
      mirrorActors: false,
    },
  });
  initialized = true;
}

export function MermaidDiagram({
  chart,
  className,
  ariaLabel,
}: {
  chart: string;
  className?: string;
  ariaLabel?: string;
}) {
  const reactId = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureMermaid();

    (async () => {
      try {
        const { svg: rendered } = await mermaid.render(`mermaid-${reactId}`, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          setSvg('');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div
        className={cn(
          'rounded-xl border border-alert/30 bg-tint-alert px-4 py-3 font-mono text-[12px] text-alert',
          className,
        )}
        role="alert"
      >
        Diagram render error: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className={cn(
          'flex min-h-[180px] items-center justify-center rounded-xl border border-stroke-default bg-raised font-mono text-[11px] uppercase tracking-wide text-text-quaternary',
          className,
        )}
        aria-busy="true"
      >
        Rendering diagram…
      </div>
    );
  }

  return (
    <div
      className={cn('mermaid-host w-full overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full', className)}
      role="img"
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
