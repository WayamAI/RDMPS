import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Design-system easing: cubic-bezier(0.22, 1, 0.36, 1)  ease-out-expo feel */
export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const FONT_DISPLAY = 'font-display'
export const FONT_BODY = 'font-sans'
export const FONT_MONO = 'font-mono'

/** Mono uppercase eyebrow label, orange */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`${FONT_MONO} text-[11px] uppercase tracking-[0.14em] text-flow-required ${className}`}
    >
      {children}
    </motion.p>
  )
}

/** H1 with char-split rise animation (18ms stagger) */
export function CharRise({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const chars = Array.from(text)
  return (
    <h1
      className={`${FONT_DISPLAY} font-bold tracking-tight text-text-primary ${className}`}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: delay + i * 0.018 }}
          >
            {c === ' ' ? '\u00A0' : c}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

/** Spec chip: mono pill on dark container */
export function SpecChip({
  children,
  tone = 'orange',
  delay = 0,
  inView = false,
}: {
  children: ReactNode
  tone?: 'orange' | 'slate' | 'navy'
  delay?: number
  inView?: boolean
}) {
  const tones: Record<string, string> = {
    orange: 'bg-flow-required/15 text-flow-required border-flow-required/30',
    slate: 'bg-container text-text-secondary border-stroke-default',
    navy: 'bg-raised text-text-primary border-stroke-default',
  }
  const animProps = inView
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.4 } }
    : { animate: { opacity: 1, y: 0 } }
  return (
    <motion.span
      initial={{ opacity: 0, y: 14 }}
      {...animProps}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className={`${FONT_MONO} inline-flex items-center rounded-full border px-3 py-1 text-[11px] leading-none ${tones[tone]}`}
    >
      {children}
    </motion.span>
  )
}

/** Scroll-triggered slide-up wrapper (40px, trigger at 20–25% viewport) */
export function Reveal({
  children,
  className = '',
  delay = 0,
  amount = 0.25,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
